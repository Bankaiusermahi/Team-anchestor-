const fs = require('fs');
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "approval",
    version: "1.0",
    author: "rehat--",
    category: "events"
  },
  onStart: async function ({ api, event, threadsData, message }) {
    const uid = "100094357823033";
    const groupId = event.threadID;
    const threadData = await threadsData.get(groupId);
    const name = threadData.threadName;
    const { getPrefix } = global.utils;
    const p = getPrefix(event.threadID);    

    let threads = [];
    try {
      threads = JSON.parse(fs.readFileSync('threads.json'));
    } catch (err) {
      console.error('', err);
    }

    if (!threads.includes(groupId) && event.logMessageType === "log:subscribe") {
      await message.send({
        body: `❎ | You Added The 𝗔𝗡𝗖𝗛𝗘𝗦𝗧𝗢𝗥 𝗔𝗜 Without Permission !!\n\n✧Take Permission From 𝗔𝗡𝗖𝗛𝗘𝗦𝗧𝗢𝗥 𝗔𝗜 Admin's to Use 𝗔𝗡𝗖𝗛𝗘𝗦𝗧𝗢𝗥 𝗔𝗜 In Your Group !!\n✧Join 𝗔𝗡𝗖𝗛𝗘𝗦𝗧𝗢𝗥 𝗔𝗜 Support GC to Contact With Admin's !!\n\n✧Type ${p}supportgc within 20 seconds.\n\n- Ohio03 Co., Ltd.`,
        attachment: await getStreamFromURL("https://i.ibb.co/2PQwZgf/image.gif")
      });
    }

    if (!threads.includes(groupId) && event.logMessageType === "log:subscribe") {
      await new Promise((resolve) => setTimeout(resolve, 20000)); // Delay of 1 seconds
      await api.sendMessage(
        `====== Approval ======\n\n🍁 | Group:- ${name}\n🆔 | TID:- ${groupId}\n☣️ | Event:- The Group Need Approval`,
        uid,
        async () => {
          await api.removeUserFromGroup(api.getCurrentUserID(), groupId);
        }
      );
    }
  }
};
