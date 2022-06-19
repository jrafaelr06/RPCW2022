const Recursos = require('../models/recursos')

module.exports.listar = () => {
    return Recursos
        .find()
        .exec()
}

module.exports.listarPorUC = (uc) => {
    return Recursos
        .find({uc})
        .exec()
}

module.exports.consultar = (id) => {
    return Recursos
        .findOne({ _id: id })
        .exec()
}

module.exports.insert = (meta) => {
    let newRecurso = new Recursos(meta) // cria um objecto q abstrai o objeto com a schema
    return newRecurso.save()
}

module.exports.update = (id, data) => {
    let obj = this.consultar(id)
    obj.title = data.title
    return obj.save()
}

module.exports.delete = (id) => {
    return Recursos
        .deleteOne({ _id:id })
        .exec()
}