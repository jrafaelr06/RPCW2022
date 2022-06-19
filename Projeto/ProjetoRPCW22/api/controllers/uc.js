const UC = require('../models/uc')

module.exports.insert = data => {
    var newClass = new UC(data)
    return newClass.save()
}

module.exports.findByUser = (user) => {
    return UC
        .find({$or: [{students: user}, {professors: user}]})
        .exec()
}

module.exports.findall = () => {
    return UC
        .find()
        .exec()
}

module.exports.remove = (name) => {
    return UC
        .deleteOne({ name })
        .exec()
}

module.exports.find = (name) => {
    return UC
        .findOne({ name })
        .exec()
}

module.exports.removeStudent = (studentID) => {
    return UC.updateMany({}, {
        $pull: {
            students: studentID,
            professors: studentID
        }
    }).exec()
}

module.exports.removeStudentFromUC = (studentID, uc) => {
    return UC.updateMany(
        { name: uc },
        { $pull: {
            students: studentID,
            professors: studentID
        }}
    ).exec()
}

module.exports.addUser = (userID, userType, className) => {
    if (userType == "professor" || userType == "admin") {
        return UC.findOneAndUpdate(
            { name: className },
            { $push: { professors: userID } }
        ).exec()
    } else {
        return UC.findOneAndUpdate(
            { name: className },
            { $push: { students: userID } }
        )
    }
}
