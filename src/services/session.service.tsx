import { FormRegisterProps, _Object } from 'utils/types'
import CommonService from './common.service'

class SessionService extends CommonService {
  async login(params: { [key: string]: string }) {
    return await this.post('auth/login-username-password', params)
  }

  async me() {
    return await this.get('account/get-profile')
  }

  async resendVerificationEmail() {
    return await this.get('auth/re-verify-email')
  }

  async fetchNotifications(params: { [key: string]: number }) {
    return await this.post('notification/me/get-list-inbox', params)
  }

  async readNotifications(params: { [key: string]: number }) {
    return await this.post('notification/read-inbox', params)
  }

  async updateProfile(params: { [key: string]: string }) {
    return await this.post('account/update-profile', params)
  }

  async forgotPassword(params: { [key: string]: string }) {
    return await this.post('account/forgot-password', params)
  }

  async updatePassword(params: { [key: string]: string }) {
    return await this.post('account/change-password', params)
  }

  async register(params: FormRegisterProps) {
    return await this.post('account/register-company', params)
  }

  async adminSupport(params: _Object) {
    return await this.post('notification/admin-support', params)
  }

  async fetchEmploymentIndustry() {
    return await this.get('helper/list-employment-industry')
  }

  async requestUserApproval() {
    return await this.get('account/request-approval')
  }
}

export const sessionService = new SessionService()
