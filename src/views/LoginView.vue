<template>
  <div
    class="parent is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
  >
    <div class="login-form box p-4">
      <div class="is-flex is-justify-content-center"><div class="is-size-4">Вход</div></div>
      <div class="field">
        <label class="label">Имя</label>
        <div class="control">
          <input class="input" type="text" placeholder="Введите ваше имя" v-model="name" />
        </div>
      </div>
      <div class="field">
        <label class="label">Пароль</label>
        <div class="control">
          <input class="input" type="password" placeholder="Введите пароль" v-model="password" />
        </div>
      </div>
      <div class="is-flex is-flex-direction-column is-align-items-center">
        <button class="button is-link" @click="login">Войти</button>
        <RouterLink class="is-size-7 mt-2" to="/register">Зарегистрироваться</RouterLink>
      </div>
    </div>
    <div class="p-2 has-text-danger" v-if="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const name = ref('')
const password = ref('')
const error = ref('')

const userStore = useUserStore()
const router = useRouter()

async function login() {
  const result = await userStore.login(name.value, password.value)

  if (!result.isApiError) {
    router.push('/')
  } else {
    error.value = result.message
  }
}
</script>

<style>
.parent {
  width: 100%;
  height: 100%;
}

.login-form {
  width: 300px;
  height: 300px;
}
</style>
