const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fliclib = require('./fliclibNodeJs');
const FlicClient = fliclib.FlicClient;
const FlicConnectionChannel = fliclib.FlicConnectionChannel;
const FlicScanner = fliclib.FlicScanner;

const port = 5555;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

async function init(onEvent) {
	function logAndEmit(event) {
		console.log('Event: ', event);

		if (onEvent) {
			onEvent(event);
		}
	}

	const terminalCommand = 'open /Applications/FlicServiceBeta.app --args --interface localhost --port 5555';

	try {
		console.log('Executing: ', terminalCommand);
		await exec(terminalCommand);
	} catch (err) {
		console.log(err);
		return;
	}

	// Allow the daemon to initialise
	await sleep(2000);

	const client = new FlicClient('localhost', port);

	function listenToButton(bdAddr) {
		const cc = new FlicConnectionChannel(bdAddr);
		client.addConnectionChannel(cc);

		cc.on('buttonUpOrDown', clickType => {
			if (clickType === 'ButtonUp') {
				logAndEmit('Button Press');
			}
		});
	}

	client.once('ready', () => {
		logAndEmit('Button Connected');
		client.getInfo(info => {
			info.bdAddrOfVerifiedButtons.forEach(bdAddr => {
				listenToButton(bdAddr);
			});
		});
	});

	client.on('bluetoothControllerStateChange', state => {
		logAndEmit('Bluetooth controller state change: ' + state);
	});

	client.on('newVerifiedButton', bdAddr => {
		logAndEmit('A new button was added: ' + bdAddr);
		listenToButton(bdAddr);
	});

	client.on('error', error => {
		logAndEmit('Daemon connection error: ' + error);
	});

	client.on('close', hadError => {
		logAndEmit('Connection to daemon is now closed');
	});
}

module.exports = init;
