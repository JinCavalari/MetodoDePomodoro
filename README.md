# MetodoDePomodoro
Projeto em Python com algorítmo para executar o Método de Pomodoro de acordo com suas preferências (configurável).
<br><b>Aviso:</b> Feito em Sistema Operacional Windows, então é provável que tenha incompatibilidade com outras OS's (Linux e Mac) em <b>relação ao uso das bibliotecas.</b>

<b>Dependências: Python >= 3.10.9, playsound 1.2.2, pyttsx3</b><br>
Com exceção do Python, as dependências podem ser instaladas automaticamente ao executar o arquivo "dependecias.bat"

<b>Configurações</b><br>
Para mudar a execução do programa de acordo com suas preferências, basta editar o arquivo "config.json". A execução do programa é baseado em etapas, cada etapa é um array dentro do arquivo, contendo respectivamente a descrição e o número de minutos. É possível mudar: a descrição, o número de minutos e o número de etapas, basta apagar ou acrescentar arrays todos separados por vírgulas. 

<b>Execução</b><br>
Para executar o programa basta abrir o arquivo "exec.bat" ou executar "python main.py" no terminal com o diretório do projeto, no caso de outros sistemas operacionais, esse comando pode mudar. Ao executar o programa, irá printar: as etapas, descrições, minutos e tempo decorrido. A cada etapa é tocado um efeito sonoro e executado uma arquvo de audio falando a descrição e número de minutos.

<i>Jin Hwa David Cavalari</i>
