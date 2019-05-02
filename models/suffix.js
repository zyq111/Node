/*
    根据文件的后缀名获取文件的类型
    fs: fs模块
    extname：文件的后缀名
*/
const fs = require('fs');
exports.suffix = function(extname, cb) {
    fs.readFile('./models/mime.json', function(err, data) {
        if(err) {
            console.log('mime.json文件找不到')
            return false
        }
        const mines = JSON.parse(data.toString())
        cb(mines[extname] || 'text/html')
    })
}