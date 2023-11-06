const { defineConfig } = require('@vue/cli-service')

// 公開環境変数
process.env.VUE_APP_VERSION = process.env.npm_package_version
process.env.VUE_APP_BASE_URL = "http://localhost"
process.env.VUE_APP_BACKEND_URL = "http://localhost:3000"
process.env.VUE_APP_TITLE = "Chatworkコンバーター"
process.env.VUE_APP_STORAGE_KEY = "tr-chatconv"

// production時は上書きする設定
if (process.env.NODE_ENV == "production") {
  process.env.VUE_APP_BASE_URL = "http://localhost"
  process.env.VUE_APP_BACKEND_URL = "http://localhost:3000"
}

module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    express: {
      shouldServeApp: true,
      serverDir: './srv'
    }
  }
})
