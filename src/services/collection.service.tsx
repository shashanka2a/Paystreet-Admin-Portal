import { _Object } from 'utils/types'
import { balances } from './balance'
import CommonService from './common.service'
import { wallexService } from './wallex.service'

class CollectionService extends CommonService {
  async fetchCollectionBalance(params: { [key: string]: number }) {
    try {
      // Try Wallex first, fallback to existing API
      const isWallexAvailable = await wallexService.isWallexAvailable() 
      if (isWallexAvailable) {
        const balances = await wallexService.getBalances() 
        return {
          code: 200,
          result: {
            data: balances.map(balance => ({
              currency: balance.currency,
              amount: balance.amount,
              show: '1',
              expose: true,
              account: { currency: balance.currency },
              createdAt: new Date().toISOString(),
              id: `wallex_${balance.currency}`
            }))
          }
        } 
      }
    } catch (error) {
      console.warn('Wallex service unavailable, falling back to existing API:', error) 
    }
    
    // Fallback to existing API
    const response: _Object = await this.post('balance/me', params)
    if (response.message === 'Internal server error') return balances
    return response
  }

  async syncCollectionBalance() {
    return await this.get('balance/sync')
  }

  async fetchCollectionHistory(params: { [key: string]: number | any }) {
    try {
      // Try Wallex first, fallback to existing API
      const isWallexAvailable = await wallexService.isWallexAvailable() 
      if (isWallexAvailable) {
        const transactions = await wallexService.getCollectionHistory(params) 
        return {
          code: 200,
          result: {
            data: transactions.map(transaction => ({
              id: transaction.id,
              amount: transaction.amount,
              currency: transaction.currency,
              status: transaction.status,
              reference: transaction.reference,
              description: transaction.description,
              createdAt: transaction.createdAt,
              updatedAt: transaction.updatedAt
            }))
          }
        } 
      }
    } catch (error) {
      console.warn('Wallex service unavailable, falling back to existing API:', error) 
    }
    
    // Fallback to existing API
    return await this.post('collection/get-collection-history', params)
  }
  async createCollectionAccount(params: { [key: string]: string | any }) {
    return await this.post('collection/create-my-collection-account', params)
  }

  async getCollectionHistoryById(params: string) {
    return await this.get(`collection/history/${params}`)
  }

  async fetchCollectionAccounts(params: { [key: string]: number }) {
    return await this.post('collection/get-collection-account', params)
  }
}

export const collectionService = new CollectionService()
