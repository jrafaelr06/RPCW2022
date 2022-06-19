const Users = require('../models/users')

module.exports.insert = data => {
    var newUser = new Users(data)
    return newUser.save()
}

module.exports.findall = () => {
    return Users
        .find()
        .exec()
}

module.exports.remove = (id) => {
    return Users
        .deleteOne({ id })
        .exec()
}

module.exports.find = (id) => {
    return Users
        .findOne({ id })
        .exec()
}