// Wallex API Types and Interfaces

export interface WallexCredentials {
  apiKey: string;
  accessKeyId: string;
  secretAccessKey: string;
  baseUrl: string;
  environment: 'sandbox' | 'production';
}

export interface WallexBalance {
  currency: string;
  available: number;
  frozen: number;
  total: number;
}

export interface WallexTransaction {
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
  beneficiaryName?: string;
  beneficiaryAccount?: string;
  beneficiaryBank?: string;
  beneficiaryCountry?: string;
}

export interface WallexBeneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  country: string;
  currency: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

export interface WallexConversionQuote {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
  fees: number;
  expiresAt: string;
}

export interface WallexCollectionAccount {
  id: string;
  accountNumber: string;
  bankName: string;
  country: string;
  currency: string;
  status: 'active' | 'inactive';
  virtualAccountName?: string;
}

export interface WallexPaymentRequest {
  beneficiaryId: string;
  amount: number;
  currency: string;
  purpose: string;
  reference: string;
  description?: string;
}

export interface WallexConversionRequest {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

export interface WallexBeneficiaryRequest {
  name: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  country: string;
  currency: string;
}

export interface WallexApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface WallexError {
  code: string;
  message: string;
  details?: any;
}

export interface ProviderStatus {
  WALLEX: 'active' | 'inactive' | 'error';
  FALLBACK: 'active' | 'inactive' | 'error';
}

export interface BaseProvider {
  authenticate(): Promise<string>;
  getBalances(): Promise<WallexBalance[]>;
  getTransactions(params?: any): Promise<WallexTransaction[]>;
  createPayment(payment: WallexPaymentRequest): Promise<WallexTransaction>;
  getPayment(paymentId: string): Promise<WallexTransaction>;
  createConversionQuote(request: WallexConversionRequest): Promise<WallexConversionQuote>;
  executeConversion(quoteId: string): Promise<WallexTransaction>;
  getBeneficiaries(): Promise<WallexBeneficiary[]>;
  createBeneficiary(beneficiary: WallexBeneficiaryRequest): Promise<WallexBeneficiary>;
  getCollectionAccounts(): Promise<WallexCollectionAccount[]>;
  getProviderStatus(): Promise<ProviderStatus>;
}

