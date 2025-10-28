import { _Object } from 'utils/types'
// import PaystreetService from './paystreet.service'
import CommonService from './common.service'
import { wallexService } from './wallex.service'

// class Conversionservice extends PaystreetService {
//   async fetchConversions(params?: { [key: string]: string | number }) {
//     return await this.post('conversions/find', params)
//   }
//   async createQuote(params?: _Object) {
//     return await this.post('conversions/quote', params)
//   }

//   async createConversion(params: { [key: string]: string | number | boolean }) {
//     return await this.post('conversions/create', params)
//   }
//   async getConversions(params: _Object) {
//     return await this.post('conversions/find', params)
//   }

//   async getConversionById(params: string) {
//     return await this.get(`conversions/${params}`)
//   }

//   async me() {
//     return await this.get('me')
//   }
// }
class Conversionservice extends CommonService {
  async fetchConversions(params?: { [key: string]: string | number }) {
    return await this.post('conversions/find', params)
  }
  async createQuote(params?: _Object) {
    try {
      // Try Wallex first, fallback to existing API
      const isWallexAvailable = await wallexService.isWallexAvailable() 
      if (isWallexAvailable && params) {
        const quote = await wallexService.createConversionQuote(
          params.sellCurrency || params.fromCurrency,
          params.buyCurrency || params.toCurrency,
          params.amount
        ) 
        return {
          code: 200,
          result: {
            data: {
              quoteId: quote.quoteId,
              sellAmount: params.amount,
              buyAmount: quote.totalAmount,
              sellCurrency: quote.fromCurrency,
              buyCurrency: quote.toCurrency,
              rate: quote.rate,
              fee: quote.fee,
              date: quote.expiresAt
            }
          }
        } 
      }
    } catch (error) {
      console.warn('Wallex service unavailable, falling back to existing API:', error) 
    }
    
    // Fallback to existing API
    return await this.post('conversion/quote', params)
  }

  async createConversion(params: { [key: string]: string | number | boolean }) {
    try {
      // Try Wallex first, fallback to existing API
      const isWallexAvailable = await wallexService.isWallexAvailable() 
      if (isWallexAvailable && params.quoteId) {
        const conversion = await wallexService.executeConversion(params.quoteId as string) 
        return {
          code: 200,
          result: {
            data: {
              conversionId: conversion.paymentId,
              status: conversion.status,
              amount: conversion.amount,
              currency: conversion.currency,
              fee: conversion.fee,
              totalAmount: conversion.totalAmount,
              reference: conversion.reference,
              createdAt: conversion.createdAt
            }
          }
        } 
      }
    } catch (error) {
      console.warn('Wallex service unavailable, falling back to existing API:', error) 
    }
    
    // Fallback to existing API
    return await this.post('conversion/create', params)
  }
  async getConversions(params: _Object) {
    return await this.post('conversions/find', params)
  }

  async getConversionById(params: string) {
    return await this.get(`conversions/${params}`)
  }

  async me() {
    return await this.get('me')
  }
}

export const conversionservice = new Conversionservice()
