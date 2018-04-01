const express = require('express');
app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/index.html`);
});

io.on('connection', socket => {
	console.log('A user connected.', socket.handshake.query.user);
	const user = JSON.parse(socket.handshake.query.user);

	io.emit('user', {
		...user,
		id: socket.id
	});

	socket.on('disconnect', () => {
		console.log('A user disconnected.');
		io.emit('user_disconnected', socket.id);
	});

	socket.on('message', message => {
		console.log('Message: ', message);
		io.emit('message', message);
	});

	socket.on('me', user => {
		io.emit('user', user);
	});

	socket.on('user_is_typing', user => {
		io.emit('user_is_typing', user);
	});
	
});

server.listen(3000, () => {
	console.log('Running at http://localhost:3000');
});
