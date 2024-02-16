type Replacement = (match: string, ...p: any[]) => string;

class ChatworkTagConverter {
  // $1 = タグ直後の文字列1行分
  to(src: string, replacement: Replacement): string {
    return src.replace(/\[To:.*\](.*)/g, replacement);
  }
  // $1 = タグ直後の文字列1行分
  toall(src: string, replacement: Replacement): string {
    return src.replace(/\[toall\](.*)/g, replacement);
  }
  // $1 = タグ直後の文字列1行分
  reply(src: string, replacement: Replacement): string {
    return src.replace(/\[rp.*\](.*)/g, replacement);
  }
  // $1 = 返信の全文章
  quote(src: string, replacement: Replacement): string {
    return src.replace(/\[qt\]\[qtmeta.*\](.*)\[\/qt\]/gs, replacement);
  }
  // $1 = アップロードしたファイル名
  fileUploaded(src: string, replacement: Replacement): string {
    return src.replace(/\[info\]\[title\]\[dtext:file_uploaded\]\[\/title\].*?\[download:.*\]\s*(.*?)\s*\[\/download\]\[\/info\]/g, replacement);
  }
  // $1 = タスクの状態
  // $2 = タスク名
  task(src: string, replacement: Replacement): string {
    return src.replace(/\[info\]\[title\]\[dtext:(.*?)\]\[\/title\]\[task .*?\]\s*(.*?)\s*\[\/task\]\[\/info\]/gs, replacement);
  }
  // $1 = タイトル部の全文章
  // $2 = 情報部の全文章
  infoWithTitle(src: string, replacement: Replacement): string {
    return src.replace(/\[info\]\[title\]\s*(.*?)\s*\[\/title\]\s*(.*?)\s*\[\/info\]/gs, replacement);
  }
  // $1 = 情報部の全文章
  info(src: string, replacement: Replacement): string {
    return src.replace(/\[info\]\s*(.*?)\s*\[\/info\]/gs, replacement);
  }
}

export default new ChatworkTagConverter();
