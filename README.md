 # Guida d'utilizzo
 ### Progetto Software Cybersecurity a.a 2021/2022
 ##### Ali Waqar - Angelini - Di Silvestre - Scuriatti
 .
 > Descrizione dei passaggi da eseguire per l'installazione e il test del progetto.

 ## Installazione Quorum Wizard
 Seguire le istruzioni del seguente link per ottenere una blockchain privata con 3 nodi: https://github.com/ConsenSys/quorum-wizard
 
 ## Installazioni pacchetti npm
 Scaricare **Node.js** dalla pagina ufficiale: https://nodejs.org/it/download/
 Clonare la repository "CyberSecurity-project" e, al suo inerno, eseguire il comando
 ```zsh 
 $ npm install
 ```
 che installerà i pacchetti necessari al funzionamento del software: web3, solc, quorum-js, inquirer, console-table-printer, @openzeppelin/contracts.
 
 ## Avvio del progetto
 Entrare da terminale nella cartella creata da Quorum Wizard e lanciare lo script di avvio:
 ```zsh 
 $ cd network/3-nodes-quickstart
 $ ./start.sh
 ```
 Se l'operazione ha esito positivo, entrare nella cartella clonata in precedenza e, solo al primo avvio, eseguire il comando:
 ```zsh 
 $ node ./Initialize.js
 ```
 Se l'operazione ha esito positivo, per avviare l'interfaccia eseguire il comando:
 ```zsh 
 $ node ./Interface.js
 ```
 ## Test del progetto
 
 ## Chiusura del progetto
 Per la chiusura del progetto basta eseguire il comando
 ```zsh 
 $ cd network/3-nodes-quickstart
 $ ./stop.sh
 ```
 terminando i processi relativi ai 3 nodi.

 
  
 
