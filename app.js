const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

let HoopFunctions = {
    addLine: require('./HoopFunctions/addLine'),
    addLinePrimary: require('./HoopFunctions/addLinePrimary'),
    connect: require('./HoopFunctions/connect'),
    delete: require('./HoopFunctions/delete'),
    deleteTable: require('./HoopFunctions/deleteTable'),
    getData: require('./HoopFunctions/getData'),
    listTables: require('./HoopFunctions/listTables'),
    select: require('./HoopFunctions/select'),
    selectNot: require('./HoopFunctions/selectNot'),
    selectOnce: require('./HoopFunctions/selectOnce'),
    truncate: require('./HoopFunctions/truncate'),
    updateLine: require('./HoopFunctions/updateLine')
}

app.post('/hoop/api/connect', HoopFunctions.connect)
app.get('/hoop/api/getData/:table', HoopFunctions.getData)
app.get('/hoop/api/listTables', HoopFunctions.listTables)
app.post('/hoop/api/addLine/:table', HoopFunctions.addLine)
app.post('/hoop/api/addLinePrimary/:table', HoopFunctions.addLinePrimary)
app.post('/hoop/api/updateLine/:table', HoopFunctions.updateLine)
app.post('/hoop/api/delete/:table', HoopFunctions.delete)
app.post('/hoop/api/select/:table', HoopFunctions.select)
app.post('/hoop/api/selectOnce/:table', HoopFunctions.selectOnce)
app.post('/hoop/api/selectNot/:table', HoopFunctions.selectNot)
app.get('/hoop/api/truncate/:table', HoopFunctions.truncate)
app.get('/hoop/api/deleteTable/:table', HoopFunctions.deleteTable)

const port = 6942

app.listen(port, function() {
    console.log('Server running [*:' + port + ']')
})