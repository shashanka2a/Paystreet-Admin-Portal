import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { wallexService } from './WallexService';
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

// Async thunks for Wallex operations
export const fetchWallexBalances = createAsyncThunk(
  'wallex/fetchBalances',
  async () => {
    return await wallexService.getBalances();
  }
);

export const fetchWallexTransactions = createAsyncThunk(
  'wallex/fetchTransactions',
  async (params?: any) => {
    return await wallexService.getTransactions(params);
  }
);

export const createWallexPayment = createAsyncThunk(
  'wallex/createPayment',
  async (payment: WallexPaymentRequest) => {
    return await wallexService.createPayment(payment);
  }
);

export const fetchWallexPayment = createAsyncThunk(
  'wallex/fetchPayment',
  async (paymentId: string) => {
    return await wallexService.getPayment(paymentId);
  }
);

export const createWallexConversionQuote = createAsyncThunk(
  'wallex/createConversionQuote',
  async (request: WallexConversionRequest) => {
    return await wallexService.createConversionQuote(request);
  }
);

export const executeWallexConversion = createAsyncThunk(
  'wallex/executeConversion',
  async (quoteId: string) => {
    return await wallexService.executeConversion(quoteId);
  }
);

export const fetchWallexBeneficiaries = createAsyncThunk(
  'wallex/fetchBeneficiaries',
  async () => {
    return await wallexService.getBeneficiaries();
  }
);

export const createWallexBeneficiary = createAsyncThunk(
  'wallex/createBeneficiary',
  async (beneficiary: WallexBeneficiaryRequest) => {
    return await wallexService.createBeneficiary(beneficiary);
  }
);

export const fetchWallexCollectionAccounts = createAsyncThunk(
  'wallex/fetchCollectionAccounts',
  async () => {
    return await wallexService.getCollectionAccounts();
  }
);

export const checkWallexProviderStatus = createAsyncThunk(
  'wallex/checkProviderStatus',
  async () => {
    return await wallexService.getProviderStatus();
  }
);

export const switchWallexProvider = createAsyncThunk(
  'wallex/switchProvider',
  async (providerName: string) => {
    await wallexService.switchProvider(providerName);
    return providerName;
  }
);

// Wallex slice
interface WallexState {
  balances: WallexBalance[];
  transactions: WallexTransaction[];
  beneficiaries: WallexBeneficiary[];
  collectionAccounts: WallexCollectionAccount[];
  conversionQuotes: WallexConversionQuote[];
  providerStatus: ProviderStatus;
  activeProvider: string;
  loading: {
    balances: boolean;
    transactions: boolean;
    beneficiaries: boolean;
    collectionAccounts: boolean;
    payments: boolean;
    conversions: boolean;
    providerStatus: boolean;
  };
  error: string | null;
  lastUpdated: string | null;
}

const initialState: WallexState = {
  balances: [],
  transactions: [],
  beneficiaries: [],
  collectionAccounts: [],
  conversionQuotes: [],
  providerStatus: {
    WALLEX: 'inactive',
    FALLBACK: 'inactive'
  },
  activeProvider: 'WALLEX',
  loading: {
    balances: false,
    transactions: false,
    beneficiaries: false,
    collectionAccounts: false,
    payments: false,
    conversions: false,
    providerStatus: false,
  },
  error: null,
  lastUpdated: null,
};

const wallexSlice = createSlice({
  name: 'wallex',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addTransaction: (state, action: PayloadAction<WallexTransaction>) => {
      state.transactions.unshift(action.payload);
    },
    updateTransaction: (state, action: PayloadAction<WallexTransaction>) => {
      const index = state.transactions.findIndex(tx => tx.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
    setLastUpdated: (state) => {
      state.lastUpdated = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    // Fetch balances
    builder
      .addCase(fetchWallexBalances.pending, (state) => {
        state.loading.balances = true;
        state.error = null;
      })
      .addCase(fetchWallexBalances.fulfilled, (state, action) => {
        state.loading.balances = false;
        state.balances = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchWallexBalances.rejected, (state, action) => {
        state.loading.balances = false;
        state.error = action.error.message || 'Failed to fetch balances';
      });

    // Fetch transactions
    builder
      .addCase(fetchWallexTransactions.pending, (state) => {
        state.loading.transactions = true;
        state.error = null;
      })
      .addCase(fetchWallexTransactions.fulfilled, (state, action) => {
        state.loading.transactions = false;
        state.transactions = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchWallexTransactions.rejected, (state, action) => {
        state.loading.transactions = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      });

    // Create payment
    builder
      .addCase(createWallexPayment.pending, (state) => {
        state.loading.payments = true;
        state.error = null;
      })
      .addCase(createWallexPayment.fulfilled, (state, action) => {
        state.loading.payments = false;
        state.transactions.unshift(action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createWallexPayment.rejected, (state, action) => {
        state.loading.payments = false;
        state.error = action.error.message || 'Failed to create payment';
      });

    // Fetch beneficiaries
    builder
      .addCase(fetchWallexBeneficiaries.pending, (state) => {
        state.loading.beneficiaries = true;
        state.error = null;
      })
      .addCase(fetchWallexBeneficiaries.fulfilled, (state, action) => {
        state.loading.beneficiaries = false;
        state.beneficiaries = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchWallexBeneficiaries.rejected, (state, action) => {
        state.loading.beneficiaries = false;
        state.error = action.error.message || 'Failed to fetch beneficiaries';
      });

    // Create beneficiary
    builder
      .addCase(createWallexBeneficiary.pending, (state) => {
        state.loading.beneficiaries = true;
        state.error = null;
      })
      .addCase(createWallexBeneficiary.fulfilled, (state, action) => {
        state.loading.beneficiaries = false;
        state.beneficiaries.push(action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createWallexBeneficiary.rejected, (state, action) => {
        state.loading.beneficiaries = false;
        state.error = action.error.message || 'Failed to create beneficiary';
      });

    // Fetch collection accounts
    builder
      .addCase(fetchWallexCollectionAccounts.pending, (state) => {
        state.loading.collectionAccounts = true;
        state.error = null;
      })
      .addCase(fetchWallexCollectionAccounts.fulfilled, (state, action) => {
        state.loading.collectionAccounts = false;
        state.collectionAccounts = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchWallexCollectionAccounts.rejected, (state, action) => {
        state.loading.collectionAccounts = false;
        state.error = action.error.message || 'Failed to fetch collection accounts';
      });

    // Check provider status
    builder
      .addCase(checkWallexProviderStatus.pending, (state) => {
        state.loading.providerStatus = true;
        state.error = null;
      })
      .addCase(checkWallexProviderStatus.fulfilled, (state, action) => {
        state.loading.providerStatus = false;
        state.providerStatus = action.payload;
      })
      .addCase(checkWallexProviderStatus.rejected, (state, action) => {
        state.loading.providerStatus = false;
        state.error = action.error.message || 'Failed to check provider status';
      });

    // Switch provider
    builder
      .addCase(switchWallexProvider.fulfilled, (state, action) => {
        state.activeProvider = action.payload;
      });
  },
});

export const { clearError, addTransaction, updateTransaction, setLastUpdated } = wallexSlice.actions;
export default wallexSlice.reducer;

// Selectors
export const selectWallexBalances = (state: { wallex: WallexState }) => state.wallex.balances;
export const selectWallexTransactions = (state: { wallex: WallexState }) => state.wallex.transactions;
export const selectWallexBeneficiaries = (state: { wallex: WallexState }) => state.wallex.beneficiaries;
export const selectWallexCollectionAccounts = (state: { wallex: WallexState }) => state.wallex.collectionAccounts;
export const selectWallexProviderStatus = (state: { wallex: WallexState }) => state.wallex.providerStatus;
export const selectWallexActiveProvider = (state: { wallex: WallexState }) => state.wallex.activeProvider;
export const selectWallexLoading = (state: { wallex: WallexState }) => state.wallex.loading;
export const selectWallexError = (state: { wallex: WallexState }) => state.wallex.error;
export const selectWallexLastUpdated = (state: { wallex: WallexState }) => state.wallex.lastUpdated;
