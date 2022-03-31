const axios = require('axios');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	var d = new Date().toISOString().substring(0, 16)
	axios.get("http://localhost:3000/files")
		.then(response => {
			var lista = response.data
			res.render('files', {files: lista, data: d})
		})
		.catch(erro => {
			res.render('error', {error: erro})
		})
});

module.exports = router;
