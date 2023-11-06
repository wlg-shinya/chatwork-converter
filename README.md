# Chatworkコンバーター

## Project setup
```
npm install
npm install -g serve
echo VUE_APP_CHATWORK_API_TOKEN=\"{ChatworkAPI token}\" > .env
```

### Compiles and hot-reloads for development
```
npm run serve && npm run express:build && npm run express:run
```

### Compiles and minifies for production
```
npm run build && npm run express:run
```

### Docker
```
docker-compose build && docker-compose up
```