const NormalCommand = require('../../structures/NormalCommands')
const { Canvacord } = require('canvacord')
const { MessageAttachment, MessageEmbed } = require('discord.js');
const fs = require("fs")

module.exports = class extends NormalCommand {
    constructor(client) {
        super(client, {

            name: 'phub',
            description: 'Comentário do HornPub',
            aliases: ['ph'],
            category: '',
            howToUse: `phub [membro] [mensagem]`
        })
    }

    run = async (client, message, args) => {

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member) return message.reply({ content: `Mencione um membro para executar este comando!` })

        const msg = args.slice(1).join(' ')
        if (!msg || msg.length <= 0) return message.reply({ content: `Adicione uma mensagem para executar este comando.` })

        const data = await Canvacord.phub({ username: `${member.user.username}`, message: `${msg}`, image: `${member.user.avatarURL({ format: 'jpeg' })}` })
        const file = new MessageAttachment(data, `./src/assets/images/clients/PHUB-${message.member?.id}.jpeg`);
        const embed = new MessageEmbed()
            .setTitle(`${message.member.user.tag}`)
            .setColor('#ff0000')
            .setImage(`attachment://PHUB-${message.member?.id}.jpeg`)


        return message.reply({ embeds: [embed], files: [file] })
    }
}