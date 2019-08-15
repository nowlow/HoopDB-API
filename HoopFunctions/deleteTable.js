const {getUserInfos} = require('../User')

function deleteTable(req, res) {
    let user = getUserInfos(req.header('user-token'))

    if (!user) {
        return res.status(400).send({
            success: false,
            message: 'User is not logged-in'
        })
    }

    if (user.hoopDB.deleteTable(req.params.table))
        return res.status(201).send({
            success: true,
            message: 'Table deleted successfully'
        })
    else
        return res.status(400).send({
            success: false,
            message: 'Table do not exists',
        })
}

module.exports = deleteTable