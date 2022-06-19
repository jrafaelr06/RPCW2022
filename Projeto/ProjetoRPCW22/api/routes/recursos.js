var express = require('express');
var router = express.Router();
const Recursos = require('../controllers/recursos')

router.get('/', (req, res) => {
  Recursos.listar()
    .then(dados => {
      if (req.query['tipo']) {
        dados = dados.filter(a => a.tipo == req.query['tipo'])
      } else if (req.query['q']) {
        dados = dados.filter(a => a.title.includes(req.query['q']))
      } else if (req.query['uc']) {
        dados = dados.filter(a => a.uc == req.query['uc'])
      }
      res.status(200).jsonp(dados)
    })
    .catch(err => {
      res.status(500).jsonp({ error: err })
    })
})

router.get('/:id', (req, res) => {
  Recursos.consultar(req.params.id)
    .then(dados => {
      res.status(200).jsonp(dados)
    })
    .catch(err => {
      res.status(501).jsonp({ error: err })
    })
})

router.post('/', (req, res) => {
  Recursos.insert(req.body)
    .then(data => {
      res.status(200).jsonp(data)
    })
    .catch(err => {
      res.status(502).jsonp({ error: err })
    })
});

router.put('/:id', (req, res) => {
  Recursos.update(req.params.id, req.body)
    .then(dados => {
      res.status(200).jsonp(dados)
    })
    .catch(err => {
      res.status(503).jsonp({ error: err })
    })
})

router.delete('/:id',  (req, res) => {
  Recursos.delete(req.params.id)
    .then(dados => {
      res.status(200).jsonp(dados)
    })
    .catch(err => {
      res.status(504).jsonp({ error: err })
    })
})

module.exports = router;