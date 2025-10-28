import { _Object } from 'utils/types'
import CommonService from './common.service'

class FileService extends CommonService {
  async uplodeFile(params: _Object) {
    const formData = new FormData()
    // formData.append('upload', params[0])
    console.log('params', params.length)
    if(params.length > 1){
     for (let i = 0; i < params.length; i++) {
        formData.append('upload', params[i])
      }
    }else if(params.length == 1){
      formData.append('upload', params[0])
    }
    return await this.post('file-manager/upload', formData)
  }

  async setMyUserDocument(params: _Object) {
    return await this.post('account/set-my-user-document', params)
  }

  async deleteMyUserDocument(params: _Object) {
    return await this.post('account/delete-my-user-document', params)
  }

  async fetchMyUserDocument(params: string) {
    return await this.get('account/get-my-user-document' + params)
  }

  async getMyUploadDoc() {
    return await this.get('file-manager/get-my-upload')
  }

  async setMyCompanyDocument(params: _Object) {
    return await this.post('account/set-my-company-document', params)
  }
  async deleteMyCompanyDocument(params: _Object) {
    return await this.post('account/delete-my-company-document', params)
  }

  async fetchMyCompanyDocument(params: string) {
    return await this.get('account/get-my-company-document' + params)
  }

  async memoSetFunction(params:any, id:string){
    return await this.post(`payment/additional-info/${id}`, params)
  }

  async fetchFiles() {
    return await this.post('file-manager/get-my-upload')
  }
}

export const fileService = new FileService()
