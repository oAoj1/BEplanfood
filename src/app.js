require('dotenv').config()

/*  */

const express = require('express')
const app = express()

/*  */

const cors = require('cors')
const bodyParser = require('body-parser')

/*  */

const dbConnections = require('./config/mongoDBConnection.js')

/*  */

const alimentosRoute = require('./routes/alimentosRoute.js')
const refeicoesRoute = require('./routes/refeicoesRoute.js')

/*  */

const port = process.env.PORT

/*  */

app.use(
    cors(),
    express.json(),
    bodyParser.json(),
    alimentosRoute,
    refeicoesRoute
)

/*  */

app.listen(port, () => {
    console.log(`Servidor aberto http://localhost:${port}`)
})

app.get('/', (req,res) => {
    res.send('plan food')
})

/*  */

dbConnections.once('open', () => {
    console.log('MongoDB conectado')
}) 

dbConnections.on('error', () => {
    console.log('Erro ao conectar com mongodb')
})

