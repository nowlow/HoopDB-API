const {getUserInfos} = require('../User')

function addLine(req, res) {
    let user = getUserInfos(req.header('user-token'))

    if (!user) {
        return res.status(400).send({
            success: false,
            message: 'User is not logged-in'
        })
    }

    if (req.header('Content-Type') !== 'application/x-www-form-urlencoded') {
        return res.status(400).send({
            success: false,
            message: 'Wrong Content-Type'
        })
    }

    if (Object.keys(req.body).length === 0) {
        return res.status(400).send({
            success: false,
            message: 'Needs at least one parameter'
        })
    }

    user.hoopDB.getTable(req.params.table).then(table => {
        let line = req.body

        table.addLine(line)
        
        user.hoopDB.closeTable(table)
        res.status(201).send({
            success: true,
            message: 'line added successfully',
        })
        return
    }, error => {
        res.status(400).send({
            success: false,
            message: error
        })
    })
}

module.exports = addLine