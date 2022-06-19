const mongoose = require('mongoose')

var usersSchema = new mongoose.Schema({
  id: String, // Numero de aluno
  pw: String,
  name: String,
  type: String
})

module.exports = mongoose.model('users', usersSchema)
