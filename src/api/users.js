import { API } from './api'

class UserAPI extends API {
  constructor() {
    super('http://localhost:9000')
  }

  async logIn(name, password) {
    return await this.fetchJSON('/user/login', {
      method: 'POST',
      body: JSON.stringify({ name, password })
    })
  }

  async register(name, password) {
    return await this.fetchJSON('/user/register', {
      method: 'POST',
      body: JSON.stringify({ name, password })
    })
  }
}

export default new UserAPI()
