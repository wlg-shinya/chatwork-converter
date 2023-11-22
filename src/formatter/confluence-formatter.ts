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
    // [To:*]
    return text.replace(/\[To:.*\](.*)/g, "【To】$1");
  }
  convertToAll(text: string) {
    // [toall]
    return text.replace(/\[toall\](.*)/g, "【ToALL】$1");
  }
  convertReply(text: string) {
    // [rp *]
    return text.replace(/\[rp.*\](.*)/g, "【Re】$1");
  }
  convertQuote(text: string) {
    // [qt][qtmeta *][/qt]
    return text.replace(/\[qt\]\[qtmeta.*\](.*)\[\/qt\]/gs, "bq. $1\n");
  }
  convertInfo(text: string) {
    // [info][title][dtext:file_uploaded][/title][preview id=1341384457 ht=16][download:1341384457]FILENAME (0 B)[/download][/info]
    // [info][title][dtext:file_uploaded][/title][download:1341503124]FILENAME (0 B)[/download][/info]
    // [info][title][dtext:task_added][/title][task aid=8638511 st=open lt=1705642989 ltype=date]TASK[/task][/info]
    // [info][title][dtext:task_edited][/title][task aid=8638511 st=open lt=1704087789 ltype=date]TASK[/task][/info]
    // [info][title][dtext:task_done][/title][task aid=8638511 st=done lt=1700791029 ltype=date]TASK[/task][/info]
    // [info][title]TITLE[/title]BODY[/info]
    // [info]BODY[/info]
    return (
      text
        // ファイル送信タグはファイル名部分だけ残す
        .replace(/\[info\]\[title\]\[dtext:file_uploaded\]\[\/title\].*\[download:.*\](.*)\[\/download\]\[\/info\]/g, "$1")
        // タスク関連タグは"【タスク状態】タスク文章"という形に変換
        .replace(/\[info\]\[title\]\[dtext:(.*)\]\[\/title\]\[task .*\](.*)\[\/task\]\[\/info\]/gs, "【$1】\n$2")
        // それ以外のinfoタグはタイトルがあればヘッダにしてテーブル化
        .replace(/\[info\]\[title\](.*)\[\/title\](.*)\[\/info\]/gs, "\n||$1||\n|$2|\n")
        .replace(/\[info\](.*)\[\/info\]/gs, "\n|$1|\n")
    );
  }
}
