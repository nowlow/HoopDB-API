const {getUserInfos} = require('../User')

function getData(req, res) {
    let user = getUserInfos(req.header('user-token'))

    if (!user) {
        return res.status(400).send({
            success: false,
            message: 'User is not logged-in'
        })
    }

    user.hoopDB.getTable(req.params.table).then(table => {
        res.status(200).send({
            success: true,
            message: 'Successfuly get ' + req.params.table + ' table content',
            data: table.getData()
        })
    }, error => {
        res.status(400).send({
            success: false,
            message: error
        })
    })
}

module.exports = getData