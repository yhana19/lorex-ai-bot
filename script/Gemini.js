const axios = require('axios');

module.exports.config = {
  name: "gwapo",
  role: 0,
  credits: "oten",
  description: "Interact with Gemini API",
  hasPrefix: false,
  version: "1.0.0",
  aliases: ["clarence", "gwapo"],
  usage: "gemini [prompt]"
};

module.exports.run = async function ({ api, event, args }) {
  const prompt = args.join(" ");

  if (!prompt) {
    return api.sendMessage('Please provide a prompt.', event.threadID, event.messageID);
  }

  if (event.type !== "message_reply" || !event.messageReply.attachments[0] || event.messageReply.attachments[0].type !== "photo") {
    return api.sendMessage('Please reply to a photo with this command.', event.threadID, event.messageID);
  }

  const url = encodeURIComponent(event.messageReply.attachments[0].url);
  api.sendTypingIndicator(event.threadID);

  try {
    const response = await axios.get(`https://api.zetsu.xyz/gemini?prompt=${encodeURIComponent(prompt)}&url=${url}`);
    const description = response.data.gemini;

    return api.sendMessage(description, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    return api.sendMessage('❌ | An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
