const {getUserInfos} = require('../User')

function deleteLine(req, res) {
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

    if (Object.keys(req.body).length === 0 || !req.body.criteria) {
        return res.status(400).send({
            success: false,
            message: 'Needs at least one parameter'
        })
    }

    user.hoopDB.getTable(req.params.table).then(table => {
        try {
            let criteria = JSON.parse(req.body.criteria)

            table.delete(criteria)
            user.hoopDB.closeTable(table)

            return res.status(201).send({
                success: true,
                message: 'line added successfully',
            })
        } catch(e) {
            return res.status(400).send({
                success: false,
                message: 'Error while parsing JSON',
            })
        }
    }, error => {
        res.status(400).send({
            success: false,
            message: error
        })
    })
}

module.exports = deleteLine