import markovify
import sys
import zipfile
import json

archive = zipfile.ZipFile(sys.argv[1], 'r') #Abrimos el zip temporal

corpus = "".join( chr(x) for x in bytearray(archive.read(archive.namelist()[0]))) #Leer el primer .srt del .zip y pasarlo a string

text = ""
for line in corpus.splitlines():
	try: #Si la linea tiene un int, no la queremos
		t = int(line)
	except: #Y sino, testeamos los casos restantes
		if ('-->' not in line) and line != '\n' and ("Downloaded" not in line) and line != '':
			line = line.rstrip('\n')
			text += ((line).replace('-', '')+' ').replace('<i>', '').replace('</i>', '')
 

finalText = ""
for i in range(1,4):
	text_model = markovify.Text(text, state_size=i)
	for i in range(40):
		t = text_model.make_sentence()
		if(t is None):
			continue
		finalText += t +'<br>'
	finalText += "<br>"

print(finalText)