/**
 * Base Provider Interface for Financial Service Providers
 * This abstract class defines the contract that all provider adapters must implement
 */

export interface ProviderConfig {
  apiKey: string
  accessKeyId: string
  secretAccessKey: string
  baseURL: string
  environment: 'sandbox' | 'production'
}

export interface Balance {
  currency: string
  amount: string
  available: string
  frozen: string
}

export interface ConversionQuote {
  fromCurrency: string
  toCurrency: string
  amount: number
  rate: number
  fee: number
  totalAmount: number
  quoteId: string
  expiresAt: string
}

export interface PaymentRequest {
  beneficiaryId: string
  amount: number
  currency: string
  purpose: string
  reference: string
  description?: string
}

export interface PaymentResponse {
  paymentId: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  amount: number
  currency: string
  fee: number
  totalAmount: number
  reference: string
  createdAt: string
}

export interface Beneficiary {
  id: string
  name: string
  accountNumber: string
  bankCode: string
  bankName: string
  country: string
  currency: string
  email?: string
  phone?: string
}

export interface CollectionAccount {
  id: string
  currency: string
  accountNumber: string
  bankName: string
  bankCode: string
  country: string
  provider: string
  isActive: boolean
}

export interface Transaction {
  id: string
  type: 'PAYMENT' | 'CONVERSION' | 'COLLECTION'
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  amount: number
  currency: string
  fee: number
  totalAmount: number
  reference: string
  description?: string
  createdAt: string
  updatedAt: string
  beneficiary?: Beneficiary
}

export abstract class BaseProvider {
  protected config: ProviderConfig
  protected accessToken?: string
  protected tokenExpiry?: Date

  constructor(config: ProviderConfig) {
    this.config = config
  }

  // Authentication methods
  abstract authenticate(): Promise<string>
  abstract refreshToken(): Promise<string>

  // Balance methods
  abstract getBalances(): Promise<Balance[]>
  abstract getBalance(currency: string): Promise<Balance>

  // Conversion methods
  abstract createConversionQuote(
    fromCurrency: string,
    toCurrency: string,
    amount: number
  ): Promise<ConversionQuote>
  abstract executeConversion(quoteId: string): Promise<PaymentResponse>

  // Payment methods
  abstract createPayment(payment: PaymentRequest): Promise<PaymentResponse>
  abstract getPayment(paymentId: string): Promise<PaymentResponse>
  abstract getPayments(filters?: any): Promise<Transaction[]>

  // Beneficiary methods
  abstract createBeneficiary(beneficiary: Omit<Beneficiary, 'id'>): Promise<Beneficiary>
  abstract getBeneficiaries(): Promise<Beneficiary[]>
  abstract getBeneficiary(beneficiaryId: string): Promise<Beneficiary>
  abstract updateBeneficiary(beneficiaryId: string, updates: Partial<Beneficiary>): Promise<Beneficiary>
  abstract deleteBeneficiary(beneficiaryId: string): Promise<boolean>

  // Collection methods
  abstract getCollectionAccounts(): Promise<CollectionAccount[]>
  abstract createCollectionAccount(currency: string, provider: string): Promise<CollectionAccount>
  abstract getCollectionHistory(filters?: any): Promise<Transaction[]>

  // Transaction methods
  abstract getTransactions(filters?: any): Promise<Transaction[]>
  abstract getTransaction(transactionId: string): Promise<Transaction>

  // Utility methods
  protected isTokenExpired(): boolean {
    if (!this.tokenExpiry) return true
    return new Date() >= this.tokenExpiry
  }

  protected async ensureAuthenticated(): Promise<void> {
    if (this.isTokenExpired()) {
      await this.authenticate()
    }
  }
}
