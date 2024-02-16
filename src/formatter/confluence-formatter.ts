import { Formatter } from "./formatter-interface";
import { default as ChatworkTagConverter } from "./chatwork-tag-converter";

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
    let result = text;
    // 各種タグ変換
    const removeBlankLine = (src: string): string => src.replace(/\n\s/g, "");
    result = ChatworkTagConverter.to(result, (_match, ...p) => `【To】${p[0]}`);
    result = ChatworkTagConverter.toall(result, (_match, ...p) => `【ToALL】${p[0]}`);
    result = ChatworkTagConverter.reply(result, (_match, ...p) => `【Re】${p[0]}`);
    result = ChatworkTagConverter.quote(result, (_match, ...p) => `bq. ${p[0]}\n`);
    result = ChatworkTagConverter.fileUploaded(result, (_match, ...p) => `${p[0]}`);
    result = ChatworkTagConverter.task(result, (_match, ...p) => `【${p[0]}】\n${p[1]}`);
    result = ChatworkTagConverter.infoWithTitle(result, (_match, ...p) => {
      // 空白行があるとテーブルと認識されなくなるので削除
      return `\n||${p[0]}||\n|${removeBlankLine(p[1])}|\n`;
    });
    result = ChatworkTagConverter.info(result, (_match, ...p) => `\n|${removeBlankLine(p[0])}|\n`);
    return result;
  }
}
