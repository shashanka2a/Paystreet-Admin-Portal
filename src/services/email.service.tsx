import { _Object } from 'utils/types'
import PaystreetService from './paystreet.service'

class EmailService extends PaystreetService {
  // general support
  async sendGeneralSupportRequest(params: _Object) {
    const formData = new FormData()
    // Append form data fields
    formData.append('message', params.message)
    if (params?.file) {
      formData.append('file', params?.file[0])
    }

    return await this.post('generalSupport', formData)
  }

  // report bug
  async sendReportBugRequest(params: _Object) {
    const formData = new FormData()
    // Append form data fields

    formData.append('deviceType', params.deviceType)
    formData.append('viewedError', params.viewedError)
    formData.append('triedOnBothDevices', params.triedOnBothDevices)
    formData.append('errorDescription', params.errorDescription)
    if (params?.file) {
      formData.append('file', params.file[0])
    }
    return await this.post('reportBug', formData)
  }

  // suggestion share
  async sendSugShareRequest(params: _Object) {
    return await this.post('shareSuggestions', params)
  }
  async uboUploadDetails(params: _Object, companyName?: any, companyDescription?: any, companyUsage?: any, type?: any, selectNumber?:any) {
    const formData = new FormData()
    params.forEach((item: any) => {
      item['multi-files[]'].forEach((element:any) => {
        formData.append('multi-files[]', element)
      })
      formData.append('filesName', item['filesName'])
      formData.append('fullName', item.fullName)
      formData.append('residentType', item.residentType)
      formData.append('nationality', item.nationality)
      formData.append('issueDate', item.issueDate)
      formData.append('expiryDate', item.expiryDate)
      if (item['address_proof']) {
        // formData.append('address_proof', item['address_proof'])
        item['address_proof'].forEach((element:any) => {
          formData.append('multi-files[]', element)
          // formData.append('multi-files[]', item['address_proof'])
        })
      }
      formData.append('identificationType', item.identificationType)
      formData.append('identificationNumber', item.identificationNumber)
      // formData.append('test', item)
    })
    formData.append('type', type)
    formData.append('companyName', companyName)
    formData.append('companyDescription', companyDescription)
    formData.append('companyUsage', companyUsage)
    formData.append('selectNumber',selectNumber)
    return await this.post('ubo-multiple-upload', formData)
  }
}

export const emailservice = new EmailService()
