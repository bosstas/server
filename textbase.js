const fs = require('fs')
const path = require('path')

const textDbPath = path.join(__dirname, '/db-text.json')
const textJSON = {
  getText: function () {
    return new Promise(function (resolve, reject) {
      fs.readFile(textDbPath, 'utf8', function (err, content) {
        if (err) return reject(err)

        resolve(JSON.parse(content))
      })
    })
  },
  setText: function (texts) {
    return new Promise(function (resolve, reject) {
      fs.writeFile(textDbPath, JSON.stringify(texts, null, '\t'), function (
        err
      ) {
        if (err) return reject(err)
        resolve()
      })
    })
  }
}

module.exports = textJSON
