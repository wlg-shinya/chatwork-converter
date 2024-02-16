import { Formatter } from "./formatter-interface";
import { default as ChatworkTagConverter } from "./chatwork-tag-converter";

class HtmlFormatter implements Formatter {
  howToPaste() {
    return "HTMLフォーマットの場合は書式コピーの都合があるので手動でコピーしてください。書式ペーストできる場所(ConfluenceやGoogleドキュメント等)でペーストしてください";
  }
  link(link: string, text = "") {
    return `<a href="${link}">${text}</a>`;
  } //<a href="http://sample.htm">サンプルサイトへ飛びます。</a>
  bold(text: string) {
    return `<b>${text}</b>`;
  }
  separator() {
    return "<hr>";
  }
  body(text: string) {
    let result = text;
    // 各種タグ変換
    const tableTag = "<table class='table table-bordered'>";
    result = ChatworkTagConverter.to(result, (_match, ...p) => `<span>【To】${p[0]}</span>`);
    result = ChatworkTagConverter.toall(result, (_match, ...p) => `<span>【ToALL】${p[0]}</span>`);
    result = ChatworkTagConverter.reply(result, (_match, ...p) => `<span>【Re】${p[0]}</span>`);
    result = ChatworkTagConverter.quote(result, (_match, ...p) => `<blockquote>${p[0]}</blockquote>`);
    result = ChatworkTagConverter.fileUploaded(result, (_match, ...p) => `<span>${p[0]}</span>`);
    result = ChatworkTagConverter.task(result, (_match, ...p) => `<div><div>【${p[0]}】</div><span>${p[1]}</span></div>`);
    result = ChatworkTagConverter.infoWithTitle(
      result,
      (_match, ...p) => `${tableTag}<thead><tr><th>${p[0]}</th></tr></thead><tbody><tr><td>${p[1]}</td></tr></tbody></table>`
    );
    result = ChatworkTagConverter.info(result, (_match, ...p) => `${tableTag}<tbody><tr><td>${p[0]}</td></tr></tbody></table>`);
    // 改行 -> <br>
    result = result.replace(/\n/g, "<br>");
    result = `<div>${result}</div>`;
    return result;
  }
}

export default new HtmlFormatter();
