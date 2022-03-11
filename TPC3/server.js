var http = require('http')
var url = require('url')
var axios = require('axios')

// Função que gera o HTML para a página principal
function generateMainPage() {
    return `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Página Principal</title>
        </head>
        <body>
            <h1>Escola de Música</h1>
            <ul>
                <li><a href="http://localhost:4000/alunos">Lista de Alunos</a<</li>
                <li><a href="http://localhost:4000/cursos">Lista de Cursos</a<</li>
                <li><a href="http://localhost:4000/instrumentos">Lista de Instrumentos</a<</li>
            </ul>
        <body>
    </html>`
}

// Pedido de get
function get(url_get) {
    var r = ""
    axios.get('http://localhost:3000' + url_get)
        .then(function (resp) {
            pubs = resp.data
            r += "<table>"
            pubs.forEach(p => {
                r += `<tr><th>${p.id}</th><th>${p.nome}</th></tr>`
            })
            r += "</table>"
            console.log(r)
        })
        .catch(function (error) {
            console.log("Erro: " + error)
            r = "<p>Erro: " + error + "</p>"
        })
    console.log(r)
    return r
}

// Criação do servidor
myServer = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
    var myUrl = url.parse(req.url, true).pathname

    if (myUrl === "/") {
        res.write(generateMainPage())
    } else if (myUrl === "/alunos") {
        console.log(get(myUrl))
        res.write(get(myUrl))
    } else if (myUrl === "/cursos") {
        res.write("<p>Página com tabela de cursos</p>")
    } else if (myUrl === "/instrumentos") {
        res.write("<p>Página com tabela de instrumentos</p>")
    } else {
        res.write("<p>Rota " + myUrl + " não suportada </p>")
    }

    res.end()
})

myServer.listen(4000)
console.log("Servidor à escuta na porta 4000...")