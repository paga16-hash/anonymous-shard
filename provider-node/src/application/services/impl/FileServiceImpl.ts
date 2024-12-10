import {FileId} from "../../../domain/core/file/FileId.js";
import {FileRepository} from "../../repositories/FileRepository.js";
import {FileService} from "../FileService.js";

export class FileServiceImpl implements FileService {
    private readonly fileRepository: FileRepository

    constructor(fileRepository: FileRepository) {
        this.fileRepository = fileRepository
    }

    async getById(id: FileId): Promise<File> {
        return this.fileRepository.getById(id)
    }

    async upload(file: File): Promise<void> {
        return this.fileRepository.save(file)
    }

    async delete(id: FileId): Promise<void> {
        return this.fileRepository.delete(id)
    }
}