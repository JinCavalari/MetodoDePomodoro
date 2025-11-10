import os
from time import sleep
import time
from datetime import datetime, timedelta
import json
try:
	import pyttsx3
except ImportError:
	os.system("pip install pyttsx3")
	import pyttsx3


import threading
try:
	from playsound import playsound
except ImportError:
	os.system("pip install playsound==1.2.2")
	from playsound import playsound

class ConfigJson():
	def __init__(self, fileJson):
		self.fileJson = fileJson
		with open(self.fileJson, "r") as file:
			self.data = json.loads(file.read())


	def save(self):
		with open(self.fileJson, "w") as file:
			file.write(json.dumps(self.data, indent=4))

def aviso():
	global config
	global etapa
	global speech

	painelSay = f"Etapa {etapa+1}: {config.data[etapa][0]} de {config.data[etapa][1]} minuto(s).\n"
	if config.data[etapa][1] == 1:
		painelSay = painelSay[:painelSay.index("(s)")]
	else:
		painelSay = painelSay[:painelSay.index("(s)")]+"s"
	playsound("Alert.mp3")
	speech = pyttsx3.init()
	speech.say(painelSay)
	speech.runAndWait()
	speech.stop()
	speech = None

def th_aviso():
	global config
	global etapa

	th = threading.Thread(target=aviso)
	th.start()

def main():
	global painel
	global config
	global etapa

	init_time = int(time.time())
	init_date = datetime.fromtimestamp(init_time)

	etapaCount = config.data[etapa][1]*60
	painel += f"Etapa {etapa+1}: {config.data[etapa][0]} de {config.data[etapa][1]} minuto(s).\n"
	th_aviso()
	count = 0

	while True:
		count += 1
		if count >= etapaCount:
			etapa += 1
			if (etapa >= len(config.data)):
				break

			etapaCount += config.data[etapa][1]*60
			painel += f"Etapa {etapa+1}: {config.data[etapa][0]} de {config.data[etapa][1]} minuto(s).\n"
			th_aviso()

		hora = int(count/3600)%24
		minu = int(count/60)%60
		segu = count%60

		s2dig = segu if len(str(segu)) == 2 else "0"+str(segu)
		m2dig = minu if len(str(minu)) == 2 else "0"+str(minu)
		os.system("cls")
		print(painel)
		print(f"""Tempo decorrido: {hora}:{m2dig}:{s2dig}""")
		sleep(1)

config = ConfigJson("config.json")
etapa = 0
painel = ""

if __name__ == '__main__':
	main()
	playsound('Alert.mp3')