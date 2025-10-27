import { WallexAdapter } from './WallexAdapter';
import { 
  WallexCredentials, 
  WallexBalance, 
  WallexTransaction, 
  WallexBeneficiary, 
  WallexConversionQuote, 
  WallexCollectionAccount,
  WallexPaymentRequest,
  WallexConversionRequest,
  WallexBeneficiaryRequest,
  ProviderStatus,
  BaseProvider
} from './types';

export class ProviderManager {
  private providers: Map<string, BaseProvider> = new Map();
  private activeProvider: string = 'WALLEX';
  private fallbackProvider: string = 'FALLBACK';

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize Wallex provider
    const wallexCredentials: WallexCredentials = {
      apiKey: process.env.NEXT_PUBLIC_WALLEX_API_KEY || '',
      accessKeyId: process.env.NEXT_PUBLIC_WALLEX_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.NEXT_PUBLIC_WALLEX_SECRET_ACCESS_KEY || '',
      baseUrl: process.env.NEXT_PUBLIC_WALLEX_BASE_URL || 'https://api.wallex.asia',
      environment: (process.env.NEXT_PUBLIC_WALLEX_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
    };

    if (wallexCredentials.apiKey) {
      this.providers.set('WALLEX', new WallexAdapter(wallexCredentials));
    }

    // Initialize fallback provider (mock implementation)
    this.providers.set('FALLBACK', new FallbackProvider());
  }

  getActiveProvider(): BaseProvider {
    const provider = this.providers.get(this.activeProvider);
    if (!provider) {
      throw new Error(`Active provider ${this.activeProvider} not found`);
    }
    return provider;
  }

  getProvider(name: string): BaseProvider | undefined {
    return this.providers.get(name);
  }

  async switchProvider(providerName: string): Promise<void> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }

    // Test provider connectivity
    try {
      await provider.getProviderStatus();
      this.activeProvider = providerName;
    } catch (error) {
      console.error(`Failed to switch to provider ${providerName}:`, error);
      throw error;
    }
  }

  async getProviderStatus(): Promise<ProviderStatus> {
    const status: ProviderStatus = {
      WALLEX: 'inactive',
      FALLBACK: 'inactive'
    };

    for (const [name, provider] of this.providers) {
      try {
        const providerStatus = await provider.getProviderStatus();
        status[name as keyof ProviderStatus] = providerStatus[name as keyof ProviderStatus];
      } catch (error) {
        console.error(`Provider ${name} status check failed:`, error);
        status[name as keyof ProviderStatus] = 'error';
      }
    }

    return status;
  }

  async executeWithFallback<T>(
    operation: (provider: BaseProvider) => Promise<T>,
    fallbackOperation?: (provider: BaseProvider) => Promise<T>
  ): Promise<T> {
    try {
      // Try primary provider first
      const primaryProvider = this.getActiveProvider();
      return await operation(primaryProvider);
    } catch (error) {
      console.warn('Primary provider failed, trying fallback:', error);
      
      // Try fallback provider
      const fallbackProvider = this.providers.get(this.fallbackProvider);
      if (fallbackProvider) {
        try {
          if (fallbackOperation) {
            return await fallbackOperation(fallbackProvider);
          } else {
            return await operation(fallbackProvider);
          }
        } catch (fallbackError) {
          console.error('Fallback provider also failed:', fallbackError);
          throw new Error('All providers failed');
        }
      }
      
      throw error;
    }
  }
}

// Fallback Provider Implementation (Mock)
class FallbackProvider implements BaseProvider {
  async authenticate(): Promise<string> {
    return 'fallback-token';
  }

  async getBalances(): Promise<WallexBalance[]> {
    // Return mock balances
    return [
      { currency: 'USD', available: 100000, frozen: 0, total: 100000 },
      { currency: 'SGD', available: 50000, frozen: 0, total: 50000 },
      { currency: 'EUR', available: 25000, frozen: 0, total: 25000 },
    ];
  }

  async getTransactions(): Promise<WallexTransaction[]> {
    // Return mock transactions
    return [
      {
        id: 'fallback-txn-001',
        type: 'payment',
        amount: 1000,
        currency: 'USD',
        status: 'completed',
        timestamp: new Date().toISOString(),
        description: 'Mock transaction from fallback provider',
        reference: 'FALLBACK-001',
        fees: 10,
        exchangeRate: 1.0,
      },
    ];
  }

  async createPayment(): Promise<WallexTransaction> {
    throw new Error('Payment creation not supported in fallback mode');
  }

  async getPayment(): Promise<WallexTransaction> {
    throw new Error('Payment retrieval not supported in fallback mode');
  }

  async createConversionQuote(): Promise<WallexConversionQuote> {
    throw new Error('Conversion quotes not supported in fallback mode');
  }

  async executeConversion(): Promise<WallexTransaction> {
    throw new Error('Conversion execution not supported in fallback mode');
  }

  async getBeneficiaries(): Promise<WallexBeneficiary[]> {
    return [];
  }

  async createBeneficiary(): Promise<WallexBeneficiary> {
    throw new Error('Beneficiary creation not supported in fallback mode');
  }

  async getCollectionAccounts(): Promise<WallexCollectionAccount[]> {
    return [];
  }

  async getProviderStatus(): Promise<ProviderStatus> {
    return {
      WALLEX: 'inactive',
      FALLBACK: 'active'
    };
  }
}

// Singleton instance
export const providerManager = new ProviderManager();

