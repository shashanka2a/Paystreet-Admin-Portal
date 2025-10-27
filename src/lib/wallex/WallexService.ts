import { providerManager } from './ProviderManager';
import { 
  WallexBalance, 
  WallexTransaction, 
  WallexBeneficiary, 
  WallexConversionQuote, 
  WallexCollectionAccount,
  WallexPaymentRequest,
  WallexConversionRequest,
  WallexBeneficiaryRequest,
  ProviderStatus
} from './types';

export class WallexService {
  private providerManager = providerManager;

  async getBalances(): Promise<WallexBalance[]> {
    return this.providerManager.executeWithFallback(
      (provider) => provider.getBalances()
    );
  }

  async getBalance(currency: string): Promise<WallexBalance | undefined> {
    const balances = await this.getBalances();
    return balances.find(balance => balance.currency === currency);
  }

  async getTransactions(params?: any): Promise<WallexTransaction[]> {
    return this.providerManager.executeWithFallback(
      (provider) => provider.getTransactions(params)
    );
  }

  async createPayment(payment: WallexPaymentRequest): Promise<WallexTransaction> {
    return this.providerManager.executeWithFallback(
      (provider) => provider.createPayment(payment)
    );
  }

  async getPayment(paymentId: string): Promise<WallexTransaction> {
    return this.providerManager.executeWithFallback(
      (provider) => provider.getPayment(paymentId)
    );
  }

  async createConversionQuote(request: WallexConversionRequest): Promise<WallexConversionQuote> {
    return this.providerManager.executeWithFallback(
      (provider) => provider.createConversionQuote(request)
    );
  }

  async executeConversion(quoteId: string): Promise<WallexTransaction> {
    return this.providerManager.executeWithFallback(
      (provider) => provider.executeConversion(quoteId)
    );
  }

  async getBeneficiaries(): Promise<WallexBeneficiary[]> {
    return this.providerManager.executeWithFallback(
      (provider) => provider.getBeneficiaries()
    );
  }

  async createBeneficiary(beneficiary: WallexBeneficiaryRequest): Promise<WallexBeneficiary> {
    return this.providerManager.executeWithFallback(
      (provider) => provider.createBeneficiary(beneficiary)
    );
  }

  async getCollectionAccounts(): Promise<WallexCollectionAccount[]> {
    return this.providerManager.executeWithFallback(
      (provider) => provider.getCollectionAccounts()
    );
  }

  async getProviderStatus(): Promise<ProviderStatus> {
    return this.providerManager.getProviderStatus();
  }

  async switchProvider(providerName: string): Promise<void> {
    return this.providerManager.switchProvider(providerName);
  }

  // Utility methods for admin portal
  async getTransactionById(transactionId: string): Promise<WallexTransaction | undefined> {
    try {
      const transactions = await this.getTransactions({ id: transactionId });
      return transactions.find(tx => tx.id === transactionId);
    } catch (error) {
      console.error('Failed to get transaction by ID:', error);
      return undefined;
    }
  }

  async getTransactionsByStatus(status: string): Promise<WallexTransaction[]> {
    try {
      return await this.getTransactions({ status });
    } catch (error) {
      console.error('Failed to get transactions by status:', error);
      return [];
    }
  }

  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<WallexTransaction[]> {
    try {
      return await this.getTransactions({ 
        startDate, 
        endDate,
        limit: 1000 // Adjust as needed
      });
    } catch (error) {
      console.error('Failed to get transactions by date range:', error);
      return [];
    }
  }

  async getHighRiskTransactions(): Promise<WallexTransaction[]> {
    try {
      // This would typically involve additional risk assessment logic
      const transactions = await this.getTransactions();
      return transactions.filter(tx => {
        // Mock risk assessment - in real implementation, this would use actual risk scoring
        return tx.amount > 10000 || tx.status === 'pending';
      });
    } catch (error) {
      console.error('Failed to get high risk transactions:', error);
      return [];
    }
  }

  async getTotalVolume(currency?: string, startDate?: string, endDate?: string): Promise<number> {
    try {
      const params: any = {};
      if (currency) params.currency = currency;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const transactions = await this.getTransactions(params);
      return transactions.reduce((total, tx) => total + tx.amount, 0);
    } catch (error) {
      console.error('Failed to calculate total volume:', error);
      return 0;
    }
  }

  async getTransactionCount(status?: string, startDate?: string, endDate?: string): Promise<number> {
    try {
      const params: any = {};
      if (status) params.status = status;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const transactions = await this.getTransactions(params);
      return transactions.length;
    } catch (error) {
      console.error('Failed to get transaction count:', error);
      return 0;
    }
  }

  // Real-time monitoring methods
  async startRealTimeMonitoring(callback: (transaction: WallexTransaction) => void): Promise<void> {
    // In a real implementation, this would set up WebSocket connections or polling
    console.log('Starting real-time transaction monitoring...');
    
    // Mock implementation - poll for new transactions every 30 seconds
    setInterval(async () => {
      try {
        const recentTransactions = await this.getTransactions({
          limit: 10,
          sort: 'timestamp:desc'
        });
        
        // Check for new transactions and call callback
        recentTransactions.forEach(transaction => {
          callback(transaction);
        });
      } catch (error) {
        console.error('Real-time monitoring error:', error);
      }
    }, 30000);
  }

  async stopRealTimeMonitoring(): Promise<void> {
    console.log('Stopping real-time transaction monitoring...');
    // In real implementation, this would clean up WebSocket connections
  }
}

// Singleton instance
export const wallexService = new WallexService();
