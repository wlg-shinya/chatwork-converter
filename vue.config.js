const { defineConfig } = require('@vue/cli-service')
process.env.VUE_APP_VERSION = process.env.npm_package_version
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://backend:3000'
      }
    }
  },
  pluginOptions: {
    express: {
      shouldServeApp: true,
      serverDir: './srv'
    }
  }
})
