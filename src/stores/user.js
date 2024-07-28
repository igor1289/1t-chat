import { defineStore } from 'pinia'
import Users from '../api/users'

export const useUserStore = defineStore('user', {
  state() {
    return {
      user: undefined
    }
  },
  getters: {
    loggedIn(state) {
      return state.user != undefined
    },
    userId(state) {
      return state.user?.id
    },
    userName(state) {
      return state.user != undefined ? state.user.fullName : ''
    },
    accessToken(state) {
      return state.user?.accessToken
    }
  },
  actions: {
    async login(name, password) {
      const result = await Users.logIn(name, password)

      if (!result.isApiError) this.user = result

      return result
    },

    isLoggedIn() {
      return this.user != undefined
    },

    getId() {
      return this.user?.id
    },
    getName() {
      return this.user?.name
    },

    getAccessToken() {
      return this.user?.accessToken
    }
  }
})
