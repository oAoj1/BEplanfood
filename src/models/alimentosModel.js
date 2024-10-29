const mongoose = require('mongoose')

const alimentosSchema = new mongoose.Schema({
    id:String,
    alimento:{type:String,required:true},
    grupo:{type:String,required:true}
})

const alimentos = mongoose.model('alimentos',alimentosSchema)

module.exports = alimentos