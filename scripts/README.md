# Wallex Data Fetcher Scripts

This directory contains scripts to fetch data from the Wallex API and store it in JSON files for analysis, backup, and integration purposes.

## Overview

The Wallex Data Fetcher provides a comprehensive way to:
- Authenticate with the Wallex API using environment variables
- Fetch all available data types (balances, transactions, beneficiaries, collection accounts)
- Store data in organized JSON files
- Generate summary reports with statistics
- Handle errors gracefully with fallback mechanisms

## Files

- `fetch-wallex-data.ts` - TypeScript version (recommended)
- `fetch-wallex-data.js` - JavaScript version
- `README.md` - This documentation

## Prerequisites

1. **Wallex API Credentials**: Contact Wallex at `contact@wallextech.com` to get:
   - X-Api-Key
   - AccessKeyId  
   - SecretAccessKey

2. **Environment Setup**: Create a `.env` file in the project root with:
   ```env
   NEXT_PUBLIC_WALLEX_API_KEY=your_wallex_api_key_here
   NEXT_PUBLIC_WALLEX_ACCESS_KEY_ID=your_wallex_access_key_id_here
   NEXT_PUBLIC_WALLEX_SECRET_ACCESS_KEY=your_wallex_secret_access_key_here
   NEXT_PUBLIC_WALLEX_BASE_URL=https://api.wallex.asia
   NEXT_PUBLIC_WALLEX_ENVIRONMENT=sandbox
   ```

3. **Dependencies**: Install required packages:
   ```bash
   npm install dotenv tsx
   ```

## Usage

### Quick Start

```bash
# Using npm script (recommended)
npm run fetch-wallex-data

# Or run directly with tsx
npx tsx scripts/fetch-wallex-data.ts

# Or using JavaScript version
npm run fetch-wallex-data:js
```

### Manual Execution

```bash
# TypeScript version
npx tsx scripts/fetch-wallex-data.ts

# JavaScript version  
node scripts/fetch-wallex-data.js
```

## Output Files

The script creates a `data/` directory with the following files:

### Individual Data Files
- `wallex-balances.json` - Account balances by currency
- `wallex-transactions.json` - Transaction history
- `wallex-beneficiaries.json` - Beneficiary information
- `wallex-collection-accounts.json` - Collection account details

### Summary File
- `wallex-summary.json` - Comprehensive summary with:
  - Fetch timestamp and environment info
  - Data counts for each type
  - Balance summary by currency
  - Transaction statistics (status, type, currency counts)
  - Recent transactions (last 10)

## Data Structure

### Balances
```json
{
  "currency": "USD",
  "available": 10000.50,
  "frozen": 500.00,
  "total": 10500.50,
  "lastUpdated": "2025-01-27T10:30:00Z"
}
```

### Transactions
```json
{
  "id": "tx_123456",
  "type": "payment",
  "amount": 1000.00,
  "currency": "USD",
  "status": "completed",
  "timestamp": "2025-01-27T10:30:00Z",
  "description": "Business payment",
  "reference": "REF123456",
  "fees": 5.00,
  "beneficiaryId": "ben_789",
  "purpose": "Invoice payment"
}
```

### Beneficiaries
```json
{
  "id": "ben_789",
  "name": "Acme Corporation",
  "email": "payments@acme.com",
  "phone": "+1234567890",
  "bankAccount": {
    "accountNumber": "1234567890",
    "bankName": "Chase Bank",
    "bankCode": "CHASUS33",
    "country": "US",
    "currency": "USD"
  },
  "status": "active",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

## Features

### Authentication
- Automatic token management with refresh
- Secure credential handling via environment variables
- Token expiry handling with buffer time

### Error Handling
- Graceful fallback for failed API calls
- Detailed error logging
- Non-blocking execution (continues on partial failures)

### Data Processing
- Parallel data fetching for performance
- Comprehensive summary generation
- Organized file structure
- JSON formatting with proper indentation

### Monitoring
- Real-time progress indicators
- Success/failure status reporting
- Data count summaries
- Execution time tracking

## Configuration Options

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_WALLEX_API_KEY` | Wallex API key | Required |
| `NEXT_PUBLIC_WALLEX_ACCESS_KEY_ID` | Access key ID | Required |
| `NEXT_PUBLIC_WALLEX_SECRET_ACCESS_KEY` | Secret access key | Required |
| `NEXT_PUBLIC_WALLEX_BASE_URL` | API base URL | `https://api.wallex.asia` |
| `NEXT_PUBLIC_WALLEX_ENVIRONMENT` | Environment (sandbox/production) | `sandbox` |
| `NEXT_PUBLIC_DEBUG` | Enable debug logging | `false` |

### Script Parameters

The script accepts optional parameters for transaction fetching:
- `limit`: Maximum number of transactions to fetch (default: 1000)
- `startDate`: Start date for transaction filtering
- `endDate`: End date for transaction filtering
- `status`: Filter by transaction status
- `currency`: Filter by currency

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify API credentials in `.env` file
   - Check if credentials are for the correct environment (sandbox vs production)
   - Ensure network connectivity to Wallex API

2. **Missing Environment Variables**
   - Ensure `.env` file exists in project root
   - Check that all required variables are set
   - Verify variable names match exactly

3. **API Rate Limits**
   - Wallex may have rate limits on API calls
   - Script includes automatic retry logic
   - Consider reducing transaction limit if needed

4. **Data Directory Issues**
   - Script automatically creates `data/` directory
   - Ensure write permissions in project directory
   - Check available disk space

### Debug Mode

Enable debug logging by setting:
```env
NEXT_PUBLIC_DEBUG=true
```

This will provide detailed information about:
- API requests and responses
- Authentication process
- Error details
- Data processing steps

## Integration

### Using in Other Scripts

```typescript
import { WallexDataFetcher } from './scripts/fetch-wallex-data';

const fetcher = new WallexDataFetcher(WALLEX_CONFIG);
const balances = await fetcher.fetchBalances();
const transactions = await fetcher.fetchTransactions({ limit: 100 });
```

### Scheduled Execution

Set up automated data fetching with cron jobs:

```bash
# Fetch data every hour
0 * * * * cd /path/to/project && npm run fetch-wallex-data

# Fetch data daily at 2 AM
0 2 * * * cd /path/to/project && npm run fetch-wallex-data
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **API Credentials**: Store securely and rotate regularly
3. **Data Storage**: Consider encrypting sensitive data files
4. **Access Control**: Restrict access to data directory
5. **Network Security**: Use HTTPS for all API communications

## Support

For issues related to:
- **Wallex API**: Contact Wallex support at `contact@wallextech.com`
- **Script Issues**: Check console output and error messages
- **Integration**: Review the Wallex Integration Guide

## Future Enhancements

Planned improvements:
- WebSocket support for real-time data
- Data compression and archiving
- Custom data filtering options
- Export to different formats (CSV, Excel)
- Data validation and integrity checks
- Automated backup scheduling
