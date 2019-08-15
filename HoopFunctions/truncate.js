const {getUserInfos} = require('../User')

function truncate(req, res) {
    let user = getUserInfos(req.header('user-token'))

    if (!user) {
        return res.status(400).send({
            success: false,
            message: 'User is not logged-in'
        })
    }

    user.hoopDB.getTable(req.params.table).then(table => {
        table.truncate()

        return res.status(201).send({
            success: true,
            message: 'Table turncrated successfuly'
        })
    }, error => {
        res.status(400).send({
            success: false,
            message: error
        })
    })
}

module.exports = truncate