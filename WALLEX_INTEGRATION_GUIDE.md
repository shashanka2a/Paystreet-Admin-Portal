# Wallex API Integration Guide

## Overview

This guide explains how to integrate the Wallex API into the PayStreet application. The integration follows a modular provider-adapter architecture that allows for easy switching between different financial service providers.

## Architecture

### Provider-Adapter Pattern

The integration uses a provider-adapter pattern with the following components:

1. **BaseProvider** - Abstract interface defining the contract for all providers
2. **WallexAdapter** - Concrete implementation for Wallex API
3. **ProviderManager** - Manages multiple providers and routing
4. **WallexService** - High-level service layer for Wallex operations

### Key Features

- **Modular Design** - Easy to add new providers in the future
- **Fallback Support** - Falls back to existing APIs if Wallex is unavailable
- **Type Safety** - Full TypeScript support with proper interfaces
- **Error Handling** - Comprehensive error handling and logging
- **State Management** - Redux integration for state management

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
# Wallex API Configuration
REACT_APP_WALLEX_API_KEY=your_wallex_api_key_here
REACT_APP_WALLEX_ACCESS_KEY_ID=your_wallex_access_key_id_here
REACT_APP_WALLEX_SECRET_ACCESS_KEY=your_wallex_secret_access_key_here
REACT_APP_WALLEX_BASE_URL=https://api.wallex.asia
REACT_APP_WALLEX_ENVIRONMENT=sandbox
```

### 2. Get Wallex API Credentials

1. Register for a Wallex account at [Wallex](https://wallex.asia)
2. Contact Wallex at `contact@wallextech.com` to request API credentials
3. You will receive:
   - **X-Api-Key** - Identifies your application
   - **AccessKeyId** - Used for authentication
   - **SecretAccessKey** - Used for authentication

### 3. Install Dependencies

The integration uses existing dependencies. No additional packages are required.

### 4. Build and Run

```bash
npm install
npm start
```

## Phase 1 Features Implementation

### 1. User Dashboard

**Real-time Balances**
- Multi-currency wallet balances (USD, SGD, EUR, GBP, HKD)
- Real-time balance updates
- Currency-specific wallet cards

**FX Rate Calculator**
- Live exchange rates
- Conversion calculations
- Fee transparency

**Quick Access Links**
- Send Money
- Convert
- Collections
- Reports
- Referrals

### 2. Send Money

**Multi-step Workflow**
- Step 1: Basic Information (recipient selection)
- Step 2: Additional Information (amount, purpose)
- Step 3: Review & Pay (confirmation and execution)

**Beneficiary Management**
- Add new beneficiaries
- Edit existing beneficiaries
- Delete beneficiaries
- Bulk beneficiary operations

**Bulk Payments**
- CSV/XLSX file upload support
- Multi-beneficiary payment processing
- Batch payment tracking

**Send Money History**
- Transaction timestamps
- Completion status tracking
- Payment reference numbers

### 3. Convert (FX)

**Wallet-based FX Conversions**
- Convert between supported currencies
- Real-time quote generation
- Conversion execution

**Conversion History**
- Credit/debit entries
- Applied exchange rates
- Conversion fees
- Transaction timestamps

### 4. Collections

**Collection Accounts**
- SG-based accounts
- Named virtual accounts
- US/UK-based accounts
- Multi-currency support

**Inbound Transfers**
- Transfer notifications
- Payer information display
- Collection tracking

### 5. Reports

**Downloadable Reports**
- Payment reports
- Conversion reports
- Balance statements
- E-statements

**Report Filtering**
- Date range filtering
- Beneficiary filtering
- Currency filtering
- Transaction type filtering

## API Integration Details

### Authentication

The Wallex adapter handles authentication automatically:

```typescript
// Authentication is handled internally
const provider = providerManager.getActiveProvider();
await provider.authenticate(); // Returns access token
```

### Balance Operations

```typescript
// Get all balances
const balances = await wallexService.getBalances();

// Get specific currency balance
const usdBalance = await wallexService.getBalance('USD');
```

### Payment Operations

```typescript
// Create payment
const payment = await wallexService.createPayment({
  beneficiaryId: 'beneficiary_id',
  amount: 1000,
  currency: 'USD',
  purpose: 'Business payment',
  reference: 'REF123456'
});

// Get payment status
const paymentStatus = await wallexService.getPayment(payment.paymentId);
```

### Conversion Operations

```typescript
// Create conversion quote
const quote = await wallexService.createConversionQuote('USD', 'SGD', 1000);

// Execute conversion
const conversion = await wallexService.executeConversion(quote.quoteId);
```

### Beneficiary Operations

```typescript
// Create beneficiary
const beneficiary = await wallexService.createBeneficiary({
  name: 'John Doe',
  accountNumber: '1234567890',
  bankCode: 'SWIFT_CODE',
  bankName: 'Bank Name',
  country: 'US',
  currency: 'USD'
});

// Get beneficiaries
const beneficiaries = await wallexService.getBeneficiaries();
```

## Redux Integration

### State Management

The Wallex integration includes a dedicated Redux slice:

```typescript
// Dispatch actions
dispatch(fetchWallexBalances());
dispatch(createWallexPayment(paymentData));
dispatch(createWallexConversionQuote(quoteData));

// Access state
const { balances, loading, error } = useSelector(state => state.wallex);
```

### Available Actions

- `fetchWallexBalances()` - Fetch all balances
- `createWallexConversionQuote()` - Create conversion quote
- `executeWallexConversion()` - Execute conversion
- `createWallexPayment()` - Create payment
- `fetchWallexBeneficiaries()` - Fetch beneficiaries
- `createWallexBeneficiary()` - Create beneficiary
- `fetchWallexCollectionAccounts()` - Fetch collection accounts
- `fetchWallexTransactions()` - Fetch transactions
- `checkWallexProviderStatus()` - Check provider health

## Error Handling

### Fallback Strategy

The integration includes a fallback strategy:

1. **Primary**: Try Wallex API first
2. **Fallback**: Use existing PayStreet API if Wallex fails
3. **Error Handling**: Comprehensive error logging and user feedback

### Error Types

- **Authentication Errors** - Invalid credentials
- **Network Errors** - Connection issues
- **API Errors** - Wallex API specific errors
- **Validation Errors** - Invalid request data

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

## Monitoring and Logging

### Provider Status

```typescript
// Check provider health
const status = await wallexService.getProviderStatus();
console.log('Wallex Status:', status.WALLEX);
```

### Error Logging

All errors are logged to the console with detailed information:
- API endpoint
- Request parameters
- Error response
- Timestamp

## Future Enhancements (Phase 2)

### Additional Providers

The architecture supports adding new providers:

1. **CurrencyCloud** - Multi-currency accounts
2. **Airwallex** - Global payments
3. **Wise** - International transfers
4. **WorldFirst** - Currency exchange

### Advanced Features

- **Routing Rules** - Route transactions based on currency/corridor
- **Load Balancing** - Distribute load across providers
- **Circuit Breaker** - Automatic failover
- **Rate Limiting** - API rate limit management

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check API credentials
   - Verify environment variables
   - Ensure correct API endpoint

2. **Network Errors**
   - Check internet connection
   - Verify API endpoint accessibility
   - Check firewall settings

3. **Data Mapping Issues**
   - Verify data format compatibility
   - Check field mappings
   - Validate required fields

### Debug Mode

Enable debug logging by setting:

```env
REACT_APP_DEBUG=true
```

## Support

For technical support:

1. **Wallex API Issues** - Contact Wallex support
2. **Integration Issues** - Check this documentation
3. **Code Issues** - Review error logs and console output

## Security Considerations

1. **API Keys** - Store securely, never commit to version control
2. **HTTPS** - All API calls use HTTPS
3. **Token Management** - Automatic token refresh
4. **Data Validation** - Input validation and sanitization
5. **Error Handling** - No sensitive data in error messages

## Performance Optimization

1. **Caching** - Balance and rate caching
2. **Batch Operations** - Bulk API calls where possible
3. **Lazy Loading** - Load data on demand
4. **Connection Pooling** - Reuse HTTP connections

## Conclusion

The Wallex integration provides a robust, scalable solution for multi-currency financial operations. The modular architecture ensures easy maintenance and future enhancements while maintaining backward compatibility with existing systems.
