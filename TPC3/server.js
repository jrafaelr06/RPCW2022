var http = require('http')
var url = require('url')
var axios = require('axios')

// Criação do servidor
http.createServer(async function (req, res) {
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
    var myUrl = url.parse(req.url, true).pathname

    if (myUrl === "/") {
        res.write(generateMainPage())
    } 
    else if (myUrl === "/alunos") {
        let result = await generateStudentsTable(myUrl);
        res.write(result)
    } 
    else if (myUrl === "/cursos") {
        let result = await generateCoursesTable(myUrl);
        res.write(result)
    } 
    else if (myUrl === "/instrumentos") {
        let result = await generateInstrumentsTable(myUrl);
        res.write(result)
    } 
    else {
        res.write("<p>Rota " + myUrl + " não suportada </p>")
    }

    res.end()
}).listen(4000)
console.log("Servidor à escuta na porta 4000...")

// Função que cria a tabela HTML da lista de estudantes
async function generateStudentsTable(url_get) {
    const p = await axios.get("http://localhost:3000" + url_get)
    let data = p.data
    var r = `
    <table>
        <tr>
            <th>ID</th>
            <th>NOME</th>
            <th>DATA DE NASCIMENTO</th>
            <th>CURSO</th>
            <th>ANO</th>
            <th>INSTRUMENTO</th>
        </tr>`
    
    data.forEach(p => {
        r += `<tr>
                <th>${p.id}</th>
                <th>${p.nome}</th>
                <th>${p.dataNasc}</th>
                <th>${p.curso}</th>
                <th>${p.anoCurso}</th>
                <th>${p.instrumento}</th>
            </tr>`
    })
    r += "</table>"

    return generateHTML("Lista de alunos", r)
}

// Função que cria a tabela HTML da lista de cursos
async function generateCoursesTable(url_get) {
    const p = await axios.get("http://localhost:3000" + url_get)
    let data = p.data
    var r = `
    <table>
        <tr>
            <th>ID</th>
            <th>DESIGNAÇÃO</th>
            <th>DURAÇÃO</th>
            <th>ID DO INSTRUMENTO</th>
            <th>INSTRUMENTO</th>
        </tr>`
    
    data.forEach(p => {
        r += `<tr>
                <th>${p.id}</th>
                <th>${p.designacao}</th>
                <th>${p.duracao}</th>
                <th>${p.instrumento.id}</th>
                <th>${p.instrumento["#text"]}</th>
            </tr>`
    })
    r += "</table>"

    return generateHTML("Lista de cursos", r)
}

// Função que cria a tabela HTML da lista de instrumentos
async function generateInstrumentsTable(url_get) {
    const p = await axios.get("http://localhost:3000" + url_get)
    let data = p.data
    var r = `
    <table>
        <tr>
            <th>ID</th>
            <th>INSTRUMENTO</th>
        </tr>`
    
    data.forEach(p => {
        r += `<tr>
                <th>${p.id}</th>
                <th>${p["#text"]}</th>
            </tr>`
    })
    r += "</table>"

    return generateHTML("Lista de instrumentos", r)
}

// Função que gera o HTML para a página principal
function generateMainPage() {
    let body = `<ul>
            <li><a href="http://localhost:4000/alunos">Lista de Alunos</a<</li>
            <li><a href="http://localhost:4000/cursos">Lista de Cursos</a<</li>
            <li><a href="http://localhost:4000/instrumentos">Lista de Instrumentos</a<</li>
        </ul>`
    
    return generateHTML("Escola de Música", body)
}

// Função que tem o template para uma página de HTML
function generateHTML(title, body) {
    return `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
        </head>
        <style>
            table, th, td {
                border:1px solid black;
                margin-left: auto;
                margin-right: auto;
            }
            h1 {
                text-align: center;
            }
        </style>
        <body>
            <h1>${title}</h1>
            ${body}
        <body>
    </html>`
}
