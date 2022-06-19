module.exports.checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/auth/login')
}
  
module.exports.checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}
  
module.exports.isAdmin = (req, res, next) => {
    if (req.user.type === "admin") {
        return next()
    }
    res.redirect('/auth/login')
}

module.exports.isProfessor = (req, res, next) => {
    if (req.user.type === "admin" || req.user.type === "professor") {
        return next()
    }
    res.redirect('/auth/login')
}
