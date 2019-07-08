module.exports = {
    devServer: {
      https: false
    },
    pwa: {
      name: 'guesswhat'
    },
    pages: {
      'guesswhat': {
        entry: './src/main.js',
        template: 'public/index.html',
        filename: 'index.html'
      },
    }
  }
  