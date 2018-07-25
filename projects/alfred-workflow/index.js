const organisers = require('./organisers');

const {input, output, matches} = require('alfy');

if (input.startsWith('@')) {
	const [username] = input.split(' ');
	const tweetUrl = `https://twitter.com/intent/tweet?text=${input}`

	const items = [{
		title: `Tweet ${username}`,
		subtitle: 'Opens twitter.com',
		arg: tweetUrl
	}];

	output(items);
} else {
	const items = matches(input, organisers, 'name')
		.map(organiser => {
			const organiserUsername = organiser.twitter;

			return {
				title: organiser.name,
				subtitle: organiserUsername,
				arg: `${organiserUsername} `,
				extra: input
			}
		});

	output(items);
}


