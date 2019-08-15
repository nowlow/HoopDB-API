const Hoop = require('hoopdb')
const express = require('express')
const bodyParser = require('body-parser')
const {User, getUserInfos} = require('./User')

const path = require('path')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.post('/hoop/api/connect', (req, res) => {
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

    user = new User(path.join(__dirname, req.body.database), req.body.token)

    if (user.connected === true)
        return res.status(200).send({
            success: true,
            message: 'Successfuly connected user',
            data: user.getToken()
        })
    else
        return res.status(500).send({
            success: false,
            message: 'Error while connecting user'
        })
})

app.get('/hoop/api/getData/:table', function(req, res) {
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
})

app.get('/hoop/api/listTables', function(req, res) {
    let user = getUserInfos(req.header('user-token'))

    if (!user) {
        return res.status(400).send({
            success: false,
            message: 'User is not logged-in'
        })
    }

    user.hoopDB.listTables(req.params.table).then(tables => {
        res.status(200).send({
            success: true,
            message: 'Successfuly get tables',
            data: tables
        })
    }, error => {
        res.status(400).send({
            success: false,
            message: error
        })
    })
})

app.post('/hoop/api/addLine/:table', (req, res) => {
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

        console.log('line :', line)
        table.addLine(line)
        user.hoopDB.closeTable(table)

        return res.status(201).send({
            success: true,
            message: 'line added successfully',
        })
    }, error => {
        res.status(400).send({
            success: false,
            message: error
        })
    })
})

app.post('/hoop/api/addLinePrimary/:table', (req, res) => {
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

    if (Object.keys(req.body).length === 0 || !req.body.contentObject) {
        return res.status(400).send({
            success: false,
            message: 'Needs at least one parameter'
        })
    }

    user.hoopDB.getTable(req.params.table).then(table => {
        try {
            let line = JSON.parse(req.body.contentObject)
            let criteria = (req.body.criteria) ? JSON.parse(req.body.criteria) : null

            table.addLinePrimary(line, criteria)
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
})

app.post('/hoop/api/updateLine/:table', (req, res) => {
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

    if (Object.keys(req.body).length === 0 || !req.body.contentObject || !req.body.criteria) {
        return res.status(400).send({
            success: false,
            message: 'Needs at least one parameter'
        })
    }

    user.hoopDB.getTable(req.params.table).then(table => {
        try {
            let line = JSON.parse(req.body.contentObject)
            let criteria = JSON.parse(req.body.criteria)

            table.updateLine(line, criteria)
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
})

app.post('/hoop/api/delete/:table', (req, res) => {
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
})

app.post('/hoop/api/select/:table', (req, res) => {
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

            let data = table.select(criteria)
            user.hoopDB.closeTable(table)

            return res.status(201).send({
                success: true,
                message: 'Selection successful',
                data: data
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
})

app.post('/hoop/api/selectOnce/:table', (req, res) => {
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

            let data = table.selectOnce(criteria)
            user.hoopDB.closeTable(table)

            return res.status(201).send({
                success: true,
                message: 'Selection successful',
                data: data
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
})

app.post('/hoop/api/selectNot/:table', (req, res) => {
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

            let data = table.selectNot(criteria)
            user.hoopDB.closeTable(table)

            return res.status(201).send({
                success: true,
                message: 'Selection successful',
                data: data
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
})

app.get('/hoop/api/truncate/:table', (req, res) => {
    let user = getUserInfos(req.header('user-token'))

    if (!user) {
        return res.status(400).send({
            success: false,
            message: 'User is not logged-in'
        })
    }

    user.hoopDB.getTable(req.params.table).then(table => {
        try {
            table.truncate()

            return res.status(201).send({
                success: true,
                message: 'Table turncrated successfuly'
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
})

const port = 6942

app.listen(port, function() {
    console.log('Server running [*:' + port + ']')
})