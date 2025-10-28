#!/usr/bin/env tsx

/**
 * Wallex API Connection Test Script
 * 
 * This script tests the Wallex API connection and validates credentials
 * without fetching large amounts of data.
 */

import { config } from 'dotenv';

// Load environment variables
config();

// Wallex API Configuration
const WALLEX_CONFIG = {
  apiKey: process.env.REACT_APP_WALLEX_API_KEY || process.env.NEXT_PUBLIC_WALLEX_API_KEY,
  accessKeyId: process.env.REACT_APP_WALLEX_ACCESS_KEY_ID || process.env.NEXT_PUBLIC_WALLEX_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_WALLEX_SECRET_ACCESS_KEY || process.env.NEXT_PUBLIC_WALLEX_SECRET_ACCESS_KEY,
  baseUrl: process.env.REACT_APP_WALLEX_BASE_URL || process.env.NEXT_PUBLIC_WALLEX_BASE_URL || 'https://api.wallex.asia',
  environment: process.env.REACT_APP_WALLEX_ENVIRONMENT || process.env.NEXT_PUBLIC_WALLEX_ENVIRONMENT || 'sandbox'
};

class WallexConnectionTester {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(private config: typeof WALLEX_CONFIG) {
    this.validateConfig();
  }

  private validateConfig(): void {
    console.log('🔍 Validating configuration...');
    
    const required = ['apiKey', 'accessKeyId', 'secretAccessKey'];
    const missing = required.filter(key => !this.config[key as keyof typeof this.config]);
    
    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:', missing.join(', '));
      console.error('Please check your .env file and ensure all Wallex API credentials are set.');
      console.error('');
      console.error('Required variables:');
      console.error('  NEXT_PUBLIC_WALLEX_API_KEY');
      console.error('  NEXT_PUBLIC_WALLEX_ACCESS_KEY_ID');
      console.error('  NEXT_PUBLIC_WALLEX_SECRET_ACCESS_KEY');
      process.exit(1);
    }

    console.log('✅ Configuration validation passed');
    console.log(`📍 Environment: ${this.config.environment}`);
    console.log(`🌐 Base URL: ${this.config.baseUrl}`);
    console.log(`🔑 API Key: ${this.config.apiKey?.substring(0, 8)}...`);
    console.log('');
  }

  private async authenticate(): Promise<string> {
    // Check if token is still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      console.log('🔐 Testing authentication...');
      
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

      console.log(`📡 Authentication response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Authentication failed:', response.statusText);
        console.error('Response:', errorText);
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.accessToken;
      this.tokenExpiry = Date.now() + (data.expiresIn * 1000) - 60000; // 1 minute buffer
      
      console.log('✅ Authentication successful');
      console.log(`🎫 Token expires in: ${Math.round((this.tokenExpiry - Date.now()) / 1000)} seconds`);
      return this.accessToken!;
    } catch (error) {
      console.error('❌ Authentication failed:', error);
      throw new Error('Failed to authenticate with Wallex API');
    }
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const token = await this.authenticate();
      
      console.log(`📡 Making request to: ${endpoint}`);
      
      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Api-Key': this.config.apiKey!,
          ...options.headers,
        },
      });

      console.log(`📡 Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API request failed: ${response.statusText}`);
        console.error('Response:', errorText);
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ API request successful');
      return data;
    } catch (error) {
      console.error(`❌ API request failed (${endpoint}):`, error);
      throw error;
    }
  }

  async testBalances(): Promise<void> {
    try {
      console.log('💰 Testing balances endpoint...');
      const response = await this.makeRequest<any>('/balances');
      console.log(`✅ Balances endpoint working - found ${response.data?.length || 0} balances`);
      
      if (response.data && response.data.length > 0) {
        console.log('📊 Sample balance data:');
        response.data.slice(0, 3).forEach((balance: any) => {
          console.log(`   ${balance.currency}: ${balance.total || balance.available || 0}`);
        });
      }
    } catch (error) {
      console.error('❌ Balances test failed:', error);
    }
  }

  async testTransactions(): Promise<void> {
    try {
      console.log('📊 Testing transactions endpoint...');
      const response = await this.makeRequest<any>('/transactions?limit=5');
      console.log(`✅ Transactions endpoint working - found ${response.data?.length || 0} transactions`);
      
      if (response.data && response.data.length > 0) {
        console.log('📊 Sample transaction data:');
        response.data.slice(0, 2).forEach((tx: any) => {
          console.log(`   ${tx.id}: ${tx.amount} ${tx.currency} (${tx.status})`);
        });
      }
    } catch (error) {
      console.error('❌ Transactions test failed:', error);
    }
  }

  async testBeneficiaries(): Promise<void> {
    try {
      console.log('👥 Testing beneficiaries endpoint...');
      const response = await this.makeRequest<any>('/beneficiaries');
      console.log(`✅ Beneficiaries endpoint working - found ${response.data?.length || 0} beneficiaries`);
    } catch (error) {
      console.error('❌ Beneficiaries test failed:', error);
    }
  }

  async runConnectionTest(): Promise<void> {
    console.log('🚀 Starting Wallex API connection test...');
    console.log('');

    try {
      // Test authentication first
      await this.authenticate();
      console.log('');

      // Test individual endpoints
      await this.testBalances();
      console.log('');

      await this.testTransactions();
      console.log('');

      await this.testBeneficiaries();
      console.log('');

      console.log('🎉 All API connection tests completed successfully!');
      console.log('');
      console.log('✅ Your Wallex API credentials are working correctly');
      console.log('✅ You can now run the full data fetching script');
      console.log('');
      console.log('Next steps:');
      console.log('  1. Run: npm run fetch-wallex-data');
      console.log('  2. Check the data/ directory for fetched data');
      console.log('  3. The dashboard will automatically use the real data');

    } catch (error) {
      console.error('❌ Connection test failed:', error);
      console.log('');
      console.log('Troubleshooting:');
      console.log('  1. Verify your API credentials in the .env file');
      console.log('  2. Check if you\'re using the correct environment (sandbox vs production)');
      console.log('  3. Ensure your Wallex account has API access enabled');
      console.log('  4. Contact Wallex support if issues persist');
      process.exit(1);
    }
  }
}

// Main execution
async function main(): Promise<void> {
  const tester = new WallexConnectionTester(WALLEX_CONFIG);
  await tester.runConnectionTest();
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

export { WallexConnectionTester };
