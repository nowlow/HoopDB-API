const {getUserInfos} = require('../User')
const {encode} = require('hoopdb/HoopCode')

function getData(req, res) {
    let user = getUserInfos(req.header('user-token'))

    if (!user) {
        return res.status(400).send({
            success: false,
            message: 'User is not logged-in'
        })
    }

    user.hoopDB.getTable(req.params.table).then(table => {
        res.status(200).send(encode(JSON.stringify({
            success: true,
            message: 'Successfuly get ' + req.params.table + ' table content',
            data: table.getData()
        }), user.getEncryptionToken()))
    }, error => {
        res.status(400).send(encode(JSON.stringify({
            success: false,
            message: error
        }), user.getEncryptionToken()))
    })
}

module.exports = getData