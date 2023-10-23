export default interface Formatter {
    link(link: string, text: string): string
    bold(text: string): string
    separator(): string
}