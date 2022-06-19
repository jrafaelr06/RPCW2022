const Notifications = require('../models/notifications')

module.exports.insert = data => {
  var newNotification = new Notifications(data)
  return newNotification.save()
}

module.exports.findall = () => {
  return Notifications
    .find()
    .exec()
}

module.exports.findByUC = (uc) => {
  return Notifications
    .find({ uc })
    .exec()
}

module.exports.remove = (id) => {
  return Notifications
    .deleteOne({ id })
    .exec()
}
