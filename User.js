const Hoop = require('hoopdb')
const uuidv4 = require('uuid/v4')

let openDbs = []
let connectedUsers = []

function getUserInfos(userToken) {
    if (!userToken) return null

    let list = connectedUsers.filter(user => user.userToken === userToken)

    if (!list || !list[0] || list.length > 1)
        return null
    return list[0]
}

class User {
    constructor(db, token) {
        const _this = this

        this.hoopDBPath = db
        this.hoopDBToken = token
        this.hoopDB = null

        this.connected = false

        this.userToken = null

        this.connectionOk = function(resolve) {
            this.connected = true
            this.userToken = uuidv4()
            connectedUsers.push(this)
            resolve(true)
        }

        this.badConnection = function(reject, error) {
            reject(error)
        }

        this.connect = function() {
            return new Promise(function(resolve, reject) {
                openDbs.forEach(db => {
                    if (db.hoopDBPath === _this.hoopDBPath) {
                        if (db.token === _this.hoopDBToken) {
                            _this.hoopDB = db
                            _this.connectionOk(resolve)
                        } else _this.badConnection(reject, "Can't connect to database")
                        return
                    }
                })

                if (_this.hoopDB === null) {
                    _this.hoopDB = new Hoop(_this.hoopDBPath)
                    _this.hoopDB.connect(_this.hoopDBToken).then(connected => {
                        openDbs.push(_this.hoopDB)
                        _this.connectionOk(resolve)
                    }, error => {
                        _this.badConnection(reject, error)
                    })
                }
            })
        }

        this.getToken = function() {
            return this.userToken
        }

    }
}

module.exports.getUserInfos = getUserInfos
module.exports.User = User