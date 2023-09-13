import os
from time import sleep
import time
from datetime import datetime, timedelta
import json

import customtkinter
import threading
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
	window = customtkinter.CTk()
	window.geometry("700x500")
	window.title("Aviso - Método de Pomodoro")

	label = customtkinter.CTkLabel(window, text=f"{config.data[etapa][0]} de \n{config.data[etapa][1]} minuto(s).", font=("Arial", 50))
	label.pack(padx=10, pady=10)


	window.protocol("WM_DELETE_WINDOW", lambda: window.destroy())
	window.mainloop()

def th_aviso():
	global config
	global etapa
	playsound('Alert.mp3')

	th = threading.Thread(target=aviso)
	# th.daemon = etapa < len(config.data)-1
	th.daemon = True
	th.start()

def main():
	global painel
	global config
	global etapa

	init_time = int(time.time())
	init_date = datetime.fromtimestamp(init_time)

	etapaCount = config.data[etapa][1]*60
	count = -1

	while True:
		count += 1
		if count == 0:
			painel += f"Etapa {etapa+1}: {config.data[etapa][0]} de {config.data[etapa][1]} minuto(s).\n"
			th_aviso()

		elif count >= etapaCount:
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