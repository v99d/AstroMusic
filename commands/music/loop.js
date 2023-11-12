const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube')
const db = require(`quick.db`)
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "repeat",
    description: "Toggles the repeat mode.",
    cooldown: 2000,
    aliases: ['r', 'تكرار',"كرر"],
    async execute(client, message, args) {
        try {
          if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) return message.reply({ content: `` });
            if (!message.member.voice.channel)
                return message.reply({ content: "" })
            const queue = distube.getQueue(message)
            if (!queue) return message.reply({ content: `` })
            if (0 <= Number(args[0]) && Number(args[0]) <= 2) {
                distube.setRepeatMode(message, parseInt(args[0]))
                message.reply({ content: `:notes: **Repeat mode set to:** ${args[0].replace("0", "\`OFF\`").replace("1", "\`Repeat song\`").replace("2", "\`Repeat Queue\`")}` })
            } else {
                message.reply({ content: `أختر رقم من التالي :
 0: **تعطيل**,
 1: **تكرار الأغنية الحاليه**,
 2: **تكرار كل الأغاني**` })
            }
        } catch (err) {
            console.log(err)
        }
    },
};