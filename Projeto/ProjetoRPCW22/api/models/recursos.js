const mongoose = require('mongoose')

var recursosSchema = new mongoose.Schema({
    _id: String,
    submission_date: String,
    sub_id: String,
    title: String,
    type: String,
    uc: String
})

module.exports = mongoose.model('recursos', recursosSchema)