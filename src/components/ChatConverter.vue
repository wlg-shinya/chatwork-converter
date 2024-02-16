<script setup lang="ts">
import { ref, watchEffect, watch, computed } from "vue";
import axios from "axios";
import { notify } from "@kyvg/vue3-notification";
import LocalStorage from "../local-storage";
import { ConfluenceFormatter, MarkdownFormatter, HtmlFormatter } from "../formatter";

// クエリパラメータを得るためのvue-router
import { useRoute } from "vue-router";
const route = useRoute();

// できれば外部で設定したいもの
const ADMIN_EMAIL = "s-watanabe@three-rings.net";

// フォーマット関連
const FORMAT_KIND = ["confluence", "markdown", "html"] as const;
type FormatKind = (typeof FORMAT_KIND)[number];
const formatKindDescription = (kind: FormatKind): string => {
  switch (kind) {
    case "html":
      return "HTML";
    case "markdown":
      return "Markdown";
    case "confluence":
    default:
      return "Confluence Wiki";
  }
};
const formatter = computed(() => {
  switch (formatKind.value) {
    case "html":
      return HtmlFormatter;
    case "markdown":
      return MarkdownFormatter;
    case "confluence":
    default:
      return ConfluenceFormatter;
  }
});

const APP_TITLE = `${import.meta.env.VITE_APP_TITLE} version ${__APP_VERSION__}`;
const CHATWORK_NAME = "Chatwork";
const MESSAGE_URL_REQEXP = /.*rid([0-9]+)-([0-9]+)/;
const TARGET_MESSAGE_COUNT = { MIN: 1, MAX: 100 };
const LOCAL_STORAGE_TOP_NAME = "main";

const messageLink = ref(route.query.message_link?.toString().trimEnd() || "");
const targetMessageCount = ref(5);
const outputText = ref("");
const formatKind = ref<FormatKind>("confluence");
watch(formatKind, () => {
  outputText.value = "";
});

// ローカルストレージから初期設定を読み込む
const localData = LocalStorage.fetch(LOCAL_STORAGE_TOP_NAME);
if (typeof localData.targetMessageCount !== "undefined") {
  targetMessageCount.value = localData.targetMessageCount;
}
if (typeof localData.formatKey !== "undefined") {
  formatKind.value = localData.formatKey;
}
// 設定が変更され次第ローカルストレージへ保存
watchEffect(() => {
  localData.targetMessageCount = targetMessageCount.value;
  localData.formatKey = formatKind.value;
  LocalStorage.save(localData, LOCAL_STORAGE_TOP_NAME);
});

function validate() {
  // URLが入力されていなければ無効
  if (!messageLink.value) return false;
  // 不正なURLなら無効
  if (!messageLink.value.match(MESSAGE_URL_REQEXP)) return false;
  // 取得件数が範囲外なら無効
  if (targetMessageCount.value < TARGET_MESSAGE_COUNT.MIN || targetMessageCount.value > TARGET_MESSAGE_COUNT.MAX) {
    return false;
  }
  // チェックを通過したので有効
  return true;
}

function createOutputText() {
  const link = messageLink.value;
  const match = link.match(MESSAGE_URL_REQEXP) ?? []; // ts警告回避。nullではないことはvalidate()で保証する
  const roomId = match[1];
  const messageId = match[2];
  const count = targetMessageCount.value;

  axios
    .get("/api/chatwork_get_messages", {
      params: {
        room_id: roomId,
      },
    })
    .then(async (response) => {
      const data = JSON.parse(JSON.stringify(response.data));
      // 削除済みメッセージを除外
      const messages = data.filter((x: any) => x.body != "[deleted]"); // eslint-disable-line @typescript-eslint/no-explicit-any
      // 指定メッセージがどこにあるか特定する
      let startIndex = -1;
      messages.some((x: any, i: number) => {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        if (x.message_id == messageId) {
          startIndex = i;
          return true;
        } else {
          return false;
        }
      });
      let targetMessages = [];
      if (startIndex != -1) {
        // 特定できたので指定メッセージから指定数分のメッセージも収集
        const endIndex = startIndex + count < messages.length ? startIndex + count : messages.length;
        targetMessages = messages.slice(startIndex, endIndex);
      } else {
        // 直近メッセージ群からは特定できなかったので指定メッセージだけ改めて取得
        await axios
          .get("/api/chatwork_get_message", {
            params: {
              room_id: roomId,
              message_id: messageId,
            },
          })
          .then((response2) => {
            const data = JSON.parse(JSON.stringify(response2.data));
            targetMessages.push(data);
          })
          .catch((err) => {
            throw err;
          });
      }
      // メッセージを出力用に整形
      outputText.value = `${formatter.value.separator()}`;
      targetMessages.forEach((x: any) => {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        const name = x.account.name;
        const body = x.body;
        const time = new Date(x.send_time * 1000) // send_time は秒なのでミリ秒に変換
          .toLocaleString("ja-JP"); // 日付時刻情報を日本向けに変換
        const originalUrl = link.replace(/[0-9]+$/, x.message_id);

        outputText.value += `
${formatter.value.bold(name)} ${time} ${formatter.value.link(originalUrl, "投稿元")}
${formatter.value.body(body)}
${formatter.value.separator()}
`;
      });
      outputText.value += `\nこの文章は ${formatter.value.link(import.meta.env.VITE_BASE_URL, APP_TITLE)} によって生成されました`;
    })
    .catch((err) => {
      throw err;
    });
}

function copyOutputText() {
  if (typeof navigator.clipboard === "undefined") {
    // クリップボードが使えないので何もしない
    return;
  }

  // クリップボードに出力文字列をコピー
  navigator.clipboard
    .writeText(outputText.value)
    .then(() => {
      notify({
        type: "success",
        text: "クリップボードにコピーしました",
      });
    })
    .catch((err) => {
      throw err;
    });
}
</script>

<template>
  <notifications position="bottom center" />
  <div class="card mx-5">
    <div class="card-header h1">
      {{ APP_TITLE }}
    </div>
    <div class="card-body d-flex flex-column">
      <div>
        <label class="font-weight-bold">使い方</label>
        <ol>
          <li>{{ CHATWORK_NAME }}で残したいやり取りの先頭のメッセージリンクを「先頭メッセージリンク」にコピペして変換ボタンを押します</li>
          <li>出力結果をコピーします。</li>
          <li>{{ formatter.howToPaste() }}</li>
        </ol>
      </div>
      <div class="form-group">
        <label class="font-weight-bold">先頭メッセージリンク</label>
        <input v-model="messageLink" class="form-control" />
      </div>
      <div class="form-group">
        <label class="font-weight-bold">何件先まで変換するか</label>
        <input v-model="targetMessageCount" type="number" :min="TARGET_MESSAGE_COUNT.MIN" :max="TARGET_MESSAGE_COUNT.MAX" class="form-control" />
      </div>
      <div class="form-group">
        <label class="font-weight-bold">フォーマット</label>
        <select v-model="formatKind" class="custom-select">
          <option v-for="kind in FORMAT_KIND" :key="kind" :value="kind">{{ formatKindDescription(kind) }}</option>
        </select>
      </div>
      <button @click="createOutputText()" :disabled="!validate()" class="btn btn-success btn-lg">変換</button>
      <br /><br />
      <div class="form-group">
        <label class="font-weight-bold">出力結果</label>
        <div v-if="outputText">
          <!-- HTML出力の場合はブラウザ描画結果をコピーする想定なのでinnerHTMLに流し込む -->
          <div v-if="formatKind === 'html'" v-html="outputText" style="user-select: all" />
          <!-- 上記以外のフォーマットはテキストとしてコピーするためpreタグで扱う -->
          <div v-else class="alert alert-success" style="user-select: all">
            <button @click="copyOutputText()" class="btn btn-outline-success">
              <fa icon="copy" />
            </button>
            <pre>{{ outputText }}</pre>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <ul>
        <li>フォーマットを増やしてほしい！</li>
        <li>コピペした結果が見づらいから直してほしい！</li>
        <li>〇〇な機能に対応してほしい！</li>
      </ul>
      ご要望は {{ CHATWORK_NAME }} 上で {{ ADMIN_EMAIL }} にコンタクトください
    </div>
  </div>
</template>
