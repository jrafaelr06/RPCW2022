const axios = require('axios');
var express = require('express');
const multer = require('multer');
const fs = require('fs');

var router = express.Router();
const upload = multer({dest: 'routes/uploads'});

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

router.get('/remove/:id', function(req, res) {
	axios.delete('http://localhost:3000/files/' + req.params.id)
		.then(function(resp) {
			console.log("Ficheiro removido")
			res.redirect('/')
		})
		.catch(function (error) {
			res.render('error', {error: error})
		})
})

router.get('/file/:id', function(req, res) {
	var d = new Date().toISOString().substring(0, 16)
	axios.get('http://localhost:3000/files/' + req.params.id)
		.then(function(resp) {
			let path = __dirname + '\\fileStore\\' + resp.data.name
			res.render('file', {file: resp.data, data: d, path: path})
		})
		.catch(function (error) {
			res.render('error', {error: error})
		})
})

/* POST home page. */
router.post('/files', upload.single('myFile'), function(req, res) {
	let path = req.file.path.substring(7, )
	let oldPath = __dirname + '/' + path
	let newPath = __dirname + '/fileStore/' + req.file.originalname

	fs.rename(oldPath, newPath, erro => {
		if (erro) {
			throw erro;
		}
	})

	var d = new Date().toISOString().substring(0, 16)

	console.log(req.body)

	axios.post('http://localhost:3000/files', {
		"date": d,
		"name": req.file.originalname,
		"mimetype": req.file.mimetype,
		"size": req.file.size,
		"descricao": req.body.description
	})
		.then(function(resp) {
			console.log(resp.data)
			res.redirect('/')
		})
		.catch(function(erro) {
			res.render('error', {error: erro})
		})
})

module.exports = router;
