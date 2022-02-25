var http = require('http')
var fs = require('fs')

myServer = http.createServer(function (req, res) {
    myUrl = "./arquivos/"
    fields = req.url.slice(1).split("/")
    
    if (fields[0] === "filmes") {
        if(fields.length === 2) {
            myUrl += fields[1] + ".html"
        } else {
            myUrl += "index.html"
        }
    } else if (fields[0] === "atores") {
        if (fields.length === 2) {
            myUrl += fields[1] + ".html"
        } else {
            myUrl += "atores.html"
        }
    }

    fs.readFile(myUrl, function (err, data) {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        if (err) {
            res.write("<p>Erro na leitura de ficheiro</p>")
        } else {
            res.write(data)
        }
        res.end()
    })
})

myServer.listen(7777)
console.log("Servidor à escuta na porta 7777...")