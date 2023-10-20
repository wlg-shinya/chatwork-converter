<script setup lang="ts">
import { ref } from "vue"
import axios from "axios"

const FORMAT = new Map()
FORMAT.set("confluence", "ConfluenceWiki")

const messageURL = ref("")
const targetMessageCount = ref(5)
const outputText = ref("")
const formatKey = ref("confluence")

function formatLink(link: string, text = "") {
  switch (formatKey.value) {
    case "confluence":
      return text ? `[${text}|${link}]` : `[${link}]`
    default:
      return link
  }
}

function formatBold(text: string) {
  switch (formatKey.value) {
    case "confluence":
      return `*${text}*`
    default:
      return text
  }
}

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
      // メッセージを出力用に整形
      outputText.value = "----\n"
      targetMessages.forEach((x: any) => {
        const name = x.account.name
        const message = x.body
        const time = new Date(x.send_time * 1000) // send_time は秒なのでミリ秒に変換
          .toLocaleString("ja-JP") // 日付時刻情報を日本向けに変換
        const originalUrl = url.replace(/[0-9]+$/, x.message_id)

        outputText.value += `
${formatBold(name)} ${time} ${formatLink(originalUrl, '投稿元')}
${message}
----
`
      })
      outputText.value += `この文章は ${formatLink(process.env.VUE_APP_BASE_URL, document.title)} によって生成されました`
    })
    .catch((err: any) => {
      throw err
    })
}
</script>

<template>
  <div>
    <input v-model="messageURL" />
    <input v-model="targetMessageCount" type="number" />
    <select v-model="formatKey">
      <option v-for="[key, value] in FORMAT" :key="key" :value="key">{{ value }}</option>
    </select>
    <button @click="test()">test</button>
    <pre style="text-align: left">{{ outputText }}</pre>
  </div>
</template>
