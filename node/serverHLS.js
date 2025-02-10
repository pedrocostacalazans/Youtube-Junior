const express = require('express')
const HLSServer = require('hls-server');
const http = require('http')
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');

const assetsPath = path.join(__dirname, '../assets/output') //Caminho para os arquivos m3u8 (padrao HLS)
const htmlPath = path.join(__dirname, '../html') //Caminho para a página html que consome o nosso servidor HLS
const homePath = path.join(__dirname, '../FrontEnd/index.html') //Caminho para a página html que consome o nosso servidor HLS
const cssHomePath = path.join(__dirname, '../FrontEnd')
const cssMediaPlayerPath = path.join(__dirname, '../html/mediaPlayerStyle.css')
const favIconPath = path.join(__dirname, '../FrontEnd/img/yt_ico_32x32.png')
//const playerPath = path.join(__dirname, '../html/index.html')

const portServerHls = 8080
const portRoutes = 3003
const app = express();

app.use(cors());
app.use(express.static(htmlPath))
app.use(express.static(assetsPath))
app.use(express.static(cssHomePath))

//Permissões para permitir a comunicação entre portas
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/home', (req, res, next) => {
  res.sendFile(homePath)
});

app.get('/videos', async (req, res, next) => {

  const jsonPath = path.join(__dirname, '../FrontEnd/videosList.json');
  try {
    jsonFile = await fs.readFile(jsonPath)
    res.setHeader('Content-Type', 'application/json');
    res.send(jsonFile)
  } catch (e) {
    console.error(error);
    res.status(500).send('Erro interno do servidor');
  }

});

app.get('/styles/mediaPlayerStyle', (req, res, next) => {
  res.sendFile(cssMediaPlayerPath)
})

app.get('/styles/favicon', (req, res, next) => {
  res.sendFile(favIconPath)
})

const server = http.createServer(app) //Abrir o servidor HTTP

const hls = new HLSServer(server, { // Configurar o servidor HLS no servidor HTTP
  path: '/streams', //Defini as rotas para acessar os videos
  dir: assetsPath, //Pasta na qual está armazenada os arquivos .m3u8
})


server.listen(portServerHls, () => { //Servidor aberto e ouvindo as portas para requisições
  console.log(`Servidor HLS rodando em http://localhost:${portServerHls}`)
})

app.listen(portRoutes, () => {
  console.log(`Rotas de consulta rodando em http://localhost:${portRoutes}/home`)
})




