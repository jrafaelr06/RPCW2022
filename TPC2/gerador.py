import json

########################################################################################
def createHtml(data):
    html = '''
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>{0}</title>
        </head>
        <body>
            <h1>{0}</h1>
            <h3>Cast</h3>
            <ul>
                <li>{1}<li>
            </ul>
            <h3>Genres</h3>
            <ul>
                <li>{2}</li>
            </ul>
            <a href="http://localhost:7777/atores">Ver lista de atores</a>
            <a href="http://localhost:7777/filmes">Voltar atrás</a>
        </body>
    </html>
    '''.format(data['title'], data['cast'], data['genres'])
    return html
##########################################################################################

file = open('cinemaATP.json', encoding="UTF-8")
data = json.load(file)
file.close()

atores = dict()

for i in range(len(data)):
    data[i]['file'] = "f" + str(i)
    for ator in data[i]['cast']:
        atores.setdefault(ator, []).append(data[i]['title'])

atores_file = dict()

i = 0
for ator in atores:
    atores_file[ator] = "a" + str(i)
    i += 1

print(atores_file["Alice Evans"])