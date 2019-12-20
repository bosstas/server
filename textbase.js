const fs = require('fs')
const path = require('path')

const textDbPath = path.join(__dirname, '/db-text.json')

const getText = function () {
  return new Promise(function (resolve, reject) {
    fs.readFile(textDbPath, 'utf8', function (err, content) {
      if (err) return reject(err)
      resolve(JSON.parse(content))
    })
  })
}
const setText = function (texts) {
  return new Promise(function (resolve, reject) {
    getText()
      .then(oldTexts => {
        oldTexts.push(texts)
        return oldTexts
      })
      .then(newTexts => {
        fs.writeFileSync(textDbPath, JSON.stringify(newTexts, null, '\t'))
        return resolve(newTexts)
      })
      .catch(e => reject(e))
  })
}

module.exports = { getText, setText }
