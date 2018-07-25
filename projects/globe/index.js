const config = require('config');
const express = require('express')
const expressPort = config.get('port');
const allData = require('./data.json').entries;

function onConnection(socket) {
	const clientID = +(new Date());
	let iteration = 0;
	let interval;

	console.log(`Client connection ${clientID} established`);

	socket.on('disconnect', () => {
		console.log(`Terminating client ${clientID}`);
		clearInterval(interval);
	});

	interval = setInterval(() => {
		const item = allData[iteration++];

		if (item) {
			if ((iteration % 60) === 0) {
				console.log(`Client ${clientID} emitting item: ${iteration}`);
			}
			socket.emit('message', item);
		} else {
			clearInterval(interval);
		}
	}, 20)
}

function init() {
	var app = require('express')();
	var http = require('http').Server(app);
	var io = require('socket.io')(http);
	io.on('connection', onConnection);
	app.use(express.static('public'))

	const port = config.get('port');

	http.listen(port, function(){
		console.log(`listening on *:${port}`);
	});
}

init();