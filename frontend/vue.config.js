const path = require("path")
const fs = require("fs")
const config = JSON.parse(fs.readFileSync('../config.json'))

module.exports = {
  devServer: {
    port: config.frontend.port,
    disableHostCheck: true
  },
  outputDir: path.resolve(__dirname, '../backend/web')
}