# Chatwork コンバーター

## Project setup

```
npm install
npm install -g serve
echo VITE_CHATWORK_API_TOKEN=\"{ChatworkAPI token}\" > .env.local
```

### Compiles for development

```
npm run dev && npm run serve
```

### Compiles and minifies for production

```
npm run build && npm run preview && npm run serve
```

## Deploy

```
docker-compose build && docker-compose up
```
