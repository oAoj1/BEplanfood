require('dotenv').config()

const mongoose = require('mongoose')

const mongoDbConnection = mongoose.connect(process.env.CONEXAO_DATABASE) 

const dbConnections = mongoose.connection

module.exports = dbConnections
