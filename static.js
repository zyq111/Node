const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const suffixModel = require('./models/suffix.js');

http.createServer(function(req, res) {
    const pathname = url.parse(req.url, true).pathname;
    if (pathname !== '/favicon.ico') {
        fs.readFile('./views'+pathname, function(err, data) {
            if (err) {
                console.log('./views'+pathname+'没有找到该文件')
                return false
            }

            const extname = path.extname(pathname);
            
            suffixModel.suffix(extname, function(val) {
                res.writeHead(200, {"content-type":""+val+";charset='utf-8'"});
                res.write(data);
                res.end()
            })
        })
    }
}).listen(8000, '127.0.0.1',function(err){
    if(!err) {
        console.log('服务连接成功')
    }
})