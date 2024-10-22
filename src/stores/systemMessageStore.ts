import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSystemMessageStore = defineStore('message', () => {
  const message = ref('')

  const setMessage = (msg: string) => {
    message.value = msg
  }

  const clearMessage = () => {
    message.value = ''
  }

  return { message, setMessage, clearMessage }
})
