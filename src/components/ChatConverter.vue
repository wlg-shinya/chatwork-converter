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
  const count = 5

  axios
    .get("/api/chatwork_get_messages", {
      params: {
        room_id: roomId,
      },
    })
    .then((response) => {
      const data = JSON.parse(JSON.stringify(response.data))
      let startIndex = -1
      // 指定メッセージがどこにあるか特定する
      data.some((x: any, i: number) => {
        if (x.message_id == messageId) {
          startIndex = i
          return true
        } else {
          return false
        }
      })
      // 指定メッセージから指定数分のメッセージを収集
      const endIndex = startIndex + count < data.length ? startIndex + count : data.length
      const targetMessage = data.slice(startIndex, endIndex)
      console.log(targetMessage)
    })
    .catch((err: any) => {
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