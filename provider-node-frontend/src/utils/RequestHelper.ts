import axios, {type AxiosRequestConfig, type AxiosResponse, HttpStatusCode} from 'axios'
import router from "../router";
import {SocksProxyAgent} from 'socks-proxy-agent';
import http from 'http';
import {HttpsProxyAgent} from "https-proxy-agent";

/*
* const HttpsProxyAgent = require('https-proxy-agent');

// Configure Axios to use the Tor proxy
const proxyAgent = new HttpsProxyAgent('socks5h://127.0.0.1:9050');
* */
type Headers = {
    headers: {
        Authorization: string
    }
}

const getHost = (): string => {
    const protocol: string = 'http://'
    return protocol + import.meta.env.VITE_PROVIDER_HOST + ":" + (parseInt(import.meta.env.VITE_PROVIDER_PORT!) + 1000)
}

export const providerHost: string = getHost()

export default class RequestHelper {
    private static isAnonymousMode: boolean = import.meta.env.VITE_ANONYMOUS_MODE === 'true';
    /*private static proxyAddress: string = `socks5h://${import.meta.env.VITE_SOCKS5_HOST}:${import.meta.env.VITE_SOCKS5_PORT}`;
    private static proxyAgent = RequestHelper.isAnonymousMode
        ? new SocksProxyAgent(`socks5h://${import.meta.env.VITE_SOCKS5_HOST}:${import.meta.env.VITE_SOCKS5_PORT}`)
        : undefined;*/

    static getHeaders(): Headers {
        return {headers: {Authorization: `Bearer ${import.meta.env.VITE_DEV_API_KEY}`}}
    }

    /*private static getRequestConfig(): AxiosRequestConfig {
        return this.isAnonymousMode && this.proxyAgent
            ? {
                httpAgent: this.proxyAgent, httpsAgent: this.proxyAgent
            }
            : {};
    }*/

    static async get(url: string): Promise<AxiosResponse | void> {
        //console.log(this.proxyAddress, this.isAnonymousMode)
        //const agent2: SocksProxyAgent = new SocksProxyAgent(this.proxyAddress)
        //const proxyAgent = new HttpsProxyAgent('socks5h://127.0.0.1:9050');
        //const http = require('http');
        //'User-Agent': 'curl/7.64.1'

        /*const agent = new http.Agent({
            host: 'localhost', // Replace with your proxy host
            port: 9050,        // Tor SOCKS proxy port (default for Tor is 9050)
            protocol: 'socks5:', // Protocol for SOCKS
        });*/
        console.log("Making a GET request to the Tor hidden service...", url);

        async function makeRequest() {
            try {
                const response = await axios.get("http://127.0.0.1:4000/peers/");

                // Log the response
                console.log('Response:', response.data);
            } catch (error) {
                // Handle errors
                console.error('Error making request:', error);
            }
        }

// Call the function to make the request
        await makeRequest();
        //return
        /*return await axios.get(url, { ...this.getRequestConfig(), ...this.getHeaders() }).catch((error): void => {
            this.errorHandling(error);
        });*/
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
