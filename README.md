# Chatwork コンバーター

## Project setup

```
$ npm install
$ echo VITE_CHATWORK_API_TOKEN=\"{ChatworkAPI token}\" > .env.local
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
