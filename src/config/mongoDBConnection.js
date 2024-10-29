require('dotenv').config()

const mongoose = require('mongoose')

mongoose.connect('"mongodb+srv://joao:123@cluster0.elloss6.mongodb.net/planfood-colecoes"') 

const dbConnections = mongoose.connection

module.exports = dbConnections
