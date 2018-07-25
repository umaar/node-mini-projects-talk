var MarkovChain = require('markovchain').MarkovChain;

const quotes = new MarkovChain({
	files: `${process.cwd()}/projects/markov-chain/data.txt`
});

function generateText(onText) {
	for (var i = 0; i < 5; i++) {
		quotes
			.start('The')
			.end(10)
			.process((err, string) => onText(string));
	}
}

module.exports = generateText;