# MetodoDePomodoro
Projeto em Python com algorítmo para executar o Método de Pomodoro de acordo com suas preferências (configurável).
<br>Aviso: Feito em Sistema Operacional Windows, então é provável que tenha incompatibilidade com outras OS's (Linux e Mac) em <b>relação ao uso das bibliotecas.</b>

<b>Dependências: Python 3.10.9, customtkinter 0.3, playsound 1.2.2</b>
Com exceção do Python, as dependências podem ser instaladas automaticamente ao executar o arquivo "dependecias.bat"

<b>Configurações</b>
Para mudar a execução do programa de acordo com suas preferências, basta editar o arquivo "config.json". A execução do programa é baseado em etapas, cada etapa é um array dentro do arquivo, contendo respectivamente a descrição e o número de minutos. É possível mudar: a descrição, o número de minutos e o número de etapas, basta apagar ou acrescentar arrays todos separados por vírgulas. 

<b>Execução</b>
Para executar o programa basta abrir o arquivo "exec.bat" ou executar "python main.py" no terminal com o diretório do projeto, no caso de outros sistemas operacionais, esse comando pode mudar. Ao executar o programa, irá printar: as etapas, descrições, minutos e tempo decorrido. A cada etapa é criada uma janela contendo a descrição e número de minutos, e também e tocado um efeito sonoro.

<i>Jin Hwa David Cavalari</i>
