const axios = require("axios");

module.exports = {
	config: {
		name: 'lisa',
		version: '1.2',
		author: 'NIB',
		countDown: 5,
		role: 0,
		shortDescription: 'Chat with Lisa AI',
		longDescription: {
			vi: 'Trò chuyện với AI Lisa',
			en: 'Chat with Lisa AI'
		},
		category: 'Fun',
		guide: {
			vi: '   {pn} [on | off]: bật/tắt AI Lisa'
				+ '\n   {pn} <từ>: trò chuyện nhanh với AI Lisa'
				+ '\n   Ví dụ:\n    {pn} hi',
			en: '   {pn} [on | off]: turn on/off Lisa AI'
				+ '\n   {pn} <word>: chat with Lisa AI'
				+ '\n   Example:\n    {pn} hi'
		}
	},

	langs: {
		vi: {
			turnedOn: 'Bật Lisa AI thành công!',
			turnedOff: 'Tắt Lisa AI thành công!',
			chatting: 'Đang trò chuyện với Lisa...',
			error: 'Có lỗi xảy ra🙂'
		},
		en: {
			turnedOn: 'Turned on Lisa AI successfully!',
			turnedOff: 'Turned off Lisa AI successfully!',
			chatting: 'Already chatting with Lisa...',
			error: 'An error occurred🙂'
		}
	},

	onStart: async function ({ args, threadsData, message, event, getLang }) {
		if (args[0] == 'on' || args[0] == 'off') {
			await threadsData.set(event.threadID, args[0] == "on", "settings.lisaAI");
			return message.reply(args[0] == "on" ? getLang("turnedOn") : getLang("turnedOff"));
		}
		else if (args[0]) {
			const yourMessage = args.join(" ");
			try {
				const responseMessage = await getMessage(yourMessage);
				return message.reply(responseMessage);
			}
			catch (err) {
				console.error(err);
				return message.reply(getLang("error"));
			}
		}
	},

	onChat: async function ({ args, message, threadsData, event, isUserCallCommand, getLang }) {
		if (args.length > 0 && !isUserCallCommand && await threadsData.get(event.threadID, "settings.lisaAI")) {
			try {
				const langCode = await threadsData.get(event.threadID, "settings.lang") || global.GoatBot.config.language;
				const responseMessage = await getMessage(args.join(" "), langCode);
				return message.reply(responseMessage);
			}
			catch (err) {
				console.error(err);
				return message.reply(getLang("error"));
			}
		}
	}
};

async function getMessage(yourMessage, langCode) {
	try {
		const response = await axios.post('https://api.simsimipro.xyz/v1/talk', {
			ask: yourMessage,
			lc: langCode || 'en'
		});

		if (response.data.status === 'success') {
			return response.data.ans;
		} else {
			throw new Error(response.data.status);
		}
	} catch (err) {
		console.error('Failed to fetch response from the API', err);
		throw new Error('Failed to fetch response from the API');
	}
}
