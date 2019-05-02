const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/bbs'


function connectMongoDb (callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('数据库连接失败')
            console.log(err)
            return false
        }
        console.log('数据库连接成功')
        callback(db)
    })
}


exports.findOne = function (collectName, object, callback) {
    connectMongoDb(function (db) {
        const collection = db.collection(collectName)
        collection.find(object).toArray(function(err, docs) {
            // db.close()
            if (err) {
                console.log(err)
                callback({
                    state: '500',
                    result: 'FAIL'
                })
            }
            if (docs.length > 0) {
                callback({
                    state: '200',
                    result: 'SUCCESS',
                    data: docs
                })
            }
            if (docs.length <= 0) {
                callback({
                    state: '200',
                    result: 'FAIL'
                })
            }
        })
    })
}

exports.insertOne = function (collectName ,object, callback) {
    console.log(object)
    connectMongoDb(function (db) {
        let collection = db.collection(collectName)
        collection.find({name: object.name}).toArray(function(err, docs) {
            if (err) {
                console.log(err)
                callback({
                    state: '500',
                    result: 'FAIL'
                })
            }
            if (docs.length > 0) {
                callback({
                    state: '200',
                    result: 'FAIL'
                })
            }
            if (docs.length <= 0) {
                collection.insertOne(object, function (err, docs) {
                    if (err) {
                        callback({
                            state: '404',
                            result: 'FAIL'
                        })
                        return false
                    }
                    callback({
                        state: '200',
                        result: 'SUCCESS',
                        data: docs
                    })
                })
            }
        })
    })
}

exports.insertPublish = function (collectName, object, callback) {
    connectMongoDb(function (db) {
        let collection = db.collection(collectName)
        collection.insertOne(object, function (err, docs) {
            if (err) {
                callback({
                    status: 404,
                    result: 'FAIL'
                })
                return false
            }
            callback({
                state: '200',
                result: 'SUCCESS',
                data: docs
            })
        })
    })
}
exports.findPublish = function (collectName, object, callback) {
    connectMongoDb(function (db) {
        let collection = db.collection(collectName)
        collection.find(object).toArray(function(err, docs) {
            if (err) {
                callback({
                    status: 404,
                    result: 'FAIL'
                })
                return false
            }
            callback(docs)
        })
    })
}

exports.updateBBS = function(collectName, objectId, object, callback) {
    connectMongoDb(function(db) {
        let collection = db.collection(collectName)
        collection.updateMany(objectId, {
            $push: {
                comment: {
                    name: object.name,
                    comment: object.comment
                }
            }
        }, function (err, result) {
            if (err) {
                callback({
                    status: 404,
                    result: 'FAIL'
                })
            }
            callback(result)
        })
    })
}