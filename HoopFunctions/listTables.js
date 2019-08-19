const {getUserInfos} = require('../User')

function listTables(req, res) {
    let user = getUserInfos(req.header('user-token'))

    if (!user) {
        return res.status(400).send({
            success: false,
            message: 'User is not logged-in'
        })
    }

    user.hoopDB.listTables(req.params.table).then(tables => {
        res.status(200).send(encode(JSON.stringify({
            success: true,
            message: 'Successfuly get tables',
            data: tables
        }), user.getEncryptionToken()))
    }, error => {
        res.status(400).send(encode(JSON.stringify({
            success: false,
            message: error
        }), user.getEncryptionToken()))
    })
}

module.exports = listTables