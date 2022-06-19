const mongoose = require('mongoose')

var notificationSchema = new mongoose.Schema({
  title: String,
  content: String,
  sender: String,
  uc: String
})

module.exports = mongoose.model('notifications', notificationSchema)
