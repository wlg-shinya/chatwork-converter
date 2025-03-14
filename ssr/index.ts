import express from "express";
import axios from "axios";
import cors from "cors";

// 環境変数の読み込み
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import dotenvLocal from "dotenv";
dotenvLocal.config({ path: ".env.local" });

// URLクエリパラメータから値を得る
function queryValue(req: any, name: string, defaultValue?: any, outputLog = true) {
  if (typeof req.query[name] === "undefined") {
    if (typeof defaultValue === "undefined") {
      // クエリが見つからない場合
      // defaultValue を指定していなければクエリ指定必須なので例外投げる
      throw new Error(`Not set query '${name}'`);
    } else {
      // defaultValue が指定されていればクエリ未指定許容なのでデフォルト値を返す
      if (outputLog) console.log(`[${date()}]   ${name}=${defaultValue} (default)`);
      return defaultValue;
    }
  } else {
    // クエリが見つかったらその値を返す
    if (outputLog) console.log(`[${date()}]   ${name}=${req.query[name]}`);
    return req.query[name];
  }
}

function date() {
  return new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
}

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.VITE_BACKEND_PORT ?? "";
const CHATWORK_API_TOKEN = process.env.CHATWORK_API_TOKEN ?? "";
app.listen(port, () => {
  // URL＆ポート番号
  console.log(`[${date()}] Server URL: ${process.env.VITE_BASE_URL}:${port}`);
  // ChatworkAPIが利用可能かどうか
  console.log(`[${date()}] Chatwork API: ${CHATWORK_API_TOKEN ? "available!" : "unavailable..."}`);
});

app.get("/api/chatwork_get_messages", (req, res) => {
  console.log(`[${date()}] /api/chatwork_get_message`);
  const room_id = queryValue(req, "room_id");
  // https://developer.chatwork.com/reference/get-rooms-room_id-messages
  const config = { headers: { "x-chatworktoken": CHATWORK_API_TOKEN } };
  axios
    .get(`https://api.chatwork.com/v2/rooms/${room_id}/messages?force=1`, config)
    .then((response) => {
      const data = JSON.parse(JSON.stringify(response.data));
      res.json(data);
    })
    .catch((err) => {
      throw err;
    });
});

app.get("/api/chatwork_get_message", (req: any, res: any) => {
  console.log(`[${date()}] /api/chatwork_get_message`);
  const room_id = queryValue(req, "room_id");
  const message_id = queryValue(req, "message_id");
  // https://developer.chatwork.com/reference/get-rooms-room_id-messages-message_id
  const config = { headers: { "x-chatworktoken": CHATWORK_API_TOKEN } };
  axios
    .get(`https://api.chatwork.com/v2/rooms/${room_id}/messages/${message_id}`, config)
    .then((response) => {
      const data = JSON.parse(JSON.stringify(response.data));
      res.json(data);
    })
    .catch((err) => {
      throw err;
    });
});
