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
        // console.log(text)
        let newbody = text
        // [title][dtext:file_uploaded][/title] -> 除去
        // [download:*] -> タグのみ除去。infoタグに囲まれたファイル名が残ります
        newbody = newbody.replace(/\[title\]\[dtext:file_uploaded\]\[\/title\]/g, "")
        newbody = newbody.replace(/\[download:.*\](.*)\[\/download\]/g, "$1")
        // [qt][qtmeta *][/qt] -> bq.
        newbody = newbody.replace(/\[qt\]\[qtmeta.*\](.*)\[\/qt\]/gs, "bq. $1\n")
        // [toall] -> 【ToALL】
        newbody = newbody.replace(/\[toall\](.*)/g, "【ToALL】$1")
        // [To:*] -> 【To】
        newbody = newbody.replace(/\[To:.*\](.*)/g, "【To】$1")
        // [rp *] -> 【Re】
        newbody = newbody.replace(/\[rp.*\](.*)/g, "【Re】$1")
        // [info][title] -> title部をヘッダにしてテーブル化
        newbody = newbody.replace(/\[info\]\[title\](.*)\[\/title\](.*)\[\/info\]/g, "\n||$1||\n|$2|\n")
        // [info] -> テーブル化
        newbody = newbody.replace(/\[info\](.*)\[\/info\]/g, "\n|$1|\n")
        return newbody
    }
}