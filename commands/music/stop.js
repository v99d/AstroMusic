const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube')
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "stop",
    description: "Stop the current song and clears the entire music queue.",
    cooldown: 5000,
    aliases: ['st', 'ايقاف', 'وقف',"هش"],
    async execute(client, message, args) {
        try {
            if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) return message.reply({ content: `` });
            if (!message.member.voice.channel)
                return message.reply({ content: "" })
            const queue = distube.getQueue(message)
            if (!queue) return message.reply({ content: `` })
            message.reply({ content: `:notes: The player has stopped and the queue has been cleared.` })
            return distube.stop(message);
        } catch (err) {
            console.log(err)
        }
    },
};