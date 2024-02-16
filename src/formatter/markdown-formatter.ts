import { Formatter } from "./formatter-interface";

export class MarkdownFormatter implements Formatter {
  howToPaste() {
    return "Markdownに対応したお好きな場所でペーストしてください";
  }
  link(link: string, text = "") {
    return text ? `[${text}](${link})` : link;
  }
  bold(text: string) {
    return ` **${text}** `;
  }
  separator() {
    return "___";
  }
  body(text: string) {
    // console.log(text);
    let newbody = text;
    // 文章中にあるすべての改行をMarkdownにとっての改行表現に変換
    newbody = newbody.replace(/\n/g, "  \n");
    // 各種タグ変換
    newbody = this.convertTo(newbody);
    newbody = this.convertToAll(newbody);
    newbody = this.convertReply(newbody);
    newbody = this.convertQuote(newbody);
    newbody = this.convertInfo(newbody);
    // 先頭と末尾に改行追加
    newbody = `\n${newbody}\n`;
    return newbody;
  }
  convertTo(text: string) {
    return text.replace(/\[To:.*\](.*)/g, "【To】$1  \n");
  }
  convertToAll(text: string) {
    return text.replace(/\[toall\](.*)/g, "【ToALL】$1  \n");
  }
  convertReply(text: string) {
    return text.replace(/\[rp.*\](.*)/g, "【Re】$1  \n");
  }
  convertQuote(text: string) {
    return text.replace(/\[qt\]\[qtmeta.*\](.*)\[\/qt\]/gs, "\n> $1\n");
  }
  convertInfo(text: string) {
    return (
      text
        // ファイル送信タグはファイル名部分だけ残す
        .replace(/\[info\]\[title\]\[dtext:file_uploaded\]\[\/title\].*?\[download:.*\]\s*(.*?)\s*\[\/download\]\[\/info\]/g, "$1  \n")
        // タスク関連タグは"【タスク状態】タスク文章"という形に変換
        .replace(/\[info\]\[title\]\[dtext:(.*?)\]\[\/title\]\[task .*?\]\s*(.*?)\s*\[\/task\]\[\/info\]/gs, "【$1】\n$2  \n")
        // それ以外のinfoタグはタイトルがあればヘッダに設定しつつテーブル化
        .replace(/\[info\]\[title\]\s*(.*?)\s*\[\/title\]\s*(.*?)\s*\[\/info\]/gs, "\n|$1|\n|-|\n|$2|\n")
        .replace(/\[info\]\s*(.*?)\s*\[\/info\]/gs, "\n||\n|-|\n|$1|\n")
    );
  }
}
