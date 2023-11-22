export interface Formatter {
  howToPaste(): string;
  link(link: string, text: string): string;
  bold(text: string): string;
  separator(): string;
  body(text: string): string;

  // TO([To:*])一行分の変換
  convertTo(text: string): string;
  // TOALL([toall])一行分の変換
  convertToAll(text: string): string;
  // 返信([rp *])一行分の変換
  convertReply(text: string): string;
  // 引用([qt][qtmeta *][/qt])の変換
  convertQuote(text: string): string;
  // 様々なinfoタグの変換
  // - ファイル送信
  //   - [info][title][dtext:file_uploaded][/title][preview id=1341384457 ht=16][download:1341384457]FILE (0 B)[/download][/info]
  //   - [info][title][dtext:file_uploaded][/title][download:1341503124]FILE (0 B)[/download][/info]
  // - タスク
  //   - [info][title][dtext:task_added][/title][task aid=8638511 st=open lt=1705642989 ltype=date]TASK[/task][/info]
  //   - [info][title][dtext:task_edited][/title][task aid=8638511 st=open lt=1704087789 ltype=date]TASK[/task][/info]
  //   - [info][title][dtext:task_done][/title][task aid=8638511 st=done lt=1700791029 ltype=date]TASK[/task][/info]
  // - タイトルありinfo
  //   - [info][title]TITLE[/title]INFO[/info]
  // - 通常info
  //   - [info]INFO[/info]
  convertInfo(text: string): string;
}
