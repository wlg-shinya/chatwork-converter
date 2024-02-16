import { Formatter } from "./formatter-interface";
import { default as ChatworkTagConverter } from "./chatwork-tag-converter";

class HtmlFormatter implements Formatter {
  howToPaste() {
    return "？？？";
  }
  link(link: string, text = "") {
    return `<a href="${link}>${text}</a>`;
  } //<a href="http://sample.htm">サンプルサイトへ飛びます。</a>
  bold(text: string) {
    return `<b>${text}</b>`;
  }
  separator() {
    return "<hr>";
  }
  body(text: string) {
    let result = text;
    result = ChatworkTagConverter.to(result, (_match, ...p) => `<span>【To】${p[0]}</span>`);
    result = ChatworkTagConverter.toall(result, (_match, ...p) => `<span>【ToALL】${p[0]}</span>`);
    result = ChatworkTagConverter.reply(result, (_match, ...p) => `<span>【Re】${p[0]}</span>`);
    result = ChatworkTagConverter.quote(result, (_match, ...p) => `<blockquote>${p[0]}</blockquote>`);
    result = ChatworkTagConverter.fileUploaded(result, (_match, ...p) => `<span>${p[0]}</span>`);
    result = ChatworkTagConverter.task(result, (_match, ...p) => `<div><div>【${p[0]}】</div><span>${p[1]}</span></div>`);
    result = ChatworkTagConverter.infoWithTitle(result, (_match, ...p) => `<div><div>【${p[0]}】</div><span>${p[1]}</span></div>`);
    result = ChatworkTagConverter.info(result, (_match, ...p) => `<div>${p[0]}</div>`);
    return result;
  }
}

export default new HtmlFormatter();
