// Wallex Integration Exports
export * from './types';
export * from './WallexAdapter';
export * from './ProviderManager';
export * from './WallexService';
export * from './wallexSlice';

// Re-export commonly used items
export { wallexService } from './WallexService';
export { providerManager } from './ProviderManager';
export { 
  fetchWallexBalances,
  fetchWallexTransactions,
  createWallexPayment,
  fetchWallexPayment,
  createWallexConversionQuote,
  executeWallexConversion,
  fetchWallexBeneficiaries,
  createWallexBeneficiary,
  fetchWallexCollectionAccounts,
  checkWallexProviderStatus,
  switchWallexProvider,
  selectWallexBalances,
  selectWallexTransactions,
  selectWallexBeneficiaries,
  selectWallexCollectionAccounts,
  selectWallexProviderStatus,
  selectWallexActiveProvider,
  selectWallexLoading,
  selectWallexError,
  selectWallexLastUpdated
} from './wallexSlice';
