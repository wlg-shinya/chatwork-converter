import Formatter from "@/formatter/formatter"

export default class MarkdownFormatter implements Formatter {
    howToPaste() {
        return "Markdownに対応したお好きな場所でペーストしてください"
    }
    link(link: string, text = "") {
        return text ? `[${text}](${link})` : link
    }
    bold(text: string) {
        return ` **${text}** `
    }
    separator() {
        return "___"
    }
    body(text: string) {
        let newbody = text
        // [To:*] -> 【To】
        newbody = newbody.replace(/\[To:.*\](.*)/g, "【To】$1")
        // [rp *] -> 【Re】
        newbody = newbody.replace(/\[rp.*\](.*)/g, "【Re】$1")
        // これまでの文章中にあるすべての改行コードの前にスペース2個追加
        // 以降は改行コード前にスペースを入れる必要なし
        newbody = newbody.replaceAll("\n", "  \n")
        // [qt][qtmeta *][/qt] -> '> ' + 先頭と末尾に改行
        newbody = newbody.replace(/\[qt\]\[qtmeta.*\](.*)\[\/qt\]/g, "\n> $1\n")
        // 先頭と末尾に改行追加
        newbody = `\n${newbody}\n`
        return newbody
    }
}