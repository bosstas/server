const fs = require('fs')
const path = require('path')

const usersDbPath = path.join(__dirname, '/db-users.json')
var databaseJSON = {
  getUsers: function () {
    return new Promise(function (resolve, reject) {
      fs.readFile(usersDbPath, 'utf8', function (
        err,
        content
      ) {
        if (err) return reject(err)
        resolve(JSON.parse(content))
      })
    })
  },
  setUsers: function (users) {
    return new Promise(function (resolve, reject) {
      fs.writeFile(usersDbPath,
        JSON.stringify(users, null, '\t'),
        function (err) {
          if (err) return reject(err)
          resolve()
        }
      )
    })
  }
}

module.exports = databaseJSON
