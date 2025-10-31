export class ErrorHandler {
  static handleApiError(error: any, fallbackMessage: string) {
    const status = error?.response?.status
    const data = error?.response?.data
    const message = typeof data === 'string' ? data : data?.message || error?.message || fallbackMessage
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('API Error:', { status, data, message })
    }
    return { status, message }
  }
}
