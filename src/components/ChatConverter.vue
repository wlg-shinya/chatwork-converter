<script setup lang="ts">
import { ref, computed } from "vue"
import axios from "axios"
import { notify } from "@kyvg/vue3-notification"

const FORMAT = new Map()
FORMAT.set("confluence", "Confluence Wiki")

const CHATWORK_NAME = "Chatwork"
const MESSAGE_URL_REQEXP = /.*rid([0-9]+)-([0-9]+)/
const TARGET_MESSAGE_COUNT = { MIN: 1, MAX: 100 }

const messageURL = ref("")
const targetMessageCount = ref(5)
const outputText = ref("")
const formatKey = ref("confluence")

const howToPaste = computed(() => {
  switch (formatKey.value) {
    case "confluence":
      return "Confluence編集画面にて挿入したい場所で＋ボタン押下後マークアップを選択。表示された画面で\"ConfluenceWiki\"を選択してペーストしてください"
    default:
      return ""
  }
})

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

function validate() {
  // URLが入力されていなければ無効
  if (!messageURL.value) return false
  // 不正なURLなら無効
  if (!messageURL.value.match(MESSAGE_URL_REQEXP)) return false
  // 取得件数が範囲外なら無効
  if (targetMessageCount.value < TARGET_MESSAGE_COUNT.MIN || targetMessageCount.value > TARGET_MESSAGE_COUNT.MAX) {
    return false
  }
  // チェックを通過したので有効
  return true
}

function createOutputText() {
  const url = messageURL.value
  const match = url.match(MESSAGE_URL_REQEXP) ?? [] // ts警告回避。nullではないことはvalidate()で保証する
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

function copyOutputText() {
  if (typeof navigator.clipboard === "undefined") {
    // クリップボードが使えないので何もしない
    return
  }

  // クリップボードに出力文字列をコピー
  navigator.clipboard.writeText(outputText.value)
    .then(() => {
      notify({
        type: "success",
        text: "クリップボードにコピーしました",
      })
    })
    .catch((err: any) => {
      throw err
    })
}
</script>

<template>
  <notifications position="bottom center" />
  <div class="card mx-5">
    <div class="card-header h1">
      {{ CHATWORK_NAME }}コンバーター
    </div>
    <div class="card-body d-flex flex-column">
      <div>
        <label class="font-weight-bold">使い方</label>
        <ol>
          <li>{{ CHATWORK_NAME }}で残したいやり取りの先頭のメッセージリンクを「先頭メッセージリンク」にコピペして変換ボタンを押します</li>
          <li>出力結果をコピーします。末尾にある
            <fa icon="copy" /> を押してもコピーされます。手動でも大丈夫です
          </li>
          <li>{{ howToPaste }}</li>
        </ol>
      </div>
      <div class="form-group">
        <label class="font-weight-bold">先頭メッセージリンク</label>
        <input v-model="messageURL" class="form-control" />
      </div>
      <div class="form-group">
        <label class="font-weight-bold">何件先まで変換するか</label>
        <input v-model="targetMessageCount" type="number" :min="TARGET_MESSAGE_COUNT.MIN" :max="TARGET_MESSAGE_COUNT.MAX"
          class="form-control" />
      </div>
      <div class="form-group">
        <label class="font-weight-bold">フォーマット</label>
        <select v-model="formatKey" class="custom-select">
          <option v-for="[key, value] in FORMAT" :key="key" :value="key">{{ value }}</option>
        </select>
      </div>
      <button @click="createOutputText()" :disabled="!validate()" class="btn btn-success btn-lg">変換</button>
      <br><br>
      <div class="form-group">
        <label class="font-weight-bold">出力結果</label>
        <div v-if="outputText">
          <div class="alert alert-success" style="user-select:all;">
            <button @click="copyOutputText()" class="btn btn-outline-success">
              <fa icon="copy" />
            </button>
            <pre style="text-align:left;">{{ outputText }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
