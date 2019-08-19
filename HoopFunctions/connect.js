const {User, getUserInfos} = require('../User')
const path = require('path')

function connect(req, res) {
    let user = getUserInfos(req.header('user-token'))

    if (user) {
        return res.status(400).send({
            success: true,
            message: 'User is logged-in'
        })
    }

    if (req.header('Content-Type') !== 'application/x-www-form-urlencoded') {
        return res.status(400).send({
            success: false,
            message: 'Wrong Content-Type'
        })
    }

    if (!req.body.database) {
        return res.status(400).send({
            success: false,
            message: 'No database name provided'
        })
    }
    if (!req.body.token) {
        return res.status(400).send({
            success: false,
            message: 'No token provided'
        })
    }

    user = new User(path.join(__dirname, path.join('..', req.body.database)), req.body.token)

    user.connect().then(() => {
        res.setHeader('Access-Control-Allow-Origin','*') 
        return res.status(200).send({
            success: true,
            message: 'Successfuly connected user',
            data: {
                "user-token": user.getToken(),
                "encryption-token": user.getEncryptionToken()
            }
        })
    }, error => {
        return res.status(500).send({
            success: false,
            message: 'Error while connecting user'
        })
    })
}

module.exports = connect