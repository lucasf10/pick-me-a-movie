const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: 'Pick me a Movie',
    themeColor: '#8e2de2',
    msTileColor: '#8e2de2',
  },
});
