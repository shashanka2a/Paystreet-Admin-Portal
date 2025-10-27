// API Integration Hooks for PayStreet Admin Portal
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { wallexService } from './wallex';

// Types
export interface KYCApplication {
  id: string;
  clientId: string;
  clientName: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedAt: string;
  documents: {
    id: string;
    type: string;
    url: string;
    status: 'pending' | 'verified' | 'rejected';
  }[];
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
  };
  riskScore: number;
  aiPriseResult?: {
    confidence: number;
    verificationStatus: string;
    flags: string[];
  };
}

export interface KYBApplication {
  id: string;
  clientId: string;
  companyName: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedAt: string;
  registrationNumber: string;
  directors: {
    name: string;
    position: string;
    ownership: number;
  }[];
  uboDetails: {
    name: string;
    ownership: number;
    nationality: string;
  }[];
  documents: {
    id: string;
    type: string;
    url: string;
    status: 'pending' | 'verified' | 'rejected';
  }[];
  sanctionsCheck?: {
    status: 'clean' | 'flagged' | 'pending';
    matches: any[];
  };
}

export interface Transaction {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  currency: string;
  type: 'incoming' | 'outgoing';
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  timestamp: string;
  description: string;
  riskScore: number;
  wallexData?: {
    transactionId: string;
    exchangeRate: number;
    fees: number;
  };
}

// KYC API Hooks
export const useKYCApplications = () => {
  return useQuery({
    queryKey: ['kyc-applications'],
    queryFn: async (): Promise<KYCApplication[]> => {
      // Placeholder API call - replace with actual AiPrise integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        {
          id: '1',
          clientId: 'client-1',
          clientName: 'John Doe',
          status: 'pending',
          submittedAt: '2024-01-15T10:30:00Z',
          documents: [
            { id: 'doc-1', type: 'passport', url: '/documents/passport-1.pdf', status: 'verified' },
            { id: 'doc-2', type: 'utility_bill', url: '/documents/bill-1.pdf', status: 'pending' }
          ],
          personalInfo: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com',
            phone: '+1234567890',
            dateOfBirth: '1990-01-01',
            address: '123 Main St, City, Country'
          },
          riskScore: 25,
          aiPriseResult: {
            confidence: 0.95,
            verificationStatus: 'verified',
            flags: []
          }
        },
        {
          id: '2',
          clientId: 'client-2',
          clientName: 'Jane Smith',
          status: 'under_review',
          submittedAt: '2024-01-14T14:20:00Z',
          documents: [
            { id: 'doc-3', type: 'drivers_license', url: '/documents/license-1.pdf', status: 'verified' },
            { id: 'doc-4', type: 'bank_statement', url: '/documents/statement-1.pdf', status: 'rejected' }
          ],
          personalInfo: {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@email.com',
            phone: '+1987654321',
            dateOfBirth: '1985-05-15',
            address: '456 Oak Ave, Town, Country'
          },
          riskScore: 65,
          aiPriseResult: {
            confidence: 0.78,
            verificationStatus: 'needs_review',
            flags: ['document_quality_issue']
          }
        }
      ];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useApproveKYC = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ applicationId, adminNotes }: { applicationId: string; adminNotes?: string }) => {
      // Placeholder API call - replace with actual AiPrise integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Approving KYC:', applicationId, adminNotes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc-applications'] });
      toast.success('KYC application approved successfully');
    },
    onError: () => {
      toast.error('Failed to approve KYC application');
    },
  });
};

export const useRejectKYC = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ applicationId, reason }: { applicationId: string; reason: string }) => {
      // Placeholder API call - replace with actual AiPrise integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Rejecting KYC:', applicationId, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc-applications'] });
      toast.success('KYC application rejected');
    },
    onError: () => {
      toast.error('Failed to reject KYC application');
    },
  });
};

// KYB API Hooks
export const useKYBApplications = () => {
  return useQuery({
    queryKey: ['kyb-applications'],
    queryFn: async (): Promise<KYBApplication[]> => {
      // Placeholder API call - replace with actual sanctions.io integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        {
          id: 'kyb-1',
          clientId: 'client-3',
          companyName: 'Acme Corp Ltd',
          status: 'pending',
          submittedAt: '2024-01-15T09:15:00Z',
          registrationNumber: 'REG123456789',
          directors: [
            { name: 'Robert Johnson', position: 'CEO', ownership: 60 },
            { name: 'Sarah Wilson', position: 'CFO', ownership: 40 }
          ],
          uboDetails: [
            { name: 'Robert Johnson', ownership: 60, nationality: 'US' },
            { name: 'Sarah Wilson', ownership: 40, nationality: 'UK' }
          ],
          documents: [
            { id: 'doc-5', type: 'certificate_of_incorporation', url: '/documents/coi-1.pdf', status: 'verified' },
            { id: 'doc-6', type: 'articles_of_association', url: '/documents/aoa-1.pdf', status: 'pending' }
          ],
          sanctionsCheck: {
            status: 'clean',
            matches: []
          }
        }
      ];
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Transaction API Hooks
export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async (): Promise<Transaction[]> => {
      // Placeholder API call - replace with actual Wallex integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        {
          id: 'txn-1',
          clientId: 'client-1',
          clientName: 'John Doe',
          amount: 5000,
          currency: 'USD',
          type: 'incoming',
          status: 'flagged',
          timestamp: '2024-01-15T16:30:00Z',
          description: 'Wire transfer from overseas',
          riskScore: 85,
          wallexData: {
            transactionId: 'wallex-123',
            exchangeRate: 1.0,
            fees: 25
          }
        },
        {
          id: 'txn-2',
          clientId: 'client-2',
          clientName: 'Jane Smith',
          amount: 2500,
          currency: 'EUR',
          type: 'outgoing',
          status: 'approved',
          timestamp: '2024-01-15T14:20:00Z',
          description: 'Payment to supplier',
          riskScore: 15,
          wallexData: {
            transactionId: 'wallex-124',
            exchangeRate: 0.85,
            fees: 12.50
          }
        }
      ];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for real-time updates
  });
};

export const useApproveTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ transactionId, adminNotes }: { transactionId: string; adminNotes?: string }) => {
      // Placeholder API call - replace with actual Wallex integration
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Approving transaction:', transactionId, adminNotes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction approved successfully');
    },
    onError: () => {
      toast.error('Failed to approve transaction');
    },
  });
};

export const useRejectTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ transactionId, reason }: { transactionId: string; reason: string }) => {
      // Placeholder API call - replace with actual Wallex integration
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Rejecting transaction:', transactionId, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction rejected');
    },
    onError: () => {
      toast.error('Failed to reject transaction');
    },
  });
};

// ===== WALLEX INTEGRATION HOOKS =====

// Wallex Balances
export const useWallexBalances = () => {
  return useQuery({
    queryKey: ['wallex', 'balances'],
    queryFn: async () => {
      return await wallexService.getBalances();
    },
    staleTime: 30 * 1000, // 30 seconds for real-time balance updates
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

// Wallex Transactions with real API integration
export const useWallexTransactions = (params?: any) => {
  return useQuery({
    queryKey: ['wallex', 'transactions', params],
    queryFn: async () => {
      return await wallexService.getTransactions(params);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Wallex Transaction by ID
export const useWallexTransaction = (transactionId: string) => {
  return useQuery({
    queryKey: ['wallex', 'transaction', transactionId],
    queryFn: async () => {
      return await wallexService.getTransactionById(transactionId);
    },
    enabled: !!transactionId,
  });
};

// Wallex High Risk Transactions
export const useWallexHighRiskTransactions = () => {
  return useQuery({
    queryKey: ['wallex', 'high-risk-transactions'],
    queryFn: async () => {
      return await wallexService.getHighRiskTransactions();
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
};

// Wallex Transaction Statistics
export const useWallexTransactionStats = (currency?: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['wallex', 'stats', currency, startDate, endDate],
    queryFn: async () => {
      const [totalVolume, transactionCount] = await Promise.all([
        wallexService.getTotalVolume(currency, startDate, endDate),
        wallexService.getTransactionCount('completed', startDate, endDate)
      ]);
      
      return {
        totalVolume,
        transactionCount,
        averageTransactionValue: transactionCount > 0 ? totalVolume / transactionCount : 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Wallex Beneficiaries
export const useWallexBeneficiaries = () => {
  return useQuery({
    queryKey: ['wallex', 'beneficiaries'],
    queryFn: async () => {
      return await wallexService.getBeneficiaries();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Wallex Collection Accounts
export const useWallexCollectionAccounts = () => {
  return useQuery({
    queryKey: ['wallex', 'collection-accounts'],
    queryFn: async () => {
      return await wallexService.getCollectionAccounts();
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Wallex Provider Status
export const useWallexProviderStatus = () => {
  return useQuery({
    queryKey: ['wallex', 'provider-status'],
    queryFn: async () => {
      return await wallexService.getProviderStatus();
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
};

// Wallex Payment Creation
export const useCreateWallexPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payment: any) => {
      return await wallexService.createPayment(payment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallex', 'transactions'] });
      queryClient.invalidateQueries({ queryKey: ['wallex', 'balances'] });
      toast.success('Payment created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create payment: ${error.message}`);
    },
  });
};

// Wallex Conversion Quote
export const useCreateWallexConversionQuote = () => {
  return useMutation({
    mutationFn: async (request: any) => {
      return await wallexService.createConversionQuote(request);
    },
    onSuccess: () => {
      toast.success('Conversion quote created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create conversion quote: ${error.message}`);
    },
  });
};

// Wallex Conversion Execution
export const useExecuteWallexConversion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (quoteId: string) => {
      return await wallexService.executeConversion(quoteId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallex', 'transactions'] });
      queryClient.invalidateQueries({ queryKey: ['wallex', 'balances'] });
      toast.success('Conversion executed successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to execute conversion: ${error.message}`);
    },
  });
};

// Wallex Beneficiary Creation
export const useCreateWallexBeneficiary = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (beneficiary: any) => {
      return await wallexService.createBeneficiary(beneficiary);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallex', 'beneficiaries'] });
      toast.success('Beneficiary created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create beneficiary: ${error.message}`);
    },
  });
};

// Wallex Provider Switch
export const useSwitchWallexProvider = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (providerName: string) => {
      await wallexService.switchProvider(providerName);
    },
    onSuccess: (providerName) => {
      queryClient.invalidateQueries({ queryKey: ['wallex'] });
      toast.success(`Switched to ${providerName} provider`);
    },
    onError: (error: any) => {
      toast.error(`Failed to switch provider: ${error.message}`);
    },
  });
};
