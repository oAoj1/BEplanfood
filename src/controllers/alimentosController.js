const alimentos = require('../models/alimentosModel.js')

var gruposAlimentos = [
    "cereais",
    "vegetais",
    "frutas",
    "leguminosas",
    "proteinas",
    "laticinios",
    "gorduras",
    "doces"
]

async function filtrarAlimentos(req,res){
    try{
        const grupo = req.query.grupo;
        const grupoValido = gruposAlimentos.some(g => g === grupo);

        if (!grupoValido) {
            return res.status(400).json({
                message: 'Insira o alimento em algum desses grupos',
                opcoes: 'cerais, vegetais, proteinas, leguminosas, frutas, laticinios, gorduras, doces'
            })
        }

        const grp = await alimentos.find({ 'grupo': grupo }).sort({alimento:1})
        return res.json(grp)

    }catch(error){
        res.status(500).json('Erro de servidor')
        console.log(error)
    }
}

async function lerAlimentos(req,res){
    try{
        const lendoAlimentos = await alimentos.find()
        res.status(200).json(lendoAlimentos)

    }catch(error){
        res.status(500).json({
            message:'Erro de servidor',
            erro:error
        })
    }
}

async function lerAlimentoID(req,res){
    try{
        const id = req.params.id
        const lendoAlimentoID = await alimentos.findById(id)

        res.status(200).send(lendoAlimentoID)

    }catch(error){
        res.status(500).json('Erro de servidor')
        console.log(error)

    }
}

async function criarAlimento(req,res){
    try{
        const { alimento, grupo } = req.body

        if(!alimento || !grupo){
            return res.status(400).send('Preencha os campos restantes')
        }

        const grupoValido = gruposAlimentos.some(g => g === grupo)

        if(!grupoValido){
            return res.status(400).json({
                message:'Insira o alimento algum desses grupos',
                opcoes:'cerais,vegetais,proteinas,leguminosas,frutas,laticinios,gorduras,doces'  
            })
        }

        const novoAlimento = new alimentos({
            alimento,
            grupo
        })

        await novoAlimento.save()

        res.status(200).json({
            message:`${alimento} foi inserido no banco com sucesso`,
            alimento:novoAlimento
        })

    }catch(error){
        res.status(500).json('Erro de servidor')
        console.log(error)
    }
}

async function editarAlimento(req,res){
    try{
        const id = req.params.id
        const value = req.body
    
        const grupoValido = gruposAlimentos.some(g => g === value.grupo)

        if(!grupoValido){
            return res.status(400).json({
                message:'Insira o alimento algum desses grupos',
                opcoes:'cerais,vegetais,proteinas,leguminosas,frutas,laticinios,gorduras,doces'  
            })
        }

        try{
            await alimentos.findByIdAndUpdate(id,{$set: value})
            res.status(200).send('Alimento atualizado com sucesso!')

        }catch(error){
            res.status(404).send('Erro ao atualizar alimento')
            console.error(error)
        }

    }catch(error){
        res.status(500).send('Erro de servidor')
        console.error(error)
    }
}

async function deletarAlimento(req,res){
    try{
        const id = req.params.id

        try{
            await alimentos.findByIdAndDelete(id)
            res.status(200).send('Alimento deletado com sucesso!')

        }catch(error){
            res.status(404).send('Erro ao deletar alimento')
            console.error(error)
        }

    }catch(error){
        res.status(500).send('Erro de servidor')
        console.error(error)
    }
}
module.exports = {
    filtrarAlimentos,
    lerAlimentos,
    lerAlimentoID,
    criarAlimento,
    editarAlimento,
    deletarAlimento
}