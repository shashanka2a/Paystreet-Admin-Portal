import { BaseProvider, ProviderConfig } from './BaseProvider' 
import { WallexAdapter } from './WallexAdapter' 

/**
 * Provider Manager
 * Manages multiple financial service providers and routes requests to appropriate providers
 */
export class ProviderManager {
  private providers: Map<string, BaseProvider> = new Map() 
  private activeProvider = 'WALLEX' // Default to Wallex for Phase 1

  constructor() {
    this.initializeProviders() 
  }

  private initializeProviders(): void {
    // Initialize Wallex provider
    const wallexConfig: ProviderConfig = {
      apiKey: process.env.REACT_APP_WALLEX_API_KEY || '',
      accessKeyId: process.env.REACT_APP_WALLEX_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.REACT_APP_WALLEX_SECRET_ACCESS_KEY || '',
      baseURL: process.env.REACT_APP_WALLEX_BASE_URL || 'https://api.wallex.asia',
      environment: (process.env.REACT_APP_WALLEX_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox'
    } 

    if (wallexConfig.apiKey && wallexConfig.accessKeyId && wallexConfig.secretAccessKey) {
      this.providers.set('WALLEX', new WallexAdapter(wallexConfig)) 
    }

    // Future providers can be added here
    // this.providers.set('CURRENCYCLOUD', new CurrencyCloudAdapter(currencyCloudConfig)) 
    // this.providers.set('AIRWALLEX', new AirwallexAdapter(airwallexConfig)) 
  }

  /**
   * Get the active provider instance
   */
  getActiveProvider(): BaseProvider {
    const provider = this.providers.get(this.activeProvider) 
    if (!provider) {
      throw new Error(`Active provider '${this.activeProvider}' not found`) 
    }
    return provider 
  }

  /**
   * Get a specific provider by name
   */
  getProvider(name: string): BaseProvider {
    const provider = this.providers.get(name.toUpperCase()) 
    if (!provider) {
      throw new Error(`Provider '${name}' not found`) 
    }
    return provider 
  }

  /**
   * Set the active provider
   */
  setActiveProvider(name: string): void {
    if (!this.providers.has(name.toUpperCase())) {
      throw new Error(`Provider '${name}' not available`) 
    }
    this.activeProvider = name.toUpperCase() 
  }

  /**
   * Get list of available providers
   */
  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys()) 
  }

  /**
   * Check if a provider is available
   */
  isProviderAvailable(name: string): boolean {
    return this.providers.has(name.toUpperCase()) 
  }

  /**
   * Route request to appropriate provider based on currency/corridor
   */
  routeByCurrency(currency: string): BaseProvider {
    // For Phase 1, always use Wallex
    // Future implementation can include routing logic based on currency corridors
    return this.getActiveProvider() 
  }

  /**
   * Route request to appropriate provider based on transaction type
   */
  routeByTransactionType(type: 'PAYMENT' | 'CONVERSION' | 'COLLECTION'): BaseProvider {
    // For Phase 1, always use Wallex
    // Future implementation can include routing logic based on transaction type
    return this.getActiveProvider() 
  }

  /**
   * Get provider status and health
   */
  async getProviderStatus(name?: string): Promise<{ [key: string]: boolean }> {
    const providersToCheck = name ? [name.toUpperCase()] : Array.from(this.providers.keys()) 
    const status: { [key: string]: boolean } = {} 

    for (const providerName of providersToCheck) {
      try {
        const provider = this.providers.get(providerName) 
        if (provider) {
          // Try to authenticate to check if provider is healthy
          await provider.authenticate() 
          status[providerName] = true 
        } else {
          status[providerName] = false 
        }
      } catch (error) {
        console.error(`Provider ${providerName} health check failed:`, error) 
        status[providerName] = false 
      }
    }

    return status 
  }
}

// Singleton instance
export const providerManager = new ProviderManager() 
