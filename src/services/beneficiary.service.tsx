import { FormBeneficiaryProps, _Object } from 'utils/types'
import CommonService from './common.service'
import { wallexService } from './wallex.service'

class BeneficiaryService extends CommonService {
  async fetchBeneficiaries(filter?:_Object) {
    try {
      // Try Wallex first, fallback to existing API
      const isWallexAvailable = await wallexService.isWallexAvailable() 
      if (isWallexAvailable) {
        const beneficiaries = await wallexService.getBeneficiaries() 
        return {
          code: 200,
          result: {
            data: beneficiaries.map(beneficiary => ({
              id: beneficiary.id,
              firstname: beneficiary.name.split(' ')[0] || '',
              lastname: beneficiary.name.split(' ').slice(1).join(' ') || '',
              companyName: beneficiary.name,
              bankName: beneficiary.bankName,
              bankAccountNumber: beneficiary.accountNumber,
              currency: { alphabeticCode: beneficiary.currency },
              countryCommonName: beneficiary.country,
              email: beneficiary.email,
              phone: beneficiary.phone,
              bankCode: beneficiary.bankCode
            }))
          }
        } 
      }
    } catch (error) {
      console.warn('Wallex service unavailable, falling back to existing API:', error) 
    }
    
    // Fallback to existing API
    const params = filter ? filter : {'limit': 100}
    return await this.post('beneficiary/me/list', params)
  }

  async fetchBeneficiaryById(params: string) {
    return await this.get(`beneficiary/${params}`)
  }

  async fetchBeneficiary(params: string) {
    return await this.post(`beneficiary/${params}`)
  }

  async createBeneficiary(params: FormBeneficiaryProps) {
    try {
      // Try Wallex first, fallback to existing API
      const isWallexAvailable = await wallexService.isWallexAvailable() 
      if (isWallexAvailable) {
        const beneficiary = await wallexService.createBeneficiary({
          name: params.fullName || `${params.firstname} ${params.lastname}`,
          accountNumber: params.bankAccountNumber || '',
          bankCode: params.additionalCode?.swift || '',
          bankName: params.bankName || '',
          country: params.countryCode || '',
          currency: params.currencyCode || '',
          email: params.email,
          phone: params.mobileNumber || ''
        }) 
        return {
          code: 200,
          result: {
            data: {
              id: beneficiary.id,
              firstname: beneficiary.name.split(' ')[0] || '',
              lastname: beneficiary.name.split(' ').slice(1).join(' ') || '',
              companyName: beneficiary.name,
              bankName: beneficiary.bankName,
              bankAccountNumber: beneficiary.accountNumber,
              currency: { alphabeticCode: beneficiary.currency },
              countryCommonName: beneficiary.country,
              email: beneficiary.email,
              phone: beneficiary.phone,
              bankCode: beneficiary.bankCode
            }
          }
        } 
      }
    } catch (error) {
      console.warn('Wallex service unavailable, falling back to existing API:', error) 
    }
    
    // Fallback to existing API
    return await this.post('beneficiary/create', params)
  }

  async updateBeneficiary(params: FormBeneficiaryProps) {
    return await this.post('beneficiary/update', params)
  }

  async deleteBeneficiary(params: { [key: string]: string | boolean }) {
    return await this.post('beneficiary/change-status', params)
  }

  async listRelationship(params: string) {
    return await this.post('helper/list-relationship', {
      'senderType': 'BUSINESS',
      'beneficiaryType': params
    })
  }

  async sendBeneficiaryOTP(params: { purpose: string }) {
    return await this.post('mfa/send-otp', params)
  }
  async fetchBeneficiaryRequirements(params: _Object) {
    return await this.post('beneficiary/requirement', params)
  }
  async getPurposeCode() {
    return await this.get('payment/purpose-code')
  }
}

export const beneficiaryService = new BeneficiaryService()