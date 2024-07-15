const axios = require("axios");
const path = require("path");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "pinterest",
    aliases: ["pin"],
    version: "1.0",
    author: "Mahi--",
    role: 0,
    countDown: 60,
    longDescription: {
      en: "This is a fast Pinterest command locked in 6 "
    },
    category: "Search",
    guide: {
      en: "{prefix} pin/Pinterest boruto -5"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const keySearch = args.join(" ");
      if (!keySearch.includes("-")) {
        return api.sendMessage(
          "Please enter the search query and number of images (1-6)",
          event.threadID,
          event.messageID
        );
      }

      const keySearchs = keySearch.split("-")[0].trim();
      let numberSearch = parseInt(keySearch.split("-").pop().trim()) || 1;

      if (numberSearch > 8) {
        numberSearch = 8;
      }

      const apiUrl = `https://turtle-apis.onrender.com/api/pinterest?search=${encodeURIComponent(keySearchs)}&keysearch=${numberSearch}`;

      const res = await axios.get(apiUrl);
      const data = res.data.images;
      const imgData = [];

      for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
        const imgResponse = await axios.get(data[i], {
          responseType: "arraybuffer"
        });
        const imgPath = path.join(__dirname, "cache", `${i + 1}.jpg`);
        await fs.outputFile(imgPath, imgResponse.data);
        imgData.push(fs.createReadStream(imgPath));
      }

      await api.sendMessage({
        attachment: imgData,
      }, event.threadID, event.messageID);

      await fs.remove(path.join(__dirname, "cache"));
    } catch (error) {
      console.error(error);
      return api.sendMessage(
        `An error occurred.`,
        event.threadID,
        event.messageID
      );
    }
  }
};
