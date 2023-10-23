import Formatter from "@/formatter"

export default class ConfluenceFormatter implements Formatter {
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