import http from 'http';
import WebSocket from 'ws';
import express from 'express';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const port = 3000;
const handleListen = () => console.log(`Listening on http://localhost:${port}`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function handleConnection(socket) {}

wss.on('connection', handleConnection);

server.listen(port, handleListen);
