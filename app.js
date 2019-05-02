const http = require('http')
const url = require('url')
const ejs = require('ejs')
const uuid = require('node-uuid')
const md5=require('md5-node')
const queryString = require('querystring')
const app = require('./models/router')
const mongoDb = require('./models/mongodb.js')
const cookies = require('./libs/cookies.js')
const collectName = 'user'
const collectBBS = 'bss'

http.createServer(app).listen(8080)
app.get('/',function(req, res) {
    ejs.renderFile('views/login.ejs', function(err, data) {
        res.send(data)
    })
})
app.post('/dologin', function(req, res) {
    let body = queryString.parse(req.body)
    body.password = md5(body.password)
    mongoDb.findOne(collectName, body, function(result) {
        if (result.data) {
            // 设置cookie
            console.log(result.data[0].id)
            res.setHeader('Set-Cookie', cookies.serialize('u_id', md5(result.data[0].id)))
            res.setHeader('Set-Cookie', cookies.serialize('user', result.data[0].name))
        }
        res.send(JSON.stringify(result))
    })
})
app.get('/register',function(req, res) {
    ejs.renderFile('views/register.ejs', function(err, data) {
        res.send(data)
    })
})
app.post('/doregister', function(req, res) {
    let body = queryString.parse(req.body)
    if (body.password === body.cpassword) {
        mongoDb.insertOne(collectName, {
            id: uuid.v1(),
            name: body.name,
            password: md5(body.password)
        }, function (result) {
            res.send(JSON.stringify(result))
        })
    }
})
app.get('/albbs', function(req, res) {
    mongoDb.findPublish(collectBBS, {}, function(result) {
        ejs.renderFile('views/albbs.ejs', {result: result}, function(err, data) {
            res.send(data)
        })
    })
})
app.get('/mybbs', function(req, res) {
    const body = queryString.parse(req.headers.cookie.split('; ').join('&'))
    mongoDb.findPublish(collectBBS, {
        u_id: body.u_id,
        name: body.user
    }, function(result) {
        ejs.renderFile('views/mybbs.ejs', {result: result}, function(err, data) {
            res.send(data)
        })
    })
})
// app.get('/bbs', function(req, res) {
//     ejs.renderFile('views/bbs.ejs', function(err, data) {
//         res.send(data)
//     })
// })
app.get('/publish', function(req, res) {
    ejs.renderFile('views/publish.ejs', function(err, data) {
        res.send(data)
    })
})
app.post('/dopublish', function(req, res) {
    let body = queryString.parse(req.body)
    let cookieData = queryString.parse(req.headers.cookie.split('; ').join('&'))
    mongoDb.insertPublish(collectBBS, {
        bbs: body.myPublish,
        u_id: cookieData.u_id,
        name: cookieData.user,
        c_id: uuid.v1()
    }, function (result) {
        res.send(JSON.stringify(result))
    })
})
app.post('/docomment', function(req, res) {
    const body = queryString.parse(req.body)
    let cookieData = queryString.parse(req.headers.cookie.split('; ').join('&'))
    mongoDb.updateBBS(collectBBS, {c_id: body.id},{
        name: cookieData.user,
        comment: body.comment
    }, function (result) {
        res.send(JSON.stringify(result))
    })
})