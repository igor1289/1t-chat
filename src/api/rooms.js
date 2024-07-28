import { API } from './api'

class RoomAPI extends API {
  constructor() {
    super('http://localhost:9000/room')
  }

  async create(name) {
    return await this.fetchJSON('/create', {
      method: 'POST',
      body: JSON.stringify({ name })
    })
  }

  async list() {
    return await this.fetchJSON('/list')
  }

  async userRooms(userId) {
    return await this.fetchJSON('/user', {
      method: 'POST',
      body: JSON.stringify({ userId: userId })
    })
  }

  async search(name) {
    return await this.fetchJSON('/search', {
      method: 'POST',
      body: JSON.stringify({ name: name })
    })
  }

  async join(userId, roomId) {
    return await this.fetchJSON('/join', {
      method: 'POST',
      body: JSON.stringify({ userId, roomId })
    })
  }

  async joinPrivate(userId1, userId2) {
    return await this.fetchJSON('/private', {
      method: 'POST',
      body: JSON.stringify({ userId1, userId2 })
    })
  }
}

export default new RoomAPI()
