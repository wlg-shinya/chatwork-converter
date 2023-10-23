import Formatter from "@/formatter"

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
}