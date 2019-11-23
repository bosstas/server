var fs=require('fs');
var textJSON = {
    getText : function () {
        return new Promise(function (resolve, reject) {
            fs.readFile(__dirname + '/db-text.json', 'utf8', function (err, content) {
                if (err) return reject(err);

                resolve(JSON.parse(content));
            });
        });
    },
    setText : function (texts) {
        return new Promise(function (resolve, reject) {
            fs.writeFile(__dirname + '/db-text.json', JSON.stringify(texts, null, "\t"), function (err) {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

module.exports=textJSON;