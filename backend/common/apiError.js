export class apiError {
  constructor(message, data) {
    this.isApiError = true
    this.message = message
    this.data = data
  }
}
