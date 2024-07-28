export class API {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl
  }

  async fetchJSON(query, options = {}) {
    options.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }

    try {
      const result = await fetch(this.baseUrl + query, options)
      return await result.json()
    } catch (error) {
      console.log(error)
    }
  }
}
