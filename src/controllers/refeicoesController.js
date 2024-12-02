const refeicoes = require('../models/refeicoesModel.js')
const alimentos = require('../models/alimentosModel.js')

var diasSemana = [
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
    "domingo"
]

var todasRefeicoes = [
    "cafe da manha",
    "lanche da manha",
    "almoco",
    "lanche da tarde",
    "jantar"
]

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

function formatarRefeicaoHoras(hora){
    if(hora >= 6 && hora <= 9){
        return 'cafe da manha'
    }

    if(hora >= 10 && hora <= 11){
        return 'lanche da manha'
    }

    if(hora >= 12 && hora <= 13){
        return 'almoco'
    }

    if(hora >= 14 && hora <= 17){
        return 'lanche da tarde'
    }

    if(hora >= 18 && hora <= 23){
        return 'jantar'
    }

}

function formatarDia(dia) {
    switch(dia) {
        case 0: return 'domingo';
        case 1: return 'segunda';
        case 2: return 'terca';
        case 3: return 'quarta';
        case 4: return 'quinta';
        case 5: return 'sexta';
        case 6: return 'sabado';
        default: return 'dia nao definido';
    }
}

function ordenarRefeicoes(refeicoes) {
    return refeicoes.sort((a, b) => {
        return todasRefeicoes.indexOf(a.refeicao) - todasRefeicoes.indexOf(b.refeicao);
    });
}

/* REFEICOES */

async function lerRefeicaoAgora(req,res){
    try{
        const data = new Date()
        const hora = data.getHours()
        const dia = data.getDay()

        const lendoRefeicaoAgora = await refeicoes.find({
            'dia':formatarDia(dia),
            'refeicao':formatarRefeicaoHoras(hora)
        }).populate('alimentos')

        try{
            return res.status(200).send(lendoRefeicaoAgora[0])
        }catch(error){
            return res.status(400).send(error)
        }

    }catch(error){
        res.status(500).json({
            message:'Erro de servidor'
        })
        console.error(error)
    }
}

async function lerRefeicoesHoje(req,res){
    try{
        const data = new Date()
        let diaHoje = data.getDay()

        const lendoRefeicoesHoje = await refeicoes.find({ 
            'dia': formatarDia(diaHoje) 
        }).populate('alimentos')

        const refeicoesOrdenadas = ordenarRefeicoes(lendoRefeicoesHoje);

        res.status(200).json(refeicoesOrdenadas);

    }catch(error){
        res.status(500).json({
            message:'Erro de servidor'
        })
        console.error(error)
    }
}

async function filtrarRefeicoes(req,res){
    try{
        const dia = req.params.dia;

        const grp = await refeicoes.find({ 'dia': dia }).populate('alimentos');

        const refeicoesOrdenadas = ordenarRefeicoes(grp);

        return res.status(200).json(refeicoesOrdenadas);

    }catch(error){
        res.status(500).json('Erro de servidor')
        console.log(error)
    }
}

async function lerRefeicoes(req,res){
    try{
        const lendoRefeicoes = await refeicoes.find();

        const refeicoesOrdenadas = ordenarRefeicoes(lendoRefeicoes);

        res.status(200).json(refeicoesOrdenadas);

    }catch(error){
        res.status(500).json({
            message:'Erro de servidor'
        })
        console.error(error)
    }
}

async function lerRefeicoesID(req,res){
    try{
        const id = req.params.id
        const lendoRefeicoesID = await refeicoes.findById(id).populate('alimentos')

        res.status(200).json(lendoRefeicoesID)

    }catch(error){
        res.status(500).json('Erro de servidor')
        console.log(error)

    }
}

async function criarRefeicoes(req,res){
    try{
        const { refeicao, dia, alimentos:alimentosIds } = req.body

        if (!refeicao || !dia || !alimentosIds || !Array.isArray(alimentosIds)) {
            return res.status(400).send('Insira os campos restantes');
        }

        const cadaDiaSemana = diasSemana.some(d => d === dia)
        const cadaRefeicao = todasRefeicoes.some(r => r === refeicao)

        if(!cadaDiaSemana){
            return res.status(404).send("Voce so pode adicionar os dias das semanas: segunda,terca,quarta,quinta,sexta,sabado,domingo")
        }

        if(!cadaRefeicao){
            return res.status(404).send("Refeicoes disponiveis: cafe da manha, lanche da manha, almoco, lanche da tarde, jantar")
        }

        const refeicaoExistente = await refeicoes.findOne({ dia, refeicao });
        if (refeicaoExistente) {
            return res.status(400).json({
                message: `A refeição "${refeicao}" para "${dia}" já existe`
            });
        }
        
        const validAlimentos = await alimentos.find({ '_id': { $in: alimentosIds } })
        
        if (validAlimentos.length !== alimentosIds.length) {
            return res.status(400).json({
                message: 'Alguns IDs de alimentos são inválidos'
            })
        }
        
        const novaRefeicao = new refeicoes({
            refeicao,
            dia,
            alimentos: alimentosIds
        })
        
        await novaRefeicao.save()

        res.status(201).json({
            message:`${refeicao} de ${dia} foi adicionado`,
            refeicao:novaRefeicao
        })

    }catch(error){
        res.status(500).send('Erro de servidor')
        console.error(error)
    }
}

async function deletarRefeicoes(req,res){
    try{
        const id = req.params.id
        
        try{
            await refeicoes.findByIdAndDelete(id)
            res.status(200).send('Refeicao deletada com sucesso!')

        }catch(error){
            res.status(404).send('Erro ao deletar refeicao')
            console.log(error)
            
        }

    }catch(error){
        res.status(500).json({
            message:'Erro de servidor'
        })
        console.error(error)
    }
}

/* ALIMENTOS */

async function criarAlimentoEmRefeicao(req, res) {
    try {
        const { idRefeicao, idAlimento } = req.params

        if (!idAlimento || !idRefeicao) {
            return res.status(400).send('O campo idAlimento ou ID é obrigatório');
        }

        const alimento = await alimentos.findById(idAlimento);
        if (!alimento) {
            return res.status(404).send('Alimento não encontrado');
        }

        const refeicao = await refeicoes.findById(idRefeicao);
        if (!refeicao) {
            return res.status(404).send('Refeição não encontrada');
        }

        refeicao.alimentos.push(alimento._id);
        await refeicao.save();

        res.status(201).json({
            message: 'Alimento adicionado com sucesso',
            refeicao: await refeicao.populate('alimentos')
        });

    } catch (error) {
        res.status(500).send('Erro de servidor');
        console.error(error);
    }
}

async function atualizarAlimentoEmRefeicao(req, res) {
    try {
        const { idRefeicao, idAlimento } = req.params;
        const { alimento, grupo } = req.body;

        if (!alimento || !grupo) {
            return res.status(400).send('Os campos alimento e grupo são obrigatórios');
        }

        const cadaGrupo = gruposAlimentos.some(g => g === grupo)

        if(!cadaGrupo){
            return res.status(400).json({
                message:'Insira o alimento algum desses grupos',
                opcoes:'cerais,vegetais,proteinas,leguminosas,frutas,laticinios,gorduras,doces'  
            })
        }

        const alimentoAtualizado = await alimentos.findByIdAndUpdate(
            idAlimento,
            { alimento, grupo },
            { new: true }
        );

        if (!alimentoAtualizado) {
            return res.status(404).send('Alimento não encontrado');
        }

        const refeicaoAtualizada = await refeicoes.findById(idRefeicao).populate('alimentos');

        res.status(200).json({
            message: 'Alimento atualizado com sucesso',
            refeicao: refeicaoAtualizada
        });

    } catch (error) {
        res.status(500).send('Erro de servidor');
        console.error(error);
    }
}

async function deletarAlimentoEmRefeicao(req, res) {
    try {
        const { idRefeicao, idAlimento } = req.params;

        const alimentoExistente = await alimentos.findById(idAlimento);

        if (!alimentoExistente) {
            return res.status(404).send('Alimento não encontrado');
        }

        const refeicaoAtualizada = await refeicoes.findByIdAndUpdate(
            idRefeicao,
            { $pull: { alimentos: idAlimento } },
            { new: true }
        ).populate('alimentos');

        res.status(200).json({
            message: 'Alimento deletado com sucesso da refeição',
            refeicao: refeicaoAtualizada
        });

    } catch (error) {
        res.status(500).send('Erro de servidor');
        console.error(error);
    }
}

module.exports = {
    /* REFEICOES */
    filtrarRefeicoes,
    lerRefeicoes,
    lerRefeicaoAgora,
    lerRefeicoesHoje,
    lerRefeicoesID,
    criarRefeicoes,
    deletarRefeicoes,
    /* ALIMENTOS */
    criarAlimentoEmRefeicao,
    atualizarAlimentoEmRefeicao,
    deletarAlimentoEmRefeicao
}