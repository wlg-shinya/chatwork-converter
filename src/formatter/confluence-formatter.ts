import { Formatter } from "./formatter-interface";

export class ConfluenceFormatter implements Formatter {
  howToPaste() {
    return 'Confluence編集画面にて挿入したい場所で＋ボタン押下後マークアップを選択。表示された画面で"ConfluenceWiki"を選択してペーストしてください';
  }
  link(link: string, text = "") {
    return text ? `[${text}|${link}]` : `[${link}]`;
  }
  bold(text: string) {
    return `*${text}*`;
  }
  separator() {
    return "----";
  }
  body(text: string) {
    // console.log(text);
    let newbody = text;
    newbody = this.convertTo(newbody);
    newbody = this.convertToAll(newbody);
    newbody = this.convertReply(newbody);
    newbody = this.convertQuote(newbody);
    newbody = this.convertInfo(newbody);
    return newbody;
  }
  convertTo(text: string) {
    return text.replace(/\[To:.*\](.*)/g, "【To】$1");
  }
  convertToAll(text: string) {
    return text.replace(/\[toall\](.*)/g, "【ToALL】$1");
  }
  convertReply(text: string) {
    return text.replace(/\[rp.*\](.*)/g, "【Re】$1");
  }
  convertQuote(text: string) {
    return text.replace(/\[qt\]\[qtmeta.*\](.*)\[\/qt\]/gs, "bq. $1\n");
  }
  convertInfo(text: string) {
    return (
      text
        // ファイル送信タグはファイル名部分だけ残す
        .replace(/\[info\]\[title\]\[dtext:file_uploaded\]\[\/title\].*?\[download:.*\]\s*(.*?)\s*\[\/download\]\[\/info\]/g, "$1")
        // タスク関連タグは"【タスク状態】タスク文章"という形に変換
        .replace(/\[info\]\[title\]\[dtext:(.*?)\]\[\/title\]\[task .*?\]\s*(.*?)\s*\[\/task\]\[\/info\]/gs, "【$1】\n$2")
        // それ以外のinfoタグはタイトルがあればヘッダにしてテーブル化
        .replace(/\[info\]\[title\]\s*(.*?)\s*\[\/title\]\s*(.*?)\s*\[\/info\]/gs, `\n||$1||\n|$2|\n`)
        .replace(/\[info\]\s*(.*?)\s*\[\/info\]/gs, "\n|$1|\n")
    );
  }
}
