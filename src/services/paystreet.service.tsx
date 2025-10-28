import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import store from 'store'
import { exportApi } from './export.service'
import { ErrorHandler } from 'utils'

export default class PaystreetService {
  axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_PAYSTREET_URL
    })

    this.axiosInstance.interceptors.request.use((request: InternalAxiosRequestConfig) => {
      const headers: any = request.headers || {}
      headers['Accept'] = 'application/json'
      headers['Content-Type'] = 'application/json'
      headers['Authorization'] = store.get(`${process.env.REACT_APP_ACCESS_TOKEN_KEY}`)
      request.headers = headers
      return request
    })

    this.axiosInstance.interceptors.response.use(
      (results: AxiosResponse) => {
        return results.data
      },
      (error: AxiosError) => {
        const data: any = error.response?.data as any
        if (error.response?.status === 401 && data?.displayMessage === 'Unauthorized') {
          store.clearAll()
          window.location.href = '/login'
        }

        if (error.response?.status === 400 && data?.message === 'Authorization token invalid!') {
          store.clearAll()
          window.location.href = '/login'
        }

        if (error.response?.status) {
          const fallingTime = new Date().toISOString()
          const errorSendingData = {
            'baseURL': error.config?.baseURL,
            'method': error.config?.method,
            'endPoint': error.config?.url,
            'ApiResponse': data,
            'payloads': error.config?.data ? JSON.parse(error.config.data) : null,
            'status': error.response.status,
            'statusText': error.response.statusText,
            'apiFailTime': fallingTime
          }
          exportApi.allErrorHandle({ errorSendingData }).then((res: any) => {
            console.log('Error logged successfully:', res)
          }).catch((err: any) => {
            console.error('Failed to log error:', err)
          })
        }
        return error.response?.data || error.message
      },
    )
  }

  async get(endpoint: string, params = '') {
    return await this.axiosInstance.get(endpoint + params)
  }

  async post(endpoint: string, params = {}) {
    const sanitizedParams = Object.entries(params).reduce((acc, [key, value]) => {
      acc[key] = value !== null && value !== undefined ? value : ''
      return acc
    }, {} as Record<string, any>)
  
    return await this.axiosInstance.post(endpoint, sanitizedParams instanceof FormData ? sanitizedParams : JSON.stringify(sanitizedParams), {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }  

  async put(endpoint: string, params = {}) {
    return await this.axiosInstance.put(endpoint, params && JSON.stringify(params))
  }

  async delete(endpoint: string) {
    return await this.axiosInstance.delete(endpoint)
  }
}