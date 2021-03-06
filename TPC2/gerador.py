import json
import collections
import os

# Função que retorna o inicio de um ficheiro html
# Esta função só foi criada para limpar código
def getHeaderHTML(titulo):
    return '''<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>{}</title>
    </head>
    <body>\n'''.format(titulo)

# Criar a diretoria arquivos, caso não exista
os.makedirs('arquivos', exist_ok=True)

# Abrir e ler o conteudo do ficheiro JSON
file = open('cinemaATP.json', encoding="UTF-8")
data = json.load(file)
file.close()

# Dicionários que vão ser necessários para organizar a informação
movies_files = dict()
atores = dict()
atores_file = dict()

# Para cada filme vamos associar um url
# E a cada ator vamos associar os filmes em que ele interpretou
for i in range(len(data)):
    movies_files.setdefault(data[i]['title'], "f" + str(i))
    for ator in data[i]['cast']:
        atores.setdefault(ator, []).append(data[i]['title'])

# Para cada ator vamos associar um url
i = 0
for ator in atores:
    atores_file[ator] = "a" + str(i)
    i += 1

# Ordenar a lista dos url pela key alfabeticamente
ordered = collections.OrderedDict(sorted(movies_files.items()))

# Usar a lista de url's ordenada e criar uma unordered list em HTML
ul = "<ul>"
# Ciclo que percorre a lista de url's
for title in ordered:
    ul += "\n\t\t\t<li><a href=\"http://localhost:7777/filmes/" + ordered[title] + "\">" + title + "</a></li>"
ul +="\n\t\t</ul>"

# String para depois escrever para um ficheiro HTML
html_lista_filmes = getHeaderHTML("FILMES")
html_lista_filmes += '''\t\t<p><a href="http://localhost:7777/atores">Ver lista de atores</a></p>
        <h1>LISTA DE FILMES</h1>
        {0}
    </body>
</html>'''.format(ul)

# Escrita para os ficheiros
f = open("arquivos/index.html", "w", encoding="UTF-8")
f.write(html_lista_filmes)
f.close()

# Ordenar a lista de url's pelo nome do ator
od = collections.OrderedDict(sorted(atores_file.items()))

# Usar a lista de url's de atores ordenada e criar uma unordered list em HTML
ul2 = "<ul>"
# Ciclo que percorre a lista de url's
for ator in od:
    ul2 += "\n\t\t\t<li><a href=\"http://localhost:7777/atores/" + od[ator] + "\">" + ator + "</a></li>"
ul2 +="\n\t\t</ul>"

# String para depois escrever para um ficheiro HTML
html_lista_atores = getHeaderHTML("ATORES")
html_lista_atores +='''\t\t<p><a href="http://localhost:7777/atores">Ver lista de filmes</a></p>
        <h1>LISTA DE ATORES</h1>
        {0}
    </body>
</html>'''.format(ul2)

# Escrita para os ficheiros
f = open("arquivos/atores.html", "w", encoding="UTF-8")
f.write(html_lista_atores)
f.close()

# Para cada filme vamos criar um ficheiro HTML
i = 0
for d in data:
    # Transformar a lista do cast numa lista html
    cast = ""
    for ator in d['cast']:
        cast += "\n\t\t\t<li><a href=\"http://localhost:7777/atores/" + atores_file[ator] + "\">" + ator + "</a></li>"

    # Transformar a lista dos genres numa lista html
    genres = ""
    for genre in d['genres']:
        genres += "\n\t\t\t<li>" + genre + "</li>"

    # html final para a página de um filme
    html_filme = getHeaderHTML(d['title'])
    html_filme += '''\t\t<h1>{0}</h1>
        <h3>Cast</h3>
        <ul>
            {1}
        </ul>
        <h3>Genres</h3>
        <ul>
            {2}
        </ul>
        <a href="http://localhost:7777/atores">Ver lista de atores</a>
        <br />
        <a href="http://localhost:7777/filmes">Voltar atrás</a>
    </body>
</html>'''.format(d['title'], cast, genres)
    
    # Escrita do html num ficheiro .html
    movie_file = "arquivos/f" + str(i) + ".html"
    f = open(movie_file, "w", encoding="UTF-8")
    f.write(html_filme)
    f.close()
    i += 1

# Para cada ator na lista de atores vamos criar uma página html
i = 0
for ator in atores:
    # Transformar a lista de filmes em que o ator participou numa lista html
    filmes = ""
    for filme in atores[ator]:
        filmes += "\n\t\t\t<li><a>" + filme + "</a></li>"

    # html final da página do ator
    html_ator = getHeaderHTML(ator)
    html_ator += '''\t\t<h3>Filmes em que <strong>{0}</strong> participou:</h3>
        <ul>
            {1}
        </ul>
        <a href="http://localhost:7777/filmes">Ver lista de filmes</a>
        <br />
        <a href="http://localhost:7777/atores">Voltar atrás</a>
    </body>
</html>'''.format(ator, filmes)

    # Escrita da string num ficheiro .html
    ator_file = "arquivos/a" + str(i) + ".html"
    f = open(ator_file, "w", encoding="UTF-8")
    f.write(html_ator)
    f.close()
    i += 1
