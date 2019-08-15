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

        openDbs.forEach(db => {
            if (db.hoopDBPath === _this.hoopDBPath) {
                if (db.token === _this.hoopDBToken) {
                    _this.hoopDB = db
                } else {
                    _this.hoopDB = 'cheater'
                }
                return
            }
        })

        if (this.hoopDB === null) {
            this.hoopDB = new Hoop(this.hoopDBPath)
            this.hoopDB.connect(this.hoopDBToken)

            openDbs.push(this.hoopDB)
        }

        if (this.hoopDB !== 'cheater') {
            this.connected = true
            this.userToken = uuidv4()
            connectedUsers.push(this)
        }

        this.getToken = function() {
            return this.userToken
        }

    }
}

module.exports.getUserInfos = getUserInfos
module.exports.User = User