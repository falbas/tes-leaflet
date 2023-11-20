const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = {
  entry: './src/webpack/_main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public/dist'),
  },
  plugins: [new Dotenv()],
}
