const http = require('http')
const axios = require('axios')
const static = require('./static')
const {parse} = require('querystring')
var change = false

function recuperaInfo(req, callback) {
    if (req.headers['content-type'] == 'application/x-www-form-urlencoded') {
        let body = ''
        req.on('data', block => {
            body += block.toString()
        })
        req.on('end', () => {
            console.log(body)
            callback(parse(body))
        })
    }
}

function geraPag(feitas, por_fazer, d) {
    let pagHTML = `
    <html>
        <head>
            <title>TO-DO LIST</title>
            <meta charset="utf-8"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
            <div class="w3-container w3-teal">
                <h1>TO-DO LIST</h1>
                <h2 id="txt">Adicionar uma tarefa</h2>
            </div>
            <button id="btn" class="w3-btn w3-black" onclick="change()">Alterar uma tarefa</button>

            <script>
                function change() {
                    var txt = document.getElementById("txt")
                    var fm = document.getElementById("fm")
                    var btn = document.getElementById("btn")

                    if (fm.action == "http://localhost:7777/") {
                        fm.action = "http://localhost:7777/alterar"
                        txt.innerText = "Alterar uma tarefa"
                        btn.innerText = "Adicionar uma tarefa"
                    } else {
                        fm.action = "http://localhost:7777"
                        txt.innerText = "Adicionar uma tarefa"
                        btn.innerText = "Alterar uma tarefa"
                    }
                }
            </script>

            <form id="fm" class="w3-container" action="" method="POST">
                <label class="w3-text-teal"><b>Deadline (YYYY-MM-DD)</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="dateDued">
        
                <label class="w3-text-teal"><b>Who is supposed to do it</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="who">
        
                <label class="w3-text-teal"><b>Task Decription</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="id">
        
                <label class="w3-text-teal"><b>Task type</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="type">
                <br />
                <input class="w3-btn w3-blue-grey" type="submit" value="Registar">
                <input class="w3-btn w3-blue-grey" type="reset" value="Limpar valores">
            </form>

            <div class="w3-container w3-teal">
                <h2>Lista de tarefas feitas</h2>
            </div>
            <table class="w3-table-all">
                <tr>
                    <th>Tarefa</th>
                    <th>Quem?</th>
                    <th>Tipo</th>
                    <th>Criada</th>
                    <th>Deadline</th>
                    <th>Eliminar</th>
                </tr>`

    feitas.forEach(f => {
        pagHTML += `
                <tr>
                    <th>${f.id}</th> 
                    <th>${f.who}</th>
                    <th>${f.type}</th>
                    <th>${f.dateCreated}</th>
                    <th>${f.dateDued}</th>
                    <th><a href="http://localhost:7777/feitas/${f.id}">❌</a></th>
                </tr>`
    })

    pagHTML += `
            </table>
            <div class="w3-container w3-teal">
                <h2>Lista de tarefas por fazer</h2>
            </div>
            <table class="w3-table-all">
                <tr class="w3-teal">
                    <th>Tarefa</th>
                    <th>Quem?</th>
                    <th>Tipo</th>
                    <th>Criada</th>
                    <th>Deadline</th>
                    <th>Confirmar</th>
                </tr>`

    por_fazer.forEach(nf => {
        pagHTML +=  `
            <tr>
                <th>${nf.id}</th> 
                <th>${nf.who}</th>
                <th>${nf.type}</th>
                <th>${nf.dateCreated}</th>
                <th>${nf.dateDued}</th>
                <th><a href="http://localhost:7777/porFazer/${nf.id}">✔️</a></th>
            </tr>`
    })

    pagHTML += `
            </table>
            <div class="w3-container w3-teal">
                <address>Gerado por server::RPCW2022 em ${d}</address>
            </div>
        </body>
    </html>`

    return pagHTML
}

var myServer = http.createServer(function (req, res){
    var date = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + date)

    if (static.recursoEstatico(req)) {
        static.sirvoRecursoEstatico(req, res)
    } else {
        switch(req.method) {
            case "GET":
                if (req.url == "/") {
                    const requestOne = axios.get("http://localhost:3000/feitas")
                    const requestTwo = axios.get("http://localhost:3000/porFazer")

                    axios.all([requestOne, requestTwo])
                        .then(axios.spread((data1, data2) => {
                            const feitas = data1.data
                            const por_fazer = data2.data

                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write(geraPag(feitas, por_fazer, date))
                            res.end()
                        }))
                        .catch(function (error) {
                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível obter a lista de tarefas...</p>")
                            res.end()
                        })
                } else if (/\/porFazer\/(.)+/.test(req.url)) {
                    axios.get('http://localhost:3000' + req.url)
                        .then(response => {
                            let a = response.data
                            const axios = require('axios')

                            axios.post('http://localhost:3000/feitas', a)
                                .then(function (resp) {
                                    console.log('Registo Inserido')
                                })
                                .catch(function (error){
                                    console.log('Erro:' + error) 
                                })

                            axios.delete('http://localhost:3000' + req.url)
                                .then(function (resp) {
                                    console.log('Registo Removido')
                                })
                                .catch(function (error){
                                    console.log('Erro: ' + error)
                                })

                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Alteração feita com sucesso</p>")
                            res.write('<p><a href="/">VOLTAR</a></p>')
                            res.end()
                        })
                        .catch(function (error) {
                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                            res.write("<p>" + error + "</p>")
                            res.end()
                        })
                } else if (/\/feitas\/(.)+/.test(req.url)) {
                    axios.get('http://localhost:3000' + req.url)
                        .then(response => {
                            let a = response.data
                            const axios = require('axios')
                            
                            axios.delete('http://localhost:3000' + req.url)
                                .then(function (resp) {
                                    console.log('Registo Removido')
                                })
                                .catch(function (error){
                                    console.log('Erro: ' + error)
                                })

                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Remoção feita com sucesso</p>")
                            res.write('<p><a href="/">VOLTAR</a></p>')
                            res.end()
                        })
                        .catch(function (error) {
                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                            res.write("<p>" + error + "</p>")
                            res.end()
                        })
                }
                break
            case "POST":
                if (req.url == '/') {
                    recuperaInfo(req, resultado => {
                        resultado['dateCreated'] = date.substring(0,10)
                        console.log('POST de aluno ' + JSON.stringify(resultado))
                        axios.post('http://localhost:3000/porFazer', resultado)
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
                } else if (req.url == '/alterar') {
                    recuperaInfo(req, resultado => {
                        resultado['dateCreated'] = date.substring(0,10)
                        console.log('PUT de aluno ' + JSON.stringify(resultado))
                        axios.put('http://localhost:3000/porFazer/' + resultado['id'], resultado)
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
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                    res.write('<p>Post não suportado</p>')
                    res.write('<p><a href="/">VOLTAR</a></p>')
                    res.end()
                }
                break
            default:
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.write('<p>' + req.method + 'não suportado neste serviço.</p>')
                res.end()
                break
        }
    }
}) 

myServer.listen(7777)
console.log('Servidor à escuta na porta 7777...')
