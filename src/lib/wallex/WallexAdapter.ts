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
  WallexApiResponse,
  WallexError,
  ProviderStatus,
  BaseProvider
} from './types';

export class WallexAdapter implements BaseProvider {
  private credentials: WallexCredentials;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(credentials: WallexCredentials) {
    this.credentials = credentials;
  }

  public async authenticate(): Promise<string> {
    // Check if token is still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch(`${this.credentials.baseUrl}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': this.credentials.apiKey,
        },
        body: JSON.stringify({
          accessKeyId: this.credentials.accessKeyId,
          secretAccessKey: this.credentials.secretAccessKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.accessToken;
      this.tokenExpiry = Date.now() + (data.expiresIn * 1000) - 60000; // 1 minute buffer
      
      return this.accessToken!;
    } catch (error) {
      console.error('Wallex authentication error:', error);
      throw new Error('Failed to authenticate with Wallex API');
    }
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<WallexApiResponse<T>> {
    try {
      const token = await this.authenticate();
      
      const response = await fetch(`${this.credentials.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Api-Key': this.credentials.apiKey,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `API request failed: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error(`Wallex API error (${endpoint}):`, error);
      throw error;
    }
  }

  async getBalances(): Promise<WallexBalance[]> {
    try {
      const response = await this.makeRequest<WallexBalance[]>('/balances');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Wallex balances:', error);
      throw error;
    }
  }

  async getTransactions(params: any = {}): Promise<WallexTransaction[]> {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const endpoint = `/transactions${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await this.makeRequest<WallexTransaction[]>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Wallex transactions:', error);
      throw error;
    }
  }

  async createPayment(payment: WallexPaymentRequest): Promise<WallexTransaction> {
    try {
      const response = await this.makeRequest<WallexTransaction>('/payments', {
        method: 'POST',
        body: JSON.stringify(payment),
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create Wallex payment:', error);
      throw error;
    }
  }

  async getPayment(paymentId: string): Promise<WallexTransaction> {
    try {
      const response = await this.makeRequest<WallexTransaction>(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Wallex payment:', error);
      throw error;
    }
  }

  async createConversionQuote(request: WallexConversionRequest): Promise<WallexConversionQuote> {
    try {
      const response = await this.makeRequest<WallexConversionQuote>('/conversions/quote', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create Wallex conversion quote:', error);
      throw error;
    }
  }

  async executeConversion(quoteId: string): Promise<WallexTransaction> {
    try {
      const response = await this.makeRequest<WallexTransaction>('/conversions/execute', {
        method: 'POST',
        body: JSON.stringify({ quoteId }),
      });
      return response.data;
    } catch (error) {
      console.error('Failed to execute Wallex conversion:', error);
      throw error;
    }
  }

  async getBeneficiaries(): Promise<WallexBeneficiary[]> {
    try {
      const response = await this.makeRequest<WallexBeneficiary[]>('/beneficiaries');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Wallex beneficiaries:', error);
      throw error;
    }
  }

  async createBeneficiary(beneficiary: WallexBeneficiaryRequest): Promise<WallexBeneficiary> {
    try {
      const response = await this.makeRequest<WallexBeneficiary>('/beneficiaries', {
        method: 'POST',
        body: JSON.stringify(beneficiary),
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create Wallex beneficiary:', error);
      throw error;
    }
  }

  async getCollectionAccounts(): Promise<WallexCollectionAccount[]> {
    try {
      const response = await this.makeRequest<WallexCollectionAccount[]>('/collection-accounts');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Wallex collection accounts:', error);
      throw error;
    }
  }

  async getProviderStatus(): Promise<ProviderStatus> {
    try {
      // Test authentication and basic API connectivity
      await this.authenticate();
      return {
        WALLEX: 'active',
        FALLBACK: 'inactive'
      };
    } catch (error) {
      console.error('Wallex provider status check failed:', error);
      return {
        WALLEX: 'error',
        FALLBACK: 'active'
      };
    }
  }
}

