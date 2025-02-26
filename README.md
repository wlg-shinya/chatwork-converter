# Chatwork コンバーター (chatwork-converter)

Chatworkに投稿された文章を Markdown や Confluence Wiki や HTML の形式に変換して別の文章にコピペしやすくするツールです
https://github.com/wlg-shinya/send-chatwork-converter を利用すると使いやすくなります

## Project setup

```
$ npm install
$ echo CHATWORK_API_TOKEN=\"{ChatworkAPI token}\" > .env.local
```

### Build and run for development

```
$ npm run dev && npm run serve
```

### Build and run for production

```
$ npm run build && npm run preview && npm run serve
```

## Deploy

```
$ npm run clean && docker-compose up --build
```
