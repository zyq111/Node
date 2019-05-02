/**
 * 类似express框架路由方法
 */
var url = require('url')
var path = require('path')
var fs = require('fs')
var suffixModel = require('./suffix.js')
// 给res添加send方法
function send (res) {
    res.send = function (data) {
        res.writeHead(200, {"Content-Type": "text/html;charset='utf-8"})
        res.end(data)
    }
}
// 给res添加render方法
function render (res) {
    res.render = function (pathname) {
        // console.log(pathname)
        fs.readFile('./views/'+pathname, function (err, data) {
            if(err) {
                console.log('没有找到指定文件')
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
}
var router = function () {
    var that = this
    this._get = {}
    this._post = {}
    var app = function (req, res) {
        send(res)
        render(res)
        // 获取pathname地址
        var pathname = url.parse(req.url).pathname
        if (!pathname.endsWith('/')) {
            pathname = pathname+'/'
        }
        // console.log(pathname)
        // 获取设置路由请求的方式 get，post
        var method=req.method.toLowerCase()
        // console.log(method)
        if (that['_'+method][pathname]) {
            if (method=='post') {
                var postStr = ''
                req.on('data', function (chunk) {
                    postStr += chunk
                })
                req.on('end', function (err, chunk) {
                    // console.log(postStr)
                    req.body = postStr
                    that['_'+method][pathname](req, res)
                })
            } else {
                that['_'+method][pathname](req, res)
            }
        } else {
            // 获取没有设置路由的静态文件请求
            if (pathname === '/favicon.ico/') {
                return false
            }
            fs.readFile('./public'+pathname, function (err, data) {
                if(err) {
                    console.log('没有找到public文件')
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
    }

    // 设置get路由请求
    app.get=function(string,callback) {
        
        if (!string.endsWith('/')) {
            string = string+'/'
        }
        if (!string.startsWith('/')) {
            string = '/'+string
        }
        that._get[string] = callback
    }
    // 设置post路由请求
    app.post=function(string,callback) {
        if (!string.endsWith('/')) {
            string = string+'/'
        }
        if (!string.startsWith('/')) {
            string = '/'+string
        }
        that._post[string] = callback
    }
    return app
}

module.exports = router()