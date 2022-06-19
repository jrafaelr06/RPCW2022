const mongoose = require('mongoose')

var classesSchema = new mongoose.Schema({
  name: String,
  year: Number,
  semester: Number,
  professors: [String],
  students: [String]
})

module.exports = mongoose.model('classes', classesSchema)
