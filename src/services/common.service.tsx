import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import store from 'store'
import { exportApi } from './export.service'
import { ErrorHandler } from 'utils'

export default class CommonService {
  axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL
    })

    this.axiosInstance.interceptors.request.use((request: InternalAxiosRequestConfig) => {
      const headers: any = request.headers || {}
      headers['Accept'] = 'application/json'
      headers['Content-Type'] = 'application/json'
      headers['Authorization'] = `Bearer ${store.get(`${process.env.REACT_APP_ACCESS_TOKEN_KEY}`)}`
      request.headers = headers

      return request
    })

    this.axiosInstance.interceptors.response.use(
      (results: AxiosResponse) => {
        return results.data
      },
      (error: AxiosError) => {
        const resp: any = error.response as any
        if (resp?.status === 401 && resp?.data?.message === 'Unauthorized') {
          store.clearAll()
          window.location.href = '/login'
        }
        if (resp?.status) {
          const fallingTime = new Date().toISOString()
          const errorSendingData = {
            'baseURL': error.config?.baseURL,
            'method': error.config?.method,
            'endPoint': error.config?.url,
            'ApiResponse': resp.data,
            'payloads': error.config?.data ? JSON.parse(error.config.data as any) : null,
            'status': resp.status,
            'statusText': resp.statusText,
            'apiFailTime': fallingTime
          }
          exportApi.allErrorHandle({ errorSendingData }).then((res: any) => {
            console.log('Error logged successfully:', res)
          }).catch((err: any) => {
            console.error('Failed to log error:', err)
          })
        }
        return resp?.data || (error as any).message
      },
    )
  }

  async get(endpoint: string, params = '') {
    return await this.axiosInstance.get(endpoint + params)
  }

  async post(endpoint: string, params = {}) {
    return await this.axiosInstance.post(endpoint, params instanceof FormData ? params : JSON.stringify(params))
  }

  async put(endpoint: string, params = {}) {
    return await this.axiosInstance.put(endpoint, params && JSON.stringify(params))
  }

  async delete(endpoint: string) {
    return await this.axiosInstance.delete(endpoint)
  }
}