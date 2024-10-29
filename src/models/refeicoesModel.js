const mongoose = require('mongoose')

const refeicoesSchema = new mongoose.Schema({
    id:String,
    refeicao:{type:String,required:true},
    dia:{type:String,required:true},
    alimentos:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'alimentos',
            required: true
        }
    ]
})

const refeicoes = mongoose.model('refeicoes',refeicoesSchema)

module.exports = refeicoes