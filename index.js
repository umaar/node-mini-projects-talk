const express = require('express')
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const port = 3000;

const [scotlandJSFile] = fs.readdirSync('./projects/bitbar/').filter(file => {
	return file.startsWith('ScotlandJS.');
});

const confOrganisers = require('./projects/alfred-workflow/organisers');
const markovChain = require('./projects/markov-chain/index');
const webScraper = require('./projects/web-scraper/index');
const scotlandJS = require(`./projects/bitbar/${scotlandJSFile}`);
const bluetooth = require('./projects/bluetooth/index');
const globeData = require('./projects/globe/data.json').entries;

async function onProject(data) {
	console.log('Project Message Received: ', data);

	if (!data) {
		return;
	}

	let terminalCommand;

	if (data.startsWith('/')) {
		// The path is at the root of development
		terminalCommand = `subl /Users/umarhansa/development${data}`;
	} else {
		terminalCommand = `subl ${process.cwd()}/projects/${data}`
	}

	console.log('Opening Sublime Text', terminalCommand);
	await exec(terminalCommand);
}

function onAction(socket) {
	return function(data) {
		console.log('Action Message Received: ', data);

		if (!data) {
			return;
		}

		const actionMappings = {
			'markov-chain'() {
				console.log('markov-chain handler');
				markovChain(data => {
					emitToClient(socket, 'markov-chain', data);
				});
			},
			'web-scraper'() {
				console.log('web scraper handler');
				webScraper(data => {
					emitToClient(socket, 'web-scraper', data);
				});
			},
			'alfred-workflow'() {
				console.log('alfred workflow handler');
				emitToClient(socket, 'alfred-workflow', confOrganisers);
			},
			async 'bitbar'() {
				console.log('bitbar handler');
				emitToClient(socket, 'bitbar', await scotlandJS());
			},

			'bluetooth'() {
				console.log('bluetooth handler');
				bluetooth(data => {
					emitToClient(socket, 'bluetooth', data);
				});
			},

			'globe'() {
				console.log('globe handler');
				emitToClient(socket, 'globe', globeData[0]);
			},

			async 'demokit'() {
				console.log('demokit handler');

				function extractDemoKitTerminalMessages(string) {
					try {
						return string
							.split('GVA')[0]
							.split('\n')
							.filter(str => str.includes('children:'))
							.map(str => str.split(` [ '`)[1])
							.map(str => str.split(`' ],`)[0]);
					} catch (err) {
						console.log('Error parsing terminal output from demokit', err);
						return [err];
					}
				}

				const videoFolder = `/Users/umarhansa/development/node-mini-projects/projects/demokit`;
				const terminalCommand = `/Users/umarhansa/.nvm/versions/node/v10.6.0/bin/demokit ${videoFolder}/index`;

				console.log(terminalCommand);
				const {stderr, stdout} = await exec(terminalCommand, {
					cwd: videoFolder
				});

				if (stderr) {
					console.log('There were errors with Demokit: ', stderr);
					emitToClient(socket, 'demokit', stderr);
				} else {
					console.log('Demokit Output: ', stdout);
					extractDemoKitTerminalMessages(stdout).forEach(message => {
						emitToClient(socket, 'demokit', message);
					});

					const terminalCommandToOpenVideoFolder = `open ${videoFolder}`;
					console.log('Executing: ', terminalCommandToOpenVideoFolder);
					await exec(terminalCommandToOpenVideoFolder);
				}
			},
		}

		const actionHandler = actionMappings[data];

		if (actionHandler) {
			actionHandler();
		} else {
			console.log('No action handler for ', data);
		}
	}
}

function emitToClient(socket, ...args) {
	console.log('Emitting to client', args);
	socket.emit(...args);
}

function onConnection(socket) {
	socket.on('project', onProject)
	socket.on('message', onAction(socket))
}

function init() {
	const app = require('express')();
	const http = require('http').Server(app);
	const io = require('socket.io')(http);

	app.use(express.static('public'))
	io.on('connection', onConnection);

	http.listen(port, () => console.log(`listening on http://localhost:${port}`));
}

init();
