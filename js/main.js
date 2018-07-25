(function() {

	let socket;

	function initRevealJS() {
		// More info about config & dependencies:
		// - https://github.com/hakimel/reveal.js#configuration
		// - https://github.com/hakimel/reveal.js#dependencies
		Reveal.initialize({
			keyboard: {
				// space key
				32: handleSlideWebSocketCodeEditor,
				// 't' character
				84: handleSlideWebSocketAction
			},
			history: true,
			controls: false,
			transition: 'slide',
			transitionSpeed: 'fast',
			width: 1280,
			height: 720,
			dependencies: [
				{ src: 'plugin/markdown/marked.js' },
				{ src: 'plugin/markdown/markdown.js' },
				{ src: 'plugin/notes/notes.js', async: true },
				{ src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } }
			]
		});
	}

	function handleSlideWebSocketAction() {
		const message = document.querySelector('.present').dataset.project;

		if (message) {
			emitActionMessage(message);
		}
	}

	function handleSlideWebSocketCodeEditor() {
		const project = document.querySelector('.present').dataset.project;

		if (project) {
			emitCodeEditorOpen(project);
		}
	}

	function emitActionMessage(message) {
		if (socket) {
			console.log('Emitting message', message);
			socket.emit('message', message);
		}
	}

	function emitCodeEditorOpen(project) {
		if (socket) {
			console.log('Emitting Project', project);
			socket.emit('project', project);
		}
	}

	function onMessage(data) {
		console.log('Data received from server', {data});
	}

	function handleMarkovChainString(string) {
		console.log('Received strings from server!', string);
		const markovContainer = document.querySelector('.markov-chain-text');
		const item = document.createElement('li')
		item.innerText = string;

		if (markovContainer) {
			markovContainer.appendChild(item);
		}
	}

	function handleWebScraperString(string) {
		const webscraperOutput = document.querySelector('.web-scraper-output');

		const item = document.createElement('li')
		item.innerHTML = string;

		if (webscraperOutput) {
			webscraperOutput.appendChild(item);
		}
	}

	function handleAlfredWorkflowOutput(output) {
		const alredWorkflowEl = document.querySelector('.alfred-workflow-output');

		if (alredWorkflowEl) {
			alredWorkflowEl.innerHTML = JSON.stringify(output, null, 2);
		}
	}

	function handleBitbarOutput(output) {
		const bitbarOutputEl = document.querySelector('.bitbar-output');
		console.log(output);
		if (bitbarOutputEl) {
			bitbarOutputEl.innerHTML = output;
		}
	}


	function handleBluetoothOutput(string) {
		const bluetoothOutput = document.querySelector('.bluetooth-output');

		const item = document.createElement('li')
		item.innerHTML = string;

		if (bluetoothOutput) {
			bluetoothOutput.appendChild(item);
		}
	}

	function handleDemokitOutput(string) {
		const demokitOutput = document.querySelector('.demokit-output');

		const item = document.createElement('li')
		item.innerHTML = string;

		if (demokitOutput) {
			demokitOutput.appendChild(item);
		}
	}

	function handleGlobeOutput(output) {
		const globeOutputEl = document.querySelector('.globe-output');

		if (globeOutputEl) {
			globeOutputEl.innerHTML = JSON.stringify(output, null, 2);
		}
	}

	function initWebSockets() {
		socket = io();
		socket.on('connect', () => {
			console.log('Connected to the WebSocket Server');
		});

		socket.on('message', onMessage);
		socket.on('markov-chain', handleMarkovChainString);
		socket.on('web-scraper', handleWebScraperString);
		socket.on('alfred-workflow', handleAlfredWorkflowOutput);
		socket.on('bitbar', handleBitbarOutput);
		socket.on('bluetooth', handleBluetoothOutput);
		socket.on('demokit', handleDemokitOutput);
		socket.on('globe', handleGlobeOutput);
	}

	function init() {
		initRevealJS();
		initWebSockets();
	}

	init();

})();