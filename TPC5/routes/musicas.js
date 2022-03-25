var express = require('express');
var router = express.Router();
const axios = require('axios');
const { response } = require('express');

/* GET home page. */
router.get('/', function(req, res, next) {
	axios.get('http://localhost:3000/musicas')
		.then(response => {
			let lista = response.data
			res.render('musicas', {musicas: lista})
		})
		.catch(function (erro) {
			res.render('error', {error: erro})
		})
});

router.get('/inserir', function (req, res, next) {
    res.render('registo')
})

router.get('/:id', function (req, res, next) {
    axios.get('http://localhost:3000/musicas/' + req.params.id)
        .then(response => {
            var m = response.data
            res.render('musica', {musica: m})
        })
        .catch(function (erro) {
            res.render('error', {error: erro})
        })
})

router.get('/prov/:idProv', function (req, res, next) {
    axios.get('http://localhost:3000/musicas?prov=' + req.params.idProv)
        .then(response => {
            var lista = response.data
            res.render('musicas', {musicas: lista})
        })
        .catch(function (erro){
            res.render('error', {error: erro})
        })
})

/* POST home page. */
router.post('/inserir', function (req, res, next) {
    axios.post('http://localhost:3000/musicas', req.body)
        .then(resp => {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
            res.write("<p>POST realizado com sucesso</p>")
            res.write('<p><a href="/">VOLTAR</a></p>')
            res.end()
        })
        .catch(erro => {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
            res.write("<p>Erro no POST: " + erro + "</p>")
            res.write('<p><a href="/">VOLTAR</a></p>')
        })
})

module.exports = router;
