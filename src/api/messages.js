import { API } from './api'

class MessagesAPI extends API {
  constructor() {
    super('http://localhost:9000/messages')
  }

  async history(roomId) {
    return await this.fetchJSON(`/history/${roomId}`)
  }
}

export default new MessagesAPI()
