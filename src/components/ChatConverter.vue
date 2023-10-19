<script setup lang="ts">
import { ref } from "vue"
import axios from "axios"

const messageURL = ref("")

function test() {
  const url = messageURL.value
  if (!url) return

  const match = url.match(/.*rid([0-9]+)-([0-9]+)/)
  if (!match) return 

  const roomId = match[1]
  const messageId = match[2]

  axios
    .get("/api/chatwork_get_message", {
      params: {
        room_id: roomId,
        message_id: messageId
      },
    })
    .then((response) => {
      const data = JSON.parse(JSON.stringify(response.data))
      console.log(data)
    })
    .catch((err) => {
      throw err
    })
}
</script>

<template>
  <div>
    <input v-model="messageURL" />
    <button @click="test()">test</button>
  </div>
</template>