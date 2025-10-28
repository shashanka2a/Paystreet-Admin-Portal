import { _Object } from 'utils/types'
import PaystreetService from './paystreet.service'

class ExportService extends PaystreetService {
  async downoladStatment(params: _Object) {
    return await this.post('transactionPdfGeneration', params)
  }

  async allErrorHandle(params: _Object) {
    return await this.post('emailSend', params)
  }

  async payoutReceiptApi(params: _Object) {
    return await this.post('payoutReceipt', params)
  }

  async pdfDownload(params: _Object) {
    return await this.post('summaryExport', params)
  }

  async bankDetailsApi(params: _Object) {
    return await this.post('bankDetailsExport', params)
  }
  async fetchCollectionBalance(params: _Object) {
    return await this.post('currencyBalance', params)
  }
  async updateCurrencyStatusAndOrder(params: _Object) {
    return await this.post('UpdatecurrencyStatusandOrder', params)
  }
}

export const exportApi = new ExportService()
