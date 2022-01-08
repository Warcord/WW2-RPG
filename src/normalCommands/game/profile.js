const NormalCommand = require('../../structures/NormalCommands')
const { create } = require('../../functions/canvas/profile')
const { MessageAttachment, MessageEmbed } = require('discord.js')
const { getUser } = require('../../game/getters');

module.exports = class extends NormalCommand {
    constructor(client) {
        super(client, {

            name: 'profile',
            description: 'Veja o seu perfil ou o deu um úsuario.',
            aliases: ['p', 'perfil'],
            category: 'Game',
            howToUse: `p [user*]`
        })
    }

    run = async (client, message, args) => {

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const userData = await getUser(user.id)
        if (!userData) return userData.userID == message.member.id? message.reply(`Você não tem um personagem criado, use **${await NormalCommand.prefix(message.guild)}create** para criar um.`) : message.reply({ content: `O Usúario mencionado não tem um personagem criado.` });

        const book = await create(client, user.id)
        const file = new MessageAttachment(book, 'profile.png')

        const embed = new MessageEmbed()
            .setImage(`attachment://profile.png`)
            .setColor('#ff0000')

        return message.reply({ embeds: [embed], files: [file] })
    }
}