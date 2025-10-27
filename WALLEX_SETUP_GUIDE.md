# Wallex Integration Setup Guide

## Overview

The PayStreet Admin Portal now includes full Wallex API integration following the provider-adapter architecture outlined in the Wallex Integration Guide. This implementation provides:

- **Real-time transaction monitoring** with Wallex API
- **Provider-adapter pattern** for easy switching between providers
- **Fallback strategy** with automatic failover
- **Redux state management** for Wallex data
- **Real-time balance updates** and transaction statistics
- **Comprehensive error handling** and logging

## Architecture Components

### 1. Provider-Adapter Pattern
- **BaseProvider**: Abstract interface for all providers
- **WallexAdapter**: Concrete implementation for Wallex API
- **ProviderManager**: Manages multiple providers and routing
- **WallexService**: High-level service layer

### 2. Redux Integration
- **wallexSlice**: Redux slice for Wallex state management
- **Async thunks**: For all Wallex API operations
- **Selectors**: For accessing Wallex state
- **Real-time updates**: Automatic cache invalidation

### 3. React Query Integration
- **useWallexTransactions**: Real-time transaction monitoring
- **useWallexBalances**: Live balance updates
- **useWallexProviderStatus**: Provider health monitoring
- **useWallexHighRiskTransactions**: Risk assessment

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the project root:

```env
# Wallex API Configuration
NEXT_PUBLIC_WALLEX_API_KEY=your_wallex_api_key_here
NEXT_PUBLIC_WALLEX_ACCESS_KEY_ID=your_wallex_access_key_id_here
NEXT_PUBLIC_WALLEX_SECRET_ACCESS_KEY=your_wallex_secret_access_key_here
NEXT_PUBLIC_WALLEX_BASE_URL=https://api.wallex.asia
NEXT_PUBLIC_WALLEX_ENVIRONMENT=sandbox
```

### 2. Get Wallex API Credentials

1. Register for a Wallex account at [Wallex](https://wallex.asia)
2. Contact Wallex at `contact@wallextech.com` to request API credentials
3. You will receive:
   - **X-Api-Key** - Identifies your application
   - **AccessKeyId** - Used for authentication
   - **SecretAccessKey** - Used for authentication

### 3. Features Implemented

#### Transaction Monitoring
- **Real-time transaction updates** every 30 seconds
- **Provider status indicators** showing Wallex connectivity
- **Fallback mode** when Wallex is unavailable
- **Transaction filtering** by status, date, and search terms
- **Risk assessment** based on transaction amounts
- **Detailed transaction views** with Wallex API data

#### Balance Management
- **Multi-currency balances** (USD, SGD, EUR, GBP, HKD)
- **Real-time balance updates** every minute
- **Balance history** and trends
- **Currency conversion** support

#### Provider Management
- **Automatic failover** to fallback provider
- **Provider health monitoring** every 2 minutes
- **Manual provider switching** capability
- **Error handling** with detailed logging

### 4. API Integration Details

#### Authentication
The Wallex adapter handles authentication automatically with token refresh:

```typescript
const provider = providerManager.getActiveProvider();
await provider.authenticate(); // Returns access token
```

#### Transaction Operations
```typescript
// Get transactions with real-time updates
const transactions = await wallexService.getTransactions({
  limit: 100,
  sort: 'timestamp:desc'
});

// Get high-risk transactions
const highRisk = await wallexService.getHighRiskTransactions();

// Get transaction statistics
const stats = await wallexService.getTotalVolume('USD', startDate, endDate);
```

#### Balance Operations
```typescript
// Get all balances
const balances = await wallexService.getBalances();

// Get specific currency balance
const usdBalance = await wallexService.getBalance('USD');
```

### 5. Real-time Features

#### Transaction Monitoring
- **30-second refresh** for transaction updates
- **5-minute refresh** for transaction statistics
- **2-minute refresh** for high-risk transactions
- **1-minute refresh** for provider status

#### Balance Updates
- **1-minute refresh** for balance updates
- **30-second stale time** for real-time feel
- **Automatic cache invalidation** on transactions

### 6. Error Handling & Fallback

#### Fallback Strategy
1. **Primary**: Try Wallex API first
2. **Fallback**: Use mock provider if Wallex fails
3. **Error Handling**: Comprehensive error logging and user feedback

#### Error Types Handled
- **Authentication Errors** - Invalid credentials
- **Network Errors** - Connection issues
- **API Errors** - Wallex API specific errors
- **Validation Errors** - Invalid request data

### 7. Usage Examples

#### Using Wallex Hooks
```typescript
import { 
  useWallexTransactions, 
  useWallexBalances, 
  useWallexProviderStatus 
} from '../lib/api-hooks';

function TransactionComponent() {
  const { data: transactions, isLoading } = useWallexTransactions();
  const { data: balances } = useWallexBalances();
  const { data: providerStatus } = useWallexProviderStatus();
  
  // Component logic...
}
```

#### Using Wallex Service Directly
```typescript
import { wallexService } from '../lib/wallex';

// Get transactions
const transactions = await wallexService.getTransactions();

// Create payment
const payment = await wallexService.createPayment({
  beneficiaryId: 'beneficiary_id',
  amount: 1000,
  currency: 'USD',
  purpose: 'Business payment',
  reference: 'REF123456'
});
```

### 8. Monitoring & Debugging

#### Provider Status
The admin portal displays real-time provider status:
- **Green**: Wallex API active and healthy
- **Red**: Wallex API down, using fallback
- **Orange**: Fallback provider active

#### Debug Mode
Enable debug logging by setting:
```env
NEXT_PUBLIC_DEBUG=true
```

#### Console Logging
All Wallex operations are logged to console with:
- API endpoint
- Request parameters
- Response data
- Error details
- Timestamps

### 9. Security Considerations

1. **API Keys** - Store securely, never commit to version control
2. **HTTPS** - All API calls use HTTPS
3. **Token Management** - Automatic token refresh
4. **Data Validation** - Input validation and sanitization
5. **Error Handling** - No sensitive data in error messages

### 10. Performance Optimization

1. **Caching** - Balance and transaction caching with React Query
2. **Batch Operations** - Bulk API calls where possible
3. **Lazy Loading** - Load data on demand
4. **Connection Pooling** - Reuse HTTP connections
5. **Real-time Updates** - Optimized refresh intervals

## Testing

### Development Testing
1. Use Wallex sandbox environment
2. Test with sample data
3. Verify fallback behavior
4. Check error handling

### Production Testing
1. Verify API credentials
2. Test with real transactions (small amounts)
3. Monitor error logs
4. Validate data consistency

## Support

For technical support:
1. **Wallex API Issues** - Contact Wallex support
2. **Integration Issues** - Check console logs and error messages
3. **Code Issues** - Review the implementation in `/src/lib/wallex/`

## Future Enhancements

The architecture supports adding new providers:
1. **CurrencyCloud** - Multi-currency accounts
2. **Airwallex** - Global payments
3. **Wise** - International transfers
4. **WorldFirst** - Currency exchange

Additional features planned:
- **Routing Rules** - Route transactions based on currency/corridor
- **Load Balancing** - Distribute load across providers
- **Circuit Breaker** - Automatic failover
- **Rate Limiting** - API rate limit management
