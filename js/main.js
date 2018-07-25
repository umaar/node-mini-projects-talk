(function() {
	function initRevealJS() {
		// More info about config & dependencies:
		// - https://github.com/hakimel/reveal.js#configuration
		// - https://github.com/hakimel/reveal.js#dependencies
		Reveal.initialize({
			history: true,
			controls: false,
			transition: 'slide',
			transitionSpeed: 'fast',
			width: 1280,
			height: 720,
			dependencies: [
				{ src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } }
			]
		});
	}

	initRevealJS();
})();