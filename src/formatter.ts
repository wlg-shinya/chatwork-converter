export default interface Formatter {
    howToPaste(): string
    link(link: string, text: string): string
    bold(text: string): string
    separator(): string
}