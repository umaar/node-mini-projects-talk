// const puppeteer = require('puppeteer');
const { Browser, Page, launch } = require('puppeteer');
const dateUtils = require('chrono-node');

async function init(emitMessage) {
	const browser = await launch({
		headless: false
	});

	emitMessage('Launching Chrome');
	const page = await browser.newPage();
	emitMessage('Navigating to <strong>scotlandjs.com</strong>');
	await page.goto('http://scotlandjs.com/schedule/');

	const time = await page.evaluate(() => {
		const umar = document.querySelector('a[href="#umar"]');
		const scheduleItem = umar.parentElement.parentElement;
		const date = scheduleItem.parentElement.querySelector('.header').innerHTML;
		const time = scheduleItem.querySelector('.time').innerHTML;
		return `${date} ${time}`;
	});

	emitMessage(`Extracted <strong>${time}</strong> from page`);

	const myConferenceTalk = dateUtils.parseDate(time);
	await browser.close();

	const output = `Umar's Conf Talk: ${myConferenceTalk.toString()}`;
	emitMessage(output);
}

module.exports = init;