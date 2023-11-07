# Chatworkコンバーター

## Project setup
```
npm install
npm install -g serve
echo VUE_APP_CHATWORK_API_TOKEN=\"{ChatworkAPI token}\" > .env
```

### Compiles and hot-reloads for development
```
npm run serve && npm run express
```

### Compiles and minifies for production
```
npm run build && npm run express
```

## Deploy
```
docker-compose build && docker-compose up
```