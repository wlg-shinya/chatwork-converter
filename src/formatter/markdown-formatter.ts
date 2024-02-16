import { Formatter } from "./formatter-interface";
import { default as ChatworkTagConverter } from "./chatwork-tag-converter";

class MarkdownFormatter implements Formatter {
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
    let result = text;
    // 文章中にあるすべての改行をMarkdownにとっての改行表現に変換
    result = result.replace(/\n/g, "  \n");
    // 各種タグ変換
    const space2ToBr = (src: string): string => src.replace(/  /g, "<br>");
    result = ChatworkTagConverter.to(result, (_match, ...p) => `【To】${p[0]}  \n`);
    result = ChatworkTagConverter.toall(result, (_match, ...p) => `【ToALL】${p[0]}  \n`);
    result = ChatworkTagConverter.reply(result, (_match, ...p) => `【Re】${p[0]}  \n`);
    result = ChatworkTagConverter.quote(result, (_match, ...p) => `\n> ${p[0]}\n`);
    result = ChatworkTagConverter.fileUploaded(result, (_match, ...p) => `${p[0]}  \n`);
    result = ChatworkTagConverter.task(result, (_match, ...p) => `【${p[0]}】\n${p[1]}  \n`);
    result = ChatworkTagConverter.infoWithTitle(result, (_match, ...p) => {
      // テーブル内はスペース2では改行と判定されないため<br>で代用する
      return `\n|${p[0]}|\n|-|\n|${space2ToBr(p[1])}|\n`;
    });
    result = ChatworkTagConverter.info(result, (_match, ...p) => `\n||\n|-|\n|${space2ToBr(p[0])}|\n`);
    // 先頭と末尾に改行追加
    result = `\n${result}\n`;
    return result;
  }
}

export default new MarkdownFormatter();
