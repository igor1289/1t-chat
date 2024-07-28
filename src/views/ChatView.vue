<template>
  <div class="parent">
    <div class="header">
      <span class="is-size-4"
        >{{ currentRoomName }}
        <button class="button ml-1" @click="joinRoom(currentRoomId)" v-if="notJoined">
          Присоединиться
        </button>
      </span>
    </div>
    <div class="rooms">
      <div class="rooms-header p-2">
        <input
          class="input"
          type="text"
          name="roomSearch"
          placeholder="Поиск комнат"
          autocomplete="off"
          v-model="roomSearch"
          @change="searchRooms"
        />
        <button class="button ml-1" @click="openNewRoomDialog">+</button>
      </div>
      <div class="rooms-list hidden-scroll">
        <div class="room p-2" v-for="room in roomsList" :key="room.id" @click="openRoom(room)">
          <div class="has-text-weight-bold is-size-6">{{ room.alias || room.name }}</div>
          <div class="is-size-7"><b>Онлайн:</b> {{ getRoomOnlineStatus(room.id) }}</div>
          <div class="is-size-7 is-italic latest-message" v-if="room.latestMessage">
            <b>{{ room.latestMessageAuthor }}:</b> {{ room.latestMessage }}
          </div>
        </div>
      </div>
      <div class="rooms-footer is-size-7">
        Комнат: {{ roomsList.length }} / Онлайн: {{ usersOnline }}
      </div>
    </div>
    <div class="chat">
      <div v-for="message in messages" :key="message.id">
        <div
          v-if="message.User.id && message.User.id != userStore.getId()"
          class="is-flex is-justify-content-start"
        >
          <div class="chat-message card m-2 p-2 has-background-primary-light">
            <div @click="joinPrivate(message.User.id)">
              <b>{{ message.User.name }}</b>
            </div>
            <div>{{ message.text }}</div>
          </div>
        </div>

        <div
          v-else-if="message.User.id && message.User.id == userStore.getId()"
          class="is-flex is-justify-content-end"
        >
          <div class="chat-message card m-2 p-2 has-background-info-light">
            <div>
              <b>{{ message.User.name }}</b>
            </div>
            <div>
              {{ message.text }}
            </div>
          </div>
        </div>

        <div v-else class="is-flex is-justify-content-center">
          <div class="chat-message m-2 p-2">
            <div>
              <b>{{ message.text }}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="message-input p-1 is-flex is-align-items-start">
      <input
        class="input m-1"
        type="text"
        name="message"
        placeholder="Текст сообщения"
        v-model="newMessage"
        autocomplete="off"
      />
      <button class="button m-1" @click="sendMessage">Отправить</button>
    </div>
  </div>

  <div class="modal" :class="{ 'is-active': newRoomDialogActive }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Создать новую комнату</p>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Имя комнаты</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Введите имя новой комнаты"
              v-model="newRoomName"
            />
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button" @click="createNewRoom">Создать</button>
          <button class="button" @click="closeNewRoomDialog">Отмена</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { io } from 'socket.io-client'

import { onMounted, onUpdated, ref, watchPostEffect } from 'vue'
import Rooms from '@/api/rooms'
import Messages from '@/api/messages'
import { useUserStore } from '@/stores/user'

const { VITE_HOST, VITE_SOCKET_PORT } = import.meta.env

const userStore = useUserStore()

const socket = io(`${VITE_HOST}:${VITE_SOCKET_PORT}`, {
  auth: {
    token: userStore.getAccessToken()
  }
})

socket.on('message', (messageData) => {
  if (messageData.RoomId == currentRoomId.value) {
    messages.value.push(messageData)
  }

  const room = roomsList.value.find((currentRoom) => currentRoom.id == messageData.RoomId)

  if (room) {
    room.latestMessageAuthor = messageData.User.name
    room.latestMessage = messageData.text
  }

  scrollDownChat()
})

socket.on('private', async (room) => {
  console.log(room)
  userRoomsList.value = await Rooms.userRooms(userStore.getId())
  roomsList.value = userRoomsList.value.slice()
  joinRooms()
})

socket.on('onlineStatusChanged', async (eventData) => {
  console.log(eventData)
  roomOnlineStatus.value.set(eventData.roomId, eventData.count)
  usersOnline.value = eventData.total
})

//Прочие функции
function scrollDownChat() {
  const chat = document.querySelector('.chat')

  chat.scrollTop = chat.scrollHeight
}

//Комнаты
const currentRoomId = ref(0)
const currentRoomName = ref('')
const notJoined = ref(false)
const roomsList = ref([])
const userRoomsList = ref([])

const roomOnlineStatus = ref(new Map())
const usersOnline = ref(0)

const roomSearch = ref('')

const newRoomDialogActive = ref(false)
const newRoomName = ref('')

function openNewRoomDialog() {
  newRoomDialogActive.value = true
}

function closeNewRoomDialog() {
  newRoomName.value = ''
  newRoomDialogActive.value = false
}

async function createNewRoom() {
  await Rooms.create(newRoomName.value)
  roomsList.value = await Rooms.list()
  closeNewRoomDialog()
}

function joinRooms() {
  const rooms = []

  roomsList.value.forEach((room) => {
    rooms.push(room.id)
  })

  socket.emit('join', rooms)
}

async function openRoom(room) {
  currentRoomId.value = room.id
  currentRoomName.value = room.name

  notJoined.value = !userRoomsList.value.find((room) => room.id == currentRoomId.value)

  messages.value = await Messages.history(room.id)
}

async function searchRooms() {
  if (roomSearch.value.length > 0) roomsList.value = await Rooms.search(roomSearch.value)
  else roomsList.value = userRoomsList.value.slice()
}

async function joinRoom(roomId) {
  await Rooms.join(userStore.getId(), roomId)
  userRoomsList.value = await Rooms.userRooms(userStore.getId())
  notJoined.value = false
  joinRooms()
}

async function joinPrivate(userId) {
  const privateRoom = await Rooms.joinPrivate(userStore.getId(), userId)
  userRoomsList.value = await Rooms.userRooms(userStore.getId())

  console.log(userRoomsList.value)
  roomsList.value = userRoomsList.value.slice()
  joinRooms()
  openRoom(privateRoom)
}

function getRoomOnlineStatus(roomId) {
  return roomOnlineStatus.value.get(roomId)
}

function currentlyOnline() {}

//Сообщения
const messages = ref([])

const newMessage = ref('')

function sendMessage() {
  socket.emit('message', {
    userId: userStore.getId(),
    userName: userStore.getName(),
    roomId: currentRoomId.value,
    text: newMessage.value
  })

  newMessage.value = ''
}

//Настройка компонента
onMounted(async () => {
  userRoomsList.value = await Rooms.userRooms(userStore.getId())
  roomsList.value = userRoomsList.value.slice()

  if (userRoomsList.value.length) {
    joinRooms()
    openRoom(userRoomsList.value[0])
  }
})

watchPostEffect(() => {
  const messagesCount = messages.value.length

  if (messagesCount) {
    scrollDownChat()
  }
})
</script>

<style>
.parent {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: grid;
  grid-template-areas:
    'header header'
    'rooms chat'
    'rooms message-input';

  grid-template-rows: 70px 1fr 115px;
  grid-template-columns: 200px 1fr;

  border: 1px solid lightgray;
}

.header {
  grid-area: header;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 4px -4px lightgray;
}

.rooms {
  grid-area: rooms;
  display: grid;
  grid-template-areas:
    'rooms-header'
    'rooms-list'
    'rooms-footer';

  grid-template-rows: 75px 1fr 25px;
  border-right: 1px solid lightgray;
}

.latest-message {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.rooms-header {
  grid-area: rooms-header;
  border-bottom: 1px solid lightgray;
  display: flex;
  align-items: center;
  /* justify-content: center; */
}

.rooms-list {
  grid-area: rooms-list;
}

.rooms-footer {
  grid-area: rooms-footer;
  border-top: 1px solid lightgray;
  display: flex;
  justify-content: center;
}

.room {
  border-bottom: 1px solid lightgray;
}

.chat {
  grid-area: chat;
  border-bottom: 1px solid lightgray;
  overflow-y: scroll;
}

.hidden-scroll {
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
  overflow-y: scroll;
}
.hidden-scroll::-webkit-scrollbar {
  display: none; /* for Chrome, Safari, and Opera */
}

.chat-message {
  max-width: 50%;
}

.message-input {
  grid-area: message-input;
  width: 100%;
  height: 100%;
}

.message-text {
  resize: none;
}
</style>
