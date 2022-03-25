f = open('arq-son-EVO.json')
content = f.readlines()

f.close()

i = 0
final = '{ "musicas": ['

for line in content:
    final += line[0] + '"id": ' + str(i) + "," + line[1:] + ',\n'
    i += 1

final += ']}'

w = open('clean.txt', 'w')

w.write(final)

w.close()