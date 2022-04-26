var express = require('express');
var Para = require('../controllers/para')
var router = express.Router();

/* GET home page. */
router.get('/paras', function(req, res) {
	Para.listar()
		.then(dados => {
			res.status(200).jsonp(dados)
		})
		.catch(e => {
			res.status(500).jsonp({erro: e})
		})
});

router.post('/paras', function(req, res) {
	Para.inserir(req.body)
		.then(dados => {
			res.status(201).jsonp(dados)
		})
		.catch(e => {
			res.status(501).jsonp({erro: e})
		})
})

module.exports = router;
