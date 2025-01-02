import axios, {type AxiosResponse, HttpStatusCode} from 'axios'
import router from "../router";

type Headers = {
    headers: {
        Authorization: string
    }
}

const protocol: string = 'http://'

const getHost = (service: string): string => {
    if (import.meta.env.DEV) {
        return protocol + 'localhost:' + import.meta.env[`VITE_${service.toUpperCase().replace('-', '_')}_PORT`]
    } else if (window.location.href.includes('localhost')) {
        return protocol + service + '.localhost'
    } else {
        return protocol + service
    }
}

export const consumerHost = "127.0.0.1"//getHost(import.meta.env.CONSUMER_NODE_HOST)

export default class RequestHelper {
    static getHeaders(): Headers {
        return {headers: {Authorization: `Bearer ${import.meta.env.DEV_API_KEY}`}}
    }

    static async get(url: string): Promise<AxiosResponse | void> {
        return await axios.get(url, this.getHeaders()).catch((error): void => {
            this.errorHandling(error)
        })
    }

    static async post(url: string, body?: any): Promise<AxiosResponse | void> {
        return await axios.post(url, body, this.getHeaders()).catch((error): void => {
            this.errorHandling(error)
        })
    }

    static async put(url: string, body?: any): Promise<AxiosResponse> {
        return await axios.put(url, body, this.getHeaders())
    }

    static async delete(url: string): Promise<AxiosResponse> {
        return await axios.delete(url, this.getHeaders())
    }

    private static errorHandling(error: any): void {
        if (error.code === 'ECONNREFUSED') {
            console.error('Connection refused. Please check if the server is running.')
        }
        if (error.response) {
            if (error.response.status === HttpStatusCode.Forbidden) {
                router.push('/')
            }
        }
    }
}
