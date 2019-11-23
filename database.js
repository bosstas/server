var fs = require("fs");
var databaseJSON = {
    getUsers : function () {
        return new Promise(function (resolve, reject) {
            fs.readFile(__dirname + '/db-users.json', 'utf8', function (err, content) {
                if (err) return reject(err);

                resolve(JSON.parse(content));
            });
        });
    },
    setUsers : function (users) {
        return new Promise(function (resolve, reject) {
            fs.writeFile(__dirname + '/db-users.json', JSON.stringify(users, null, "\t"), function (err) {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

module.exports = databaseJSON;