import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { ErrorHandler } from 'utils' 
import {
  BaseProvider,
  ProviderConfig,
  Balance,
  ConversionQuote,
  PaymentRequest,
  PaymentResponse,
  Beneficiary,
  CollectionAccount,
  Transaction
} from './BaseProvider' 

/**
 * Wallex API Adapter
 * Implements the BaseProvider interface for Wallex API integration
 */
export class WallexAdapter extends BaseProvider {
  private axiosInstance: AxiosInstance 
  // v2 API uses Bearer + X-Api-Key (no SigV4). Region retained but unused.
  private region: string = (process.env.REACT_APP_WALLEX_REGION as string) || 'ap-southeast-1'

  constructor(config: ProviderConfig) {
    super(config) 
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': config.apiKey,
      }
    }) 

    this.setupInterceptors() 
  }

  private setupInterceptors(): void {
    // Request interceptor to add authentication
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        await this.ensureAuthenticated() 
        const headers: any = config.headers || {}
        headers['X-Api-Key'] = this.config.apiKey
        if (this.accessToken) headers['Authorization'] = `Bearer ${this.accessToken}`
        config.headers = headers
        return config 
      },
      (error) => Promise.reject(error)
    ) 

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response.data,
      (error) => {
        console.error('Wallex API Error:', error.response?.data || error.message)
        ErrorHandler.handleApiError(error, 'Failed to connect to Wallex service')
        return Promise.reject(error) 
      }
    ) 
  }

  // Authentication methods
  async authenticate(): Promise<string> {
    try {
      const response: any = await this.axiosInstance.post('/v2/authenticate', {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey
      }) 

      const res = response?.data || response
      this.accessToken = res.token || res.accessToken
      const expiresInSec = res.expiresIn || (8 * 60 * 60)
      this.tokenExpiry = new Date(Date.now() + (expiresInSec * 1000)) 
      
      if (!this.accessToken) {
        throw new Error('No access token received from Wallex API')
      }
      
      return this.accessToken
    } catch (error) {
      console.error('Wallex authentication failed:', error)
      throw new Error('Failed to authenticate with Wallex API')
    }
  }

  async refreshToken(): Promise<string> {
    return this.authenticate() 
  }

  // Balance methods
  async getBalances(): Promise<Balance[]> {
    await this.ensureAuthenticated()
    const response: any = await this.axiosInstance.get('/v2/balances')
    
    const payload = response?.data || response
    const rows = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []
    return rows.map((row: any) => ({
      currency: row.currency,
      amount: String(row.amount ?? '0'),
      available: String(row.amount ?? '0'),
      frozen: '0'
    }))
  }

  async getBalance(currency: string): Promise<Balance> {
    const balances = await this.getBalances() 
    const balance = balances.find(b => b.currency === currency) 
    
    if (!balance) {
      throw new Error(`Balance not found for currency: ${currency}`) 
    }
    
    return balance 
  }

  // Conversion methods
  async createConversionQuote(
    fromCurrency: string,
    toCurrency: string,
    amount: number
  ): Promise<ConversionQuote> {
    await this.ensureAuthenticated() 
    const response: any = await this.axiosInstance.post('/v2/conversions/quote', {
      fromCurrency,
      toCurrency,
      amount
    }) 

    const res = response?.data || response
    return {
      fromCurrency: res.fromCurrency,
      toCurrency: res.toCurrency,
      amount: res.amount,
      rate: res.rate,
      fee: res.fee,
      totalAmount: res.totalAmount,
      quoteId: res.quoteId,
      expiresAt: res.expiresAt
    } 
  }

  async executeConversion(quoteId: string): Promise<PaymentResponse> {
    throw new Error('Wallex v2: executeConversion is not supported. Trigger funding/monitoring after quote.')
  }

  // Payment methods
  async createPayment(payment: PaymentRequest): Promise<PaymentResponse> {
    await this.ensureAuthenticated() 
    const response: any = await this.axiosInstance.post('/v2/payments', {
      beneficiaryId: payment.beneficiaryId,
      amount: payment.amount,
      currency: payment.currency,
      purpose: payment.purpose,
      reference: payment.reference,
      description: payment.description
    }) 

    const res = response?.data || response
    return {
      paymentId: res.paymentId,
      status: res.status,
      amount: res.amount,
      currency: res.currency,
      fee: res.fee,
      totalAmount: res.totalAmount,
      reference: res.reference,
      createdAt: res.createdAt
    } 
  }

  async getPayment(paymentId: string): Promise<PaymentResponse> {
    await this.ensureAuthenticated() 
    const response: any = await this.axiosInstance.get(`/v2/payments/${paymentId}`) 

    const res = response?.data || response
    return {
      paymentId: res.paymentId,
      status: res.status,
      amount: res.amount,
      currency: res.currency,
      fee: res.fee,
      totalAmount: res.totalAmount,
      reference: res.reference,
      createdAt: res.createdAt
    } 
  }

  async getPayments(filters?: any): Promise<Transaction[]> {
    await this.ensureAuthenticated() 
    const response: any = await this.axiosInstance.get('/v2/payments', {
      params: filters
    }) 

    const rows = (response?.data?.data) || (response?.data) || response
    return rows.map((payment: any) => ({
      id: payment.paymentId,
      type: 'PAYMENT' as const,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      fee: payment.fee,
      totalAmount: payment.totalAmount,
      reference: payment.reference,
      description: payment.description,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      beneficiary: payment.beneficiary
    })) 
  }

  // Beneficiary methods
  async createBeneficiary(beneficiary: Omit<Beneficiary, 'id'>): Promise<Beneficiary> {
    await this.ensureAuthenticated() 
    const response: any = await this.axiosInstance.post('/v2/beneficiaries', {
      entityType: 'individual',
      name: beneficiary.name,
      email: beneficiary.email,
      phone: beneficiary.phone,
      bankAccount: {
        accountNumber: beneficiary.accountNumber,
        bankCode: beneficiary.bankCode,
        bankName: beneficiary.bankName,
        country: beneficiary.country,
        currency: beneficiary.currency
      }
    }) 

    const res = response?.data || response
    return {
      id: res.beneficiaryId,
      name: res.name,
      accountNumber: res.accountNumber,
      bankCode: res.bankCode,
      bankName: res.bankName,
      country: res.country,
      currency: res.currency,
      email: res.email,
      phone: res.phone
    } 
  }

  async getBeneficiaries(): Promise<Beneficiary[]> {
    await this.ensureAuthenticated() 
    const response: any = await this.axiosInstance.get('/v2/beneficiaries') 

    const rows = (response?.data?.data) || (response?.data) || response
    return rows.map((beneficiary: any) => ({
      id: beneficiary.beneficiaryId,
      name: beneficiary.name,
      accountNumber: beneficiary.accountNumber,
      bankCode: beneficiary.bankCode,
      bankName: beneficiary.bankName,
      country: beneficiary.country,
      currency: beneficiary.currency,
      email: beneficiary.email,
      phone: beneficiary.phone
    })) 
  }

  async getBeneficiary(beneficiaryId: string): Promise<Beneficiary> {
    await this.ensureAuthenticated() 
    const response: any = await this.axiosInstance.get(`/v2/beneficiaries/${beneficiaryId}`) 

    const res = response?.data || response
    return {
      id: res.beneficiaryId,
      name: res.name,
      accountNumber: res.accountNumber,
      bankCode: res.bankCode,
      bankName: res.bankName,
      country: res.country,
      currency: res.currency,
      email: res.email,
      phone: res.phone
    } 
  }

  async updateBeneficiary(beneficiaryId: string, updates: Partial<Beneficiary>): Promise<Beneficiary> {
    await this.ensureAuthenticated() 
    const response: any = await this.axiosInstance.put(`/v2/beneficiaries/${beneficiaryId}`, updates) 

    const res = response?.data || response
    return {
      id: res.beneficiaryId,
      name: res.name,
      accountNumber: res.accountNumber,
      bankCode: res.bankCode,
      bankName: res.bankName,
      country: res.country,
      currency: res.currency,
      email: res.email,
      phone: res.phone
    } 
  }

  async deleteBeneficiary(beneficiaryId: string): Promise<boolean> {
    await this.ensureAuthenticated() 
    await this.axiosInstance.delete(`/v2/beneficiaries/${beneficiaryId}`) 
    return true 
  }

  // Collection methods
  async getCollectionAccounts(): Promise<CollectionAccount[]> {
    await this.ensureAuthenticated() 
    try {
      const response: any = await this.axiosInstance.get('/v2/collections/accounts') 

      const rows = (response?.data?.data) || (response?.data) || response
      return rows.map((account: any) => ({
        id: account.accountId,
        currency: account.currency,
        accountNumber: account.accountNumber,
        bankName: account.bankName,
        bankCode: account.bankCode,
        country: account.country,
        provider: 'WALLEX',
        isActive: account.isActive
      })) 
    } catch (error: any) {
      const msg = error?.response?.data
      const isNotAuthorized = error?.response?.status === 400 && (
        (typeof msg === 'string' && msg.includes('NOT_AUTHORIZED')) ||
        (typeof msg === 'object' && (msg.error_code === 'NOT_AUTHORIZED' || JSON.stringify(msg).includes('NOT_AUTHORIZED')))
      )
      if (isNotAuthorized) {
        // Lack of permission for collections accounts; return empty list to avoid breaking UI
        return []
      }
      throw error
    }
  }

  async createCollectionAccount(currency: string, provider: string): Promise<CollectionAccount> {
    await this.ensureAuthenticated() 
    const response: any = await this.axiosInstance.post('/v2/collections/accounts', {
      currency,
      provider,
      bankCountry: 'SG',
      purpose: 'COLLECTION'
    }) 

    const res = response?.data || response
    return {
      id: res.accountId,
      currency: res.currency,
      accountNumber: res.accountNumber,
      bankName: res.bankName,
      bankCode: res.bankCode,
      country: res.country,
      provider: 'WALLEX',
      isActive: res.isActive
    } 
  }

  async getCollectionHistory(filters?: any): Promise<Transaction[]> {
    await this.ensureAuthenticated() 
    const response: any = await this.axiosInstance.get('/v2/collections/history', {
      params: filters
    }) 

    const rows = (response?.data?.data) || (response?.data) || response
    return rows.map((collection: any) => ({
      id: collection.collectionId,
      type: 'COLLECTION' as const,
      status: collection.status,
      amount: collection.amount,
      currency: collection.currency,
      fee: collection.fee || 0,
      totalAmount: collection.amount,
      reference: collection.reference,
      description: collection.description,
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt
    })) 
  }

  // Transaction methods
  async getTransactions(filters?: any): Promise<Transaction[]> {
    await this.ensureAuthenticated() 
    // Normalize pagination filters to Wallex format if caller uses page/limit
    const params: any = { ...(filters || {}) }
    if (params.page !== undefined || params.limit !== undefined) {
      const page = params.page
      const limit = params.limit
      delete params.page
      delete params.limit
      if (page !== undefined) params['pagination[page]'] = page
      if (limit !== undefined) params['pagination[limit]'] = limit
    }
    // Prefer v2 payments listing (documented) and map to Transaction
    try {
      const response: any = await this.axiosInstance.get('/v2/payments', { params })
      const rows = (response?.data?.data) || (response?.data) || response
      return rows.map((payment: any) => ({
        id: payment.paymentId,
        type: 'PAYMENT' as const,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        fee: payment.fee,
        totalAmount: payment.totalAmount,
        reference: payment.reference,
        description: payment.description,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
        beneficiary: payment.beneficiary
      })) 
    } catch (primaryError: any) {
      // Fallback to legacy /v2/transactions if available in this environment
      try {
        const response: any = await this.axiosInstance.get('/v2/transactions', { params }) 
        const rows = (response?.data?.data) || (response?.data) || response
        return rows.map((transaction: any) => ({
          id: transaction.transactionId,
          type: transaction.type,
          status: transaction.status,
          amount: transaction.amount,
          currency: transaction.currency,
          fee: transaction.fee,
          totalAmount: transaction.totalAmount,
          reference: transaction.reference,
          description: transaction.description,
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
          beneficiary: transaction.beneficiary
        })) 
      } catch (fallbackError: any) {
        if (fallbackError?.response?.status === 404) {
          return []
        }
        throw fallbackError
      }
    }
  }

  async getTransaction(transactionId: string): Promise<Transaction> {
    await this.ensureAuthenticated() 
    const response: any = await this.axiosInstance.get(`/v2/transactions/${transactionId}`) 

    const res = response?.data || response
    return {
      id: res.transactionId,
      type: res.type,
      status: res.status,
      amount: res.amount,
      currency: res.currency,
      fee: res.fee,
      totalAmount: res.totalAmount,
      reference: res.reference,
      description: res.description,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
      beneficiary: res.beneficiary
    } 
  }
}
