const http = require('http')
const axios = require('axios')

function geraPag(feitas, d) {
    let pagHTML = `
    <html>
        <head>
            <title>TO-DO LIST</title>
            <meta charset="utf-8"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
            <div class="w3-container w3-teal>
                <h2>Lista de tarefas feitas<h2>
            </div>
            <ul class="w3-ul w3-border">`

    feitas.forEach(f => {
        pagHTML += `
                <li>${a.description}</li>`
    })

    pagHTML += `
            </ul>
            <div class="w3-container w3-teal>
                <address>Gerado por server::RPCW2022 em ${d}</address>
            </div>
        </body>
    </html>`

    return pagHTML
}

var myServer = http.createServer(function (req, res){
    var date = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + date)

    switch(req.method) {
        case "GET":
            if (req.url == "/") {
                axios.get("http://localhost:3000/feitas")
                    .then(response => {
                        var feitas = response.data
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write(geraPag(feitas, date))
                        res.end()
                    })
                    .catch(function (error) {
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write("<p>Não foi possível obter a lista de tarefas feitas...</p>")
                        res.end()
                    })
            }
            break
        case "POST":
            break
        default:
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write('<p>' + req.method + 'não suportado neste serviço.</p>')
            res.end()
    }
}) 

myServer.listen(7777)
console.log('Servidor à escuta na porta 7777...')