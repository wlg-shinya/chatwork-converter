<script setup lang="ts">
import { ref } from "vue"
import axios from "axios"

const messageURL = ref("")
const targetMessageCount = ref(5)

function test() {
  const url = messageURL.value
  if (!url) return

  const match = url.match(/.*rid([0-9]+)-([0-9]+)/)
  if (!match) return

  const roomId = match[1]
  const messageId = match[2]
  const count = targetMessageCount.value

  axios
    .get("/api/chatwork_get_messages", {
      params: {
        room_id: roomId,
      },
    })
    .then((response) => {
      const data = JSON.parse(JSON.stringify(response.data))
      // 削除済みメッセージを除外
      const messages = data.filter((x: any) => x.body != "[deleted]")
      // 指定メッセージがどこにあるか特定する
      let startIndex = -1
      messages.some((x: any, i: number) => {
        if (x.message_id == messageId) {
          startIndex = i
          return true
        } else {
          return false
        }
      })
      // 指定メッセージから指定数分のメッセージを収集
      const endIndex = startIndex + count < messages.length ? startIndex + count : messages.length
      const targetMessages = messages.slice(startIndex, endIndex)
      console.log(targetMessages)
    })
    .catch((err: any) => {
      throw err
    })
}
</script>

<template>
  <div>
    <input v-model="messageURL" />
    <input v-model="targetMessageCount" type="number"/>
    <button @click="test()">test</button>
  </div>
</template>
