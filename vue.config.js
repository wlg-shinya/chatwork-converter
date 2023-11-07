const { defineConfig } = require('@vue/cli-service')

// フロントエンド用後付け環境変数。srv以下では利用できません
process.env.VUE_APP_VERSION = process.env.npm_package_version

module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    express: {
      shouldServeApp: true,
      serverDir: './srv'
    }
  }
})
