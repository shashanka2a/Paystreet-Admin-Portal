import { providerManager } from './providers' 
import { 
  Balance, 
  ConversionQuote, 
  PaymentRequest, 
  PaymentResponse, 
  Beneficiary, 
  CollectionAccount, 
  Transaction 
} from './providers' 

/**
 * Wallex Service
 * High-level service that uses the Wallex adapter through the provider manager
 */
class WallexService {
  /**
   * Get all balances from Wallex
   */
  async getBalances(): Promise<Balance[]> {
    try {
      const provider = providerManager.getActiveProvider() 
      return await provider.getBalances() 
    } catch (error) {
      console.error('Failed to fetch balances:', error) 
      throw new Error('Failed to fetch balances from Wallex') 
    }
  }

  /**
   * Get balance for specific currency
   */
  async getBalance(currency: string): Promise<Balance> {
    try {
      const provider = providerManager.getActiveProvider() 
      return await provider.getBalance(currency) 
    } catch (error) {
      console.error(`Failed to fetch balance for ${currency}:`, error) 
      throw new Error(`Failed to fetch balance for ${currency}`) 
    }
  }

  /**
   * Create conversion quote
   */
  async createConversionQuote(
    fromCurrency: string,
    toCurrency: string,
    amount: number
  ): Promise<ConversionQuote> {
    try {
      const provider = providerManager.getActiveProvider() 
      return await provider.createConversionQuote(fromCurrency, toCurrency, amount) 
    } catch (error) {
      console.error('Failed to create conversion quote:', error) 
      throw new Error('Failed to create conversion quote') 
    }
  }

  /**
   * Execute conversion
   */
  async executeConversion(quoteId: string): Promise<PaymentResponse> {
    try {
      const provider = providerManager.getActiveProvider() 
      return await provider.executeConversion(quoteId) 
    } catch (error) {
      console.error('Failed to execute conversion:', error) 
      throw new Error('Failed to execute conversion') 
    }
  }

  /**
   * Create payment
   */
  async createPayment(payment: PaymentRequest): Promise<PaymentResponse> {
    try {
      const provider = providerManager.getActiveProvider() 
      return await provider.createPayment(payment) 
    } catch (error) {
      console.error('Failed to create payment:', error) 
      throw new Error('Failed to create payment') 
    }
  }

  /**
   * Get payment by ID
   */
  async getPayment(paymentId: string): Promise<PaymentResponse> {
    try {
      const provider = providerManager.getActiveProvider() 
      return await provider.getPayment(paymentId) 
    } catch (error) {
      console.error(`Failed to fetch payment ${paymentId}:`, error) 
      throw new Error(`Failed to fetch payment ${paymentId}`) 
    }
  }

  /**
   * Get payments list
   */
  async getPayments(filters?: any): Promise<Transaction[]> {
    try {
      const provider = providerManager.getActiveProvider() 
      return await provider.getPayments(filters) 
    } catch (error) {
      console.error('Failed to fetch payments:', error) 
      throw new Error('Failed to fetch payments') 
    }
  }

  /**
   * Create beneficiary
   */
  async createBeneficiary(beneficiary: Omit<Beneficiary, 'id'>): Promise<Beneficiary> {
    try {
      const provider = providerManager.getActiveProvider() 
      return await provider.createBeneficiary(beneficiary) 
    } catch (error) {
      console.error('Failed to create beneficiary:', error) 
      throw new Error('Failed to create beneficiary') 
    }
  }

  /**
   * Get beneficiaries list
   */
  async getBeneficiaries(): Promise<Beneficiary[]> {
    try {
      const provider = providerManager.getActiveProvider() 
      return await provider.getBeneficiaries() 
    } catch (error) {
      console.error('Failed to fetch beneficiaries:', error) 
      throw new Error('Failed to fetch beneficiaries') 
    }
  }

  /**
   * Get beneficiary by ID
   */
  async getBeneficiary(beneficiaryId: string): Promise<Beneficiary> {
    try {
      const provider = providerManager.getActiveProvider() 
      return await provider.getBeneficiary(beneficiaryId) 
    } catch (error) {
      console.error(`Failed to fetch beneficiary ${beneficiaryId}:`, error) 
      throw new Error(`Failed to fetch beneficiary ${beneficiaryId}`) 
    }
  }

  /**
   * Update beneficiary
   */
  async updateBeneficiary(beneficiaryId: string, updates: Partial<Beneficiary>): Promise<Beneficiary> {
    try {
      const provider = providerManager.getActiveProvider() 
      return await provider.updateBeneficiary(beneficiaryId, updates) 
    } catch (error) {
      console.error(`Failed to update beneficiary ${beneficiaryId}:`, error) 
      throw new Error(`Failed to update beneficiary ${beneficiaryId}`) 
    }
  }

  /**
   * Delete beneficiary
   */
  async deleteBeneficiary(beneficiaryId: string): Promise<boolean> {
    try {
      const provider = providerManager.getActiveProvider() 
      return await provider.deleteBeneficiary(beneficiaryId) 
    } catch (error) {
      console.error(`Failed to delete beneficiary ${beneficiaryId}:`, error) 
      throw new Error(`Failed to delete beneficiary ${beneficiaryId}`) 
    }
  }

  /**
   * Get collection accounts
   */
  async getCollectionAccounts(): Promise<CollectionAccount[]> {
    try {
      const provider = providerManager.getActiveProvider() 
      return await provider.getCollectionAccounts() 
    } catch (error) {
      console.error('Failed to fetch collection accounts:', error) 
      throw new Error('Failed to fetch collection accounts') 
    }
  }

  /**
   * Create collection account
   */
  async createCollectionAccount(currency: string, provider: string): Promise<CollectionAccount> {
    try {
      const activeProvider = providerManager.getActiveProvider() 
      return await activeProvider.createCollectionAccount(currency, provider) 
    } catch (error) {
      console.error('Failed to create collection account:', error) 
      throw new Error('Failed to create collection account') 
    }
  }

  /**
   * Get collection history
   */
  async getCollectionHistory(filters?: any): Promise<Transaction[]> {
    try {
      const provider = providerManager.getActiveProvider() 
      return await provider.getCollectionHistory(filters) 
    } catch (error) {
      console.error('Failed to fetch collection history:', error) 
      throw new Error('Failed to fetch collection history') 
    }
  }

  /**
   * Get all transactions
   */
  async getTransactions(filters?: any): Promise<Transaction[]> {
    try {
      const provider = providerManager.getActiveProvider() 
      return await provider.getTransactions(filters) 
    } catch (error) {
      console.error('Failed to fetch transactions:', error) 
      throw new Error('Failed to fetch transactions') 
    }
  }

  /**
   * Get transaction by ID
   */
  async getTransaction(transactionId: string): Promise<Transaction> {
    try {
      const provider = providerManager.getActiveProvider() 
      return await provider.getTransaction(transactionId) 
    } catch (error) {
      console.error(`Failed to fetch transaction ${transactionId}:`, error) 
      throw new Error(`Failed to fetch transaction ${transactionId}`) 
    }
  }

  /**
   * Get provider status
   */
  async getProviderStatus(): Promise<{ [key: string]: boolean }> {
    try {
      return await providerManager.getProviderStatus() 
    } catch (error) {
      console.error('Failed to get provider status:', error) 
      throw new Error('Failed to get provider status') 
    }
  }

  /**
   * Check if Wallex is available
   */
  async isWallexAvailable(): Promise<boolean> {
    try {
      const status = await this.getProviderStatus() 
      return status.WALLEX === true 
    } catch (error) {
      return false 
    }
  }
}

export const wallexService = new WallexService() 
