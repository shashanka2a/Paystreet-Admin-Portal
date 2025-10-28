import { _Object } from 'utils/types'
import CommonService from './common.service'
import { wallexService } from './wallex.service'

class PaymentService extends CommonService {
  async fetchPayouts(params: { [key: string]: string | number | any }) {
    try {
      // Try Wallex first, fallback to existing API
      const isWallexAvailable = await wallexService.isWallexAvailable() 
      if (isWallexAvailable) {
        return await wallexService.getPayments(params) 
      }
    } catch (error) {
      console.warn('Wallex service unavailable, falling back to existing API:', error) 
    }
    
    // Fallback to existing API
    return await this.post('payment/me', params)
  }

  async getById(params: string | undefined) {
    return await this.get(`payment/detail/${params}`)
  }
  async fetchFundingMethods(params: { [key: string]: string }) {
    return await this.post('funding/list-funding-method', params)
  }

  async createFunding(params: { [key: string]: string | boolean }) {
    return await this.post('funding/create-funding-payment', params)
  }

  async availableChannel(params: { [key: string]: string }) {
    return await this.post('payment/available-channel', params)
  }

  async createQuote(params: _Object) {
    return await this.post('quotation/get-quote', params)
  }

  async sendMoneyOTP(params: { purpose: string }) {
    return await this.post('mfa/send-otp', params)
  }

  async createPayment(params: _Object) {
    try {
      // Try Wallex first, fallback to existing API
      const isWallexAvailable = await wallexService.isWallexAvailable() 
      if (isWallexAvailable) {
        const paymentRequest = {
          beneficiaryId: params.beneficiaryId,
          amount: params.amount,
          currency: params.currency,
          purpose: params.purpose,
          reference: params.reference,
          description: params.description
        } 
        return await wallexService.createPayment(paymentRequest) 
      }
    } catch (error) {
      console.warn('Wallex service unavailable, falling back to existing API:', error) 
    }
    
    // Fallback to existing API
    return await this.post('/payment/create', params)
  }

  async fetchPaymentDetails(params: string) {
    return await this.get(`payment/detail/${params}`)
  }

  async paymentFundingSource() {
    return await this.get('payment/funding-source')
  }

  async paymentPurpose() {
    return await this.get('payment/purpose-code')
  }

  async getPaymentInvoice(params: _Object) {
    return await this.post('payment/payment-invoice', params)
  }

  async addPaymentDocument(params: _Object) {
    return await this.post('payment/add-document', params)
  }

  async downloadMonthlyReport(params: _Object) {
    return await this.post('payment/get-monthly-report', params)
  }
  async fetchBalanceHistory(params: { [key: string]: string | number }) {
    return await this.post('balance/statement', params)
  }
  // async fetchBalanceHistory(params: { [key: string]: string | number }) {
  //   return await this.post('balance/history', params)
  // }

  async trackPayment(params: string) {
    return await this.get('payment/summary/' + params)
  }

  async getConversions(params: _Object) {
    return await this.post('conversion/find', params)
  }

  async getConversionById(params: string) {
    return await this.get(`conversion/item/${params}`)
  }

  async getSwiftMt103(params: string | undefined) {
    return await this.get(`payment/mt103/${params}`)
  }
}

export const paymentService = new PaymentService()
