const LocalStrategy = require('passport-local')
const axios = require('axios')

function authenticateUser(id, pw, done) {
    axios.get('http://localhost:3011/api/users/' + id)
        .then(user => {
            if (user.data == null) {
                return done(null, false, { message: 'Utilizador inexistente!' })
            }
            if (user.data.pw == pw) {
                return done(null, user.data)
            }
            return done(null, false, { message: 'Palavra passe incorreta' })
        })
        .catch(error => { return done(error) }) 
}

function initialize(passport) {
    passport.use(new LocalStrategy({ usernameField: 'id', passwordField: 'pw' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        axios.get('http://localhost:3011/api/users/' + id)
            .then(user => {
                done(null, user.data)
            })
    })
}

module.exports = initialize
