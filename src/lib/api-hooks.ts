// API Integration Hooks for PayStreet Admin Portal
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { wallexService } from './wallex/index';

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

// ===== MISSING TYPES AND HOOKS =====

// Client Types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  country: string;
  status: 'active' | 'inactive' | 'suspended';
  kycStatus: 'pending' | 'approved' | 'rejected' | 'under_review';
  kybStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  joinedAt: string;
  lastActivity: string;
  riskScore: number;
  totalTransactions: number;
  totalVolume: number;
  currency: string;
  kycData?: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    idNumber: string;
    address: string;
    documents: {
      id: string;
      type: string;
      url: string;
      status: string;
    }[];
  };
  kybData?: {
    companyName: string;
    registrationNumber: string;
    businessType: string;
    incorporationDate: string;
    businessAddress: string;
    directors: {
      name: string;
      position: string;
      ownership: number;
    }[];
    ubos: {
      name: string;
      ownership: number;
      nationality: string;
    }[];
  };
  bankAccounts?: {
    id: string;
    accountNumber: string;
    bankName: string;
    accountType: string;
    currency: string;
    balance: number;
    status: string;
    country: string;
    verified: boolean;
  }[];
}

// Message Types
export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  subject: string;
  content: string;
  timestamp: string;
  status: 'unread' | 'read' | 'archived';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  attachments?: {
    id: string;
    name: string;
    url: string;
    size: number;
  }[];
}

export interface MessageThread {
  id: string;
  subject: string;
  clientName: string;
  participants: string[];
  lastMessage: string;
  unreadCount: number;
  status: 'active' | 'archived';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

// User and Role Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  details: any;
}

// System Settings Types
export interface SystemSetting {
  id: string;
  key: string;
  value: string | number | boolean;
  type: 'string' | 'number' | 'boolean' | 'json';
  description: string;
  category: string;
  isEditable: boolean;
  updatedAt: string;
}

// Client API Hooks
export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async (): Promise<Client[]> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        {
          id: 'client-1',
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1234567890',
          companyName: 'Doe Enterprises',
          country: 'United States',
          status: 'active',
          kycStatus: 'approved',
          kybStatus: 'pending',
          createdAt: '2024-01-01T00:00:00Z',
          joinedAt: '2024-01-01T00:00:00Z',
          lastActivity: '2024-01-15T10:30:00Z',
          riskScore: 25,
          totalTransactions: 15,
          totalVolume: 50000,
          currency: 'USD',
          kycData: {
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1990-01-01',
            nationality: 'US',
            idNumber: '123456789',
            address: '123 Main St, City, Country',
            documents: [
              { id: 'doc-1', type: 'passport', url: '/documents/passport-1.pdf', status: 'verified' },
              { id: 'doc-2', type: 'utility_bill', url: '/documents/bill-1.pdf', status: 'pending' }
            ]
          },
          kybData: {
            companyName: 'Doe Enterprises',
            registrationNumber: 'REG123456789',
            businessType: 'Corporation',
            incorporationDate: '2020-01-01',
            businessAddress: '123 Business St, City, Country',
            directors: [
              { name: 'John Doe', position: 'CEO', ownership: 100 }
            ],
            ubos: [
              { name: 'John Doe', ownership: 100, nationality: 'US' }
            ]
          },
          bankAccounts: [
            {
              id: 'bank-1',
              accountNumber: '****1234',
              bankName: 'Chase Bank',
              accountType: 'Checking',
              currency: 'USD',
              balance: 25000,
              status: 'active',
              country: 'United States',
              verified: true
            }
          ]
        },
        {
          id: 'client-2',
          name: 'Jane Smith',
          email: 'jane.smith@email.com',
          phone: '+1987654321',
          companyName: 'Smith & Co',
          country: 'United Kingdom',
          status: 'active',
          kycStatus: 'under_review',
          kybStatus: 'approved',
          createdAt: '2024-01-02T00:00:00Z',
          joinedAt: '2024-01-02T00:00:00Z',
          lastActivity: '2024-01-14T14:20:00Z',
          riskScore: 65,
          totalTransactions: 8,
          totalVolume: 25000,
          currency: 'GBP',
          kycData: {
            firstName: 'Jane',
            lastName: 'Smith',
            dateOfBirth: '1985-05-15',
            nationality: 'UK',
            idNumber: '987654321',
            address: '456 Oak Ave, Town, Country',
            documents: [
              { id: 'doc-3', type: 'drivers_license', url: '/documents/license-1.pdf', status: 'verified' },
              { id: 'doc-4', type: 'bank_statement', url: '/documents/statement-1.pdf', status: 'rejected' }
            ]
          },
          kybData: {
            companyName: 'Smith & Co',
            registrationNumber: 'REG987654321',
            businessType: 'LLC',
            incorporationDate: '2018-06-15',
            businessAddress: '456 Business Ave, Town, Country',
            directors: [
              { name: 'Jane Smith', position: 'Managing Director', ownership: 100 }
            ],
            ubos: [
              { name: 'Jane Smith', ownership: 100, nationality: 'UK' }
            ]
          },
          bankAccounts: [
            {
              id: 'bank-2',
              accountNumber: '****5678',
              bankName: 'Barclays Bank',
              accountType: 'Business',
              currency: 'GBP',
              balance: 15000,
              status: 'active',
              country: 'United Kingdom',
              verified: true
            }
          ]
        }
      ];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useClientTransactions = (clientId: string) => {
  return useQuery({
    queryKey: ['client-transactions', clientId],
    queryFn: async (): Promise<Transaction[]> => {
      if (!clientId) return [];
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        {
          id: 'txn-1',
          clientId,
          clientName: 'Client Name',
          amount: 5000,
          currency: 'USD',
          type: 'incoming',
          status: 'approved',
          timestamp: '2024-01-15T16:30:00Z',
          description: 'Wire transfer',
          riskScore: 25,
          wallexData: {
            transactionId: 'wallex-123',
            exchangeRate: 1.0,
            fees: 25
          }
        }
      ];
    },
    enabled: !!clientId,
    staleTime: 2 * 60 * 1000,
  });
};

// Message API Hooks
export const useMessages = () => {
  return useQuery({
    queryKey: ['messages'],
    queryFn: async (): Promise<Message[]> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        {
          id: 'msg-1',
          threadId: 'thread-1',
          senderId: 'admin-1',
          senderName: 'Admin User',
          recipientId: 'client-1',
          recipientName: 'John Doe',
          subject: 'KYC Document Request',
          content: 'Please provide additional documentation for your KYC verification.',
          timestamp: '2024-01-15T10:30:00Z',
          status: 'unread',
          priority: 'normal'
        }
      ];
    },
    staleTime: 1 * 60 * 1000,
  });
};

export const useMessageThreads = () => {
  return useQuery({
    queryKey: ['message-threads'],
    queryFn: async (): Promise<MessageThread[]> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        {
          id: 'thread-1',
          subject: 'KYC Document Request',
          clientName: 'John Doe',
          participants: ['admin-1', 'client-1'],
          lastMessage: 'Please provide additional documentation for your KYC verification.',
          unreadCount: 1,
          status: 'active',
          priority: 'normal',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          messages: [
            {
              id: 'msg-1',
              threadId: 'thread-1',
              senderId: 'admin-1',
              senderName: 'Admin User',
              recipientId: 'client-1',
              recipientName: 'John Doe',
              subject: 'KYC Document Request',
              content: 'Please provide additional documentation for your KYC verification.',
              timestamp: '2024-01-15T10:30:00Z',
              status: 'unread',
              priority: 'normal'
            }
          ]
        },
        {
          id: 'thread-2',
          subject: 'Transaction Inquiry',
          clientName: 'Jane Smith',
          participants: ['admin-1', 'client-2'],
          lastMessage: 'Your transaction has been processed successfully.',
          unreadCount: 0,
          status: 'active',
          priority: 'low',
          createdAt: '2024-01-14T14:20:00Z',
          updatedAt: '2024-01-14T14:20:00Z',
          messages: [
            {
              id: 'msg-2',
              threadId: 'thread-2',
              senderId: 'admin-1',
              senderName: 'Admin User',
              recipientId: 'client-2',
              recipientName: 'Jane Smith',
              subject: 'Transaction Inquiry',
              content: 'Your transaction has been processed successfully.',
              timestamp: '2024-01-14T14:20:00Z',
              status: 'read',
              priority: 'low'
            }
          ]
        }
      ];
    },
    staleTime: 1 * 60 * 1000,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (message: Partial<Message>) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Sending message:', message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Message sent successfully');
    },
    onError: () => {
      toast.error('Failed to send message');
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (messageId: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Marking message as read:', messageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};

export const useArchiveMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (messageId: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Archiving message:', messageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Message archived');
    },
    onError: () => {
      toast.error('Failed to archive message');
    },
  });
};

// User and Role API Hooks
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        {
          id: 'user-1',
          username: 'admin',
          email: 'admin@paystreet.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          status: 'active',
          lastLogin: '2024-01-15T10:30:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          permissions: ['read', 'write', 'admin']
        }
      ];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async (): Promise<Role[]> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        {
          id: 'role-1',
          name: 'Admin',
          description: 'Full system access',
          permissions: ['read', 'write', 'admin'],
          userCount: 2,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ];
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useAuditLogs = () => {
  return useQuery({
    queryKey: ['audit-logs'],
    queryFn: async (): Promise<AuditLogEntry[]> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        {
          id: 'log-1',
          userId: 'user-1',
          userName: 'Admin User',
          action: 'LOGIN',
          resource: 'system',
          resourceId: 'auth',
          timestamp: '2024-01-15T10:30:00Z',
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0...',
          details: { success: true }
        }
      ];
    },
    staleTime: 1 * 60 * 1000,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (user: Partial<User>) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Creating user:', user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: () => {
      toast.error('Failed to create user');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<User>) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Updating user:', id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
    },
    onError: () => {
      toast.error('Failed to update user');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Deleting user:', userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete user');
    },
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (role: Partial<Role>) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Creating role:', role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role created successfully');
    },
    onError: () => {
      toast.error('Failed to create role');
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Role>) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Updating role:', id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role updated successfully');
    },
    onError: () => {
      toast.error('Failed to update role');
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (roleId: string) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Deleting role:', roleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete role');
    },
  });
};

// System Settings API Hooks
export const useSystemSettings = () => {
  return useQuery({
    queryKey: ['system-settings'],
    queryFn: async (): Promise<SystemSetting[]> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        {
          id: 'setting-1',
          key: 'max_transaction_amount',
          value: 100000,
          type: 'number',
          description: 'Maximum transaction amount allowed',
          category: 'transactions',
          isEditable: true,
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 'setting-2',
          key: 'email_notifications_enabled',
          value: true,
          type: 'boolean',
          description: 'Enable email notifications',
          category: 'notifications',
          isEditable: true,
          updatedAt: '2024-01-15T10:30:00Z'
        }
      ];
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useUpdateSystemSetting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, value }: { id: string; value: string | number | boolean }) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Updating system setting:', id, value);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast.success('System setting updated successfully');
    },
    onError: () => {
      toast.error('Failed to update system setting');
    },
  });
};
