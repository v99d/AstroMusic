const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube')
const { prefix } = require('../../config.json');
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "pause",
    description: "Pauses the currently playing track.",
    cooldown: 5000,
    async execute(client, message, args) {
        try {
            if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) return message.reply({ content: `` });
            if (!message.member.voice.channel)
                return message.reply({ content: "" })
            const queue = distube.getQueue(message)
            if (!queue) return message.reply({ content: `` })
            const song = queue.songs[0]
            let name = song.name
            if (queue.paused) {
                message.reply({ content: `:no_entry_sign: **${name}** has been Paused!` })
            } else {
                distube.pause(message);
                message.reply({ content: `:notes: Paused **${name}** . Type \`${prefix}resume\` to unpause!` })
            }
        } catch (err) {
            console.log(err)
        }
    },
};
