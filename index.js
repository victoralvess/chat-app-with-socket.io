const express = require('express');
app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
	// res.send('<h1>Hello World</h1>');
	res.sendFile(`${__dirname}/index.html`);
});

io.on('connection', (socket) => {
	console.log('A user connected.');
	// io.emit('connected', 'A new user connected.');
	
	socket.on('disconnect', () => {
		console.log('A user disconnected.');
	});

	socket.on('message', (message) => {
		console.log('Message: ', message);
		io.emit('message', message);
	});

});

server.listen(3000, () => {
	console.log('Running at http://localhost:3000');
});