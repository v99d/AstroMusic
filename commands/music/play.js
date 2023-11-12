const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube')
const wait = require('node:timers/promises').setTimeout;
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "play",
    description: "Add a song to queue and plays it.",
    cooldown: 1000,
    aliases: ['p', 'ش'],
    async execute(client, message, args) {
        try {
            if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) return message.reply({ content: `` });
            if (!message.member.voice.channel)
                return message.reply({ content: "" })
            let player = args.slice(0).join(' ')
            if (!player) return message.reply({ content: `` })


            const queue = distube.getQueue(message)
            message.reply({ content: `` }).then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 3000);
            }).catch(() => { });

            const voiceChannel = message.member?.voice?.channel;
            if (voiceChannel) {
                await distube.play(voiceChannel, player, {
                    message,
                    textChannel: message.channel,
                    member: message.member,
                });
            }
        } catch (err) {
            console.log(err)
        }
    },
};

