import Formatter from "@/formatter/formatter"

export default class ConfluenceFormatter implements Formatter {
    howToPaste() {
        return "Confluence編集画面にて挿入したい場所で＋ボタン押下後マークアップを選択。表示された画面で\"ConfluenceWiki\"を選択してペーストしてください"
    }
    link(link: string, text = "") {
        return text ? `[${text}|${link}]` : `[${link}]`
    }
    bold(text: string) {
        return `*${text}*`
    }
    separator() {
        return "----"
    }
    body(text: string) {
        let newbody = text
        // [qt][qtmeta *][/qt] -> bq.
        newbody = newbody.replace(/\[qt\]\[qtmeta.*\](.*)\[\/qt\]/gs, "bq. $1\n")
        // [toall] -> 【ToALL】
        newbody = newbody.replace(/\[toall\](.*)/g, "【ToALL】$1")
        // [To:*] -> 【To】
        newbody = newbody.replace(/\[To:.*\](.*)/g, "【To】$1")
        // [rp *] -> 【Re】
        newbody = newbody.replace(/\[rp.*\](.*)/g, "【Re】$1")
        return newbody
    }
}