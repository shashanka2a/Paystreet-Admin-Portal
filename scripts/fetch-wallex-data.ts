#!/usr/bin/env tsx

/**
 * Wallex Data Fetcher Script (TypeScript)
 * 
 * This script fetches data from the Wallex API using environment variables
 * and stores the results in JSON files for analysis and backup.
 * 
 * Usage:
 * 1. Copy .env.example to .env and fill in your Wallex API credentials
 * 2. Install dependencies: npm install dotenv tsx
 * 3. Run: npx tsx scripts/fetch-wallex-data.ts
 * 
 * Output:
 * - data/wallex-balances.json
 * - data/wallex-transactions.json
 * - data/wallex-beneficiaries.json
 * - data/wallex-collection-accounts.json
 * - data/wallex-summary.json
 */

import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Load environment variables
config();

// Wallex API Configuration
const WALLEX_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_WALLEX_API_KEY,
  accessKeyId: process.env.NEXT_PUBLIC_WALLEX_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_WALLEX_SECRET_ACCESS_KEY,
  baseUrl: process.env.NEXT_PUBLIC_WALLEX_BASE_URL || 'https://api.wallex.asia',
  environment: process.env.NEXT_PUBLIC_WALLEX_ENVIRONMENT || 'sandbox'
};

// Ensure data directory exists
const DATA_DIR = join(process.cwd(), 'data');
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// Types for Wallex API responses
interface WallexApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

interface WallexBalance {
  currency: string;
  available: number;
  frozen: number;
  total: number;
  lastUpdated: string;
}

interface WallexTransaction {
  id: string;
  type: 'payment' | 'conversion' | 'deposit' | 'withdrawal';
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'flagged';
  timestamp: string;
  description?: string;
  reference?: string;
  fees?: number;
  exchangeRate?: number;
  beneficiaryId?: string;
  senderId?: string;
  purpose?: string;
  metadata?: Record<string, any>;
}

interface WallexBeneficiary {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  bankAccount?: {
    accountNumber: string;
    bankName: string;
    bankCode: string;
    country: string;
    currency: string;
  };
  walletAddress?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastUsed?: string;
}

interface WallexCollectionAccount {
  id: string;
  currency: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  country: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

class WallexDataFetcher {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(private config: typeof WALLEX_CONFIG) {
    this.validateConfig();
  }

  private validateConfig(): void {
    const required = ['apiKey', 'accessKeyId', 'secretAccessKey'];
    const missing = required.filter(key => !this.config[key as keyof typeof this.config]);
    
    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:', missing.join(', '));
      console.error('Please check your .env file and ensure all Wallex API credentials are set.');
      process.exit(1);
    }
  }

  private async authenticate(): Promise<string> {
    // Check if token is still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      console.log('🔐 Authenticating with Wallex API...');
      
      const response = await fetch(`${this.config.baseUrl}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': this.config.apiKey!,
        },
        body: JSON.stringify({
          accessKeyId: this.config.accessKeyId,
          secretAccessKey: this.config.secretAccessKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.accessToken;
      this.tokenExpiry = Date.now() + (data.expiresIn * 1000) - 60000; // 1 minute buffer
      
      console.log('✅ Authentication successful');
      return this.accessToken!;
    } catch (error) {
      console.error('❌ Authentication failed:', error);
      throw new Error('Failed to authenticate with Wallex API');
    }
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<WallexApiResponse<T>> {
    try {
      const token = await this.authenticate();
      
      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Api-Key': this.config.apiKey!,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `API request failed: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error(`❌ API request failed (${endpoint}):`, error);
      throw error;
    }
  }

  async fetchBalances(): Promise<WallexBalance[]> {
    try {
      console.log('💰 Fetching balances...');
      const response = await this.makeRequest<WallexBalance[]>('/balances');
      console.log(`✅ Fetched ${response.data.length} balances`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch balances:', error);
      return [];
    }
  }

  async fetchTransactions(params: any = {}): Promise<WallexTransaction[]> {
    try {
      console.log('📊 Fetching transactions...');
      const queryParams = new URLSearchParams(params).toString();
      const endpoint = `/transactions${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await this.makeRequest<WallexTransaction[]>(endpoint);
      console.log(`✅ Fetched ${response.data.length} transactions`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch transactions:', error);
      return [];
    }
  }

  async fetchBeneficiaries(): Promise<WallexBeneficiary[]> {
    try {
      console.log('👥 Fetching beneficiaries...');
      const response = await this.makeRequest<WallexBeneficiary[]>('/beneficiaries');
      console.log(`✅ Fetched ${response.data.length} beneficiaries`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch beneficiaries:', error);
      return [];
    }
  }

  async fetchCollectionAccounts(): Promise<WallexCollectionAccount[]> {
    try {
      console.log('🏦 Fetching collection accounts...');
      const response = await this.makeRequest<WallexCollectionAccount[]>('/collection-accounts');
      console.log(`✅ Fetched ${response.data.length} collection accounts`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch collection accounts:', error);
      return [];
    }
  }

  private saveToFile(filename: string, data: any): void {
    const filepath = join(DATA_DIR, filename);
    const jsonData = JSON.stringify(data, null, 2);
    writeFileSync(filepath, jsonData);
    console.log(`💾 Saved data to ${filepath}`);
  }

  async fetchAllData(): Promise<void> {
    console.log('🚀 Starting Wallex data fetch...');
    console.log(`📍 Environment: ${this.config.environment}`);
    console.log(`🌐 Base URL: ${this.config.baseUrl}`);
    console.log('');

    try {
      // Fetch all data in parallel
      const [balances, transactions, beneficiaries, collectionAccounts] = await Promise.all([
        this.fetchBalances(),
        this.fetchTransactions({ limit: 1000 }), // Fetch up to 1000 transactions
        this.fetchBeneficiaries(),
        this.fetchCollectionAccounts()
      ]);

      // Save individual data files
      this.saveToFile('wallex-balances.json', balances);
      this.saveToFile('wallex-transactions.json', transactions);
      this.saveToFile('wallex-beneficiaries.json', beneficiaries);
      this.saveToFile('wallex-collection-accounts.json', collectionAccounts);

      // Create summary data
      const summary = {
        fetchTimestamp: new Date().toISOString(),
        environment: this.config.environment,
        baseUrl: this.config.baseUrl,
        dataCounts: {
          balances: balances.length,
          transactions: transactions.length,
          beneficiaries: beneficiaries.length,
          collectionAccounts: collectionAccounts.length
        },
        balanceSummary: balances.reduce((acc, balance) => {
          acc[balance.currency] = {
            total: balance.total,
            available: balance.available,
            frozen: balance.frozen
          };
          return acc;
        }, {} as Record<string, any>),
        transactionSummary: {
          totalAmount: transactions.reduce((sum, tx) => sum + tx.amount, 0),
          statusCounts: transactions.reduce((acc, tx) => {
            acc[tx.status] = (acc[tx.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          typeCounts: transactions.reduce((acc, tx) => {
            acc[tx.type] = (acc[tx.type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          currencyCounts: transactions.reduce((acc, tx) => {
            acc[tx.currency] = (acc[tx.currency] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        },
        recentTransactions: transactions
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 10)
      };

      this.saveToFile('wallex-summary.json', summary);

      console.log('');
      console.log('🎉 Data fetch completed successfully!');
      console.log(`📁 Data saved to: ${DATA_DIR}`);
      console.log('');
      console.log('📊 Summary:');
      console.log(`   💰 Balances: ${balances.length}`);
      console.log(`   📊 Transactions: ${transactions.length}`);
      console.log(`   👥 Beneficiaries: ${beneficiaries.length}`);
      console.log(`   🏦 Collection Accounts: ${collectionAccounts.length}`);

    } catch (error) {
      console.error('❌ Data fetch failed:', error);
      process.exit(1);
    }
  }
}

// Main execution
async function main(): Promise<void> {
  const fetcher = new WallexDataFetcher(WALLEX_CONFIG);
  await fetcher.fetchAllData();
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

export { WallexDataFetcher };
