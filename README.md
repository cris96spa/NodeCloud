<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h1 align="center">Node Cloud</h1>

  <p align="center">
    Progetto sviluppato per il corso di <em>Internet of Things</em> tenuto dal Professor Matteo Cesena, presso il <em>Politecnico di Milano</em>.
    <br />
    <a href="https://github.com/cris96spa/Progetto-IoT"><strong>Esplora la documentazione »</strong></a>
    <br />
    <br />
    <a href="https://www.youtube.com/watch?v=8d3OPHnoLG8">Demo</a>
  </p>
</p>

## About Node-Cloud
<em>Node Cloud</em> è un sistema di monitoraggio che fonda il suo funzionamento su <em>Node-RED</em>, un framework per la programmazione flow-based.
## Get Started
### Node-Red
Come prima cosa è necessario installare [Node-Red](https://nodered.org/docs/getting-started/local). Terminata l'installazione, eseguire da terminale:
```
node-red
```
per poi caricare da browser la pagina:
```
http://localhost:1880/
```
Prima di effettuare l'import istallare i nodi per l'accesso al db di mongo db:

Hamburger Button (Bottone alto destra) -->  Manage Palette -->  Install --> Copiare e incollare il seguente testo: "node-red-contrib-mongodb3" --> install

Per effettuare l'import dei nodi utilizzati:

Hamburger Button -->  Import -->  Import -->  Clipboard

Inserire a questo punto il file reperibile [qui](https://github.com/cris96spa/Progetto-IoT/blob/main/Node-Cloud-Source/Node-RED/flows.json).

### MongoDB
Per gestire la persistenza dei dati è stato utilizzato [MongoDB](https://www.mongodb.com/).
È necessario installare in locale il dbms. In aggiunta, per accedere al dbms con un interfaccia grafica
è consigliato il download di [MongoDb Compass](https://www.mongodb.com/it-it/products/compass).

Dopodiché scaricare il file di configurazione reperibile [qui](https://github.com/cris96spa/Progetto-IoT/blob/main/Node-Cloud-Source/MongoDB/mongod.conf), collocarsi nella directory in cui è presente il file appena scaricato ed esecuire il seguente comando:
```
mongod --config ./mongod.conf
```
Accedere al dbms mediante <em>MongoDB Compass</em>, selezionando l'istanza in esecuzione in locale. Creare un nuovo database chiamato:
```
node-cloud
```
poi creare 3 collezioni:
```
nodes
```
```
sensors
```
```
samples
```
È possibile recuperare i file di configurazione per [nodi](https://github.com/cris96spa/Progetto-IoT/blob/main/Node-Cloud-Source/MongoDB/nodes.json) e [sensori](https://github.com/cris96spa/Progetto-IoT/blob/main/Node-Cloud-Source/MongoDB/sensors.json). Non è necessario fornire alcun file di configurazione in merito ai samples, in quanto saranno generati durante l'esecuzione del client.

### Client Java
Il client è stato implementato in <em>Java</em> come un progetto [Maven](https://maven.apache.org/). Importare il progetto in un qualsiasi IDE in grado di supportare un progetto <em>Maven</em>.
Fatto ciò, mandare in esecuzione il file relativo alla classe <em>NodeManager</em>. 
Una documentazione dettagliata del client è reperibile [qui](https://github.com/cris96spa/Progetto-IoT/tree/main/Node-Cloud-Source/java-documentation).