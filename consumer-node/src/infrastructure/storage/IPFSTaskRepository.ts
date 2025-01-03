import axios, { AxiosResponse } from 'axios'
import { TaskRepository } from '../../application/repositories/TaskRepository.js'
import { TaskResult } from '../../domain/core/task/TaskResult.js'
import { Encryptor } from '../encryption/Encryptor.js'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as process from 'node:process'
import { TaskId } from '../../domain/core/task/TaskId'

export class IPFSTaskRepository implements TaskRepository {
  private readonly gatewayUrl: string
  private readonly encryptor: Encryptor
  private readonly resultsDirPath: string = path.resolve('results')

  constructor(encryptor: Encryptor, gatewayUrl: string = 'https://gateway.pinata.cloud/ipfs') {
    this.encryptor = encryptor
    this.gatewayUrl = gatewayUrl
  }

  async save(cId: string, result: TaskResult): Promise<void> {
    try {
      const filePath: string =
        this.resultsDirPath + '/results-' + process.env.HOST + 'on' + process.env.PORT + '.json'
      const resultsData: string = await fs.readFile(filePath, 'utf-8').catch(() => '{}')
      const resultsJson: Record<string, any> = JSON.parse(resultsData)
      resultsJson[cId] = result
      await fs.writeFile(filePath, JSON.stringify(resultsJson, null, 2), 'utf-8')
      console.log('Task result successfully saved to local storage.')
    } catch (err) {
      console.error('Failed to save task result to local storage:', err)
    }
  }

  async retrieve(privateKey: string, cId: string): Promise<TaskResult> {
    try {
      const url: string = `${this.gatewayUrl}/${cId}`
      console.log(`Retrieving TaskResult from IPFS: ${url}`)
      const response: AxiosResponse<any, any> = await axios.get(url)
      //TODO VALIDATION LAYER
      const decryptedTaskResult: string = await this.encryptor.decrypt(privateKey, response.data.enc)
      return decryptedTaskResult as unknown as TaskResult
    } catch (error) {
      console.error('Error retrieving TaskResult from IPFS:', error)
      throw error
    }
  }

  async retrieveLocally(taskId: TaskId): Promise<TaskResult> {
    try {
      const filePath: string =
        this.resultsDirPath + '/results-' + process.env.HOST + 'on' + process.env.PORT + '.json'
      const resultsData: string = await fs.readFile(filePath, 'utf-8').catch(() => '{}')
      const resultsJson: Record<string, any> = JSON.parse(resultsData)
      return Object.values(resultsJson).find((value: any) => value.taskId.value === taskId.value)
    } catch (err) {
      console.error('Failed to retrieve task result from local storage:', err)
      throw err
    }
  }
}
