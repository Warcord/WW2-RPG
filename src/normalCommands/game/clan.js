const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const NormalCommand = require('../../structures/NormalCommands')

const clanSchema = require('../../database/models/clanSchema')
const profileSchema = require('../../database/models/profileSchema')
const time = require('../../functions/time')

module.exports = class extends NormalCommand {
    constructor(client) {
        super(client, {

            name: 'clan',
            description: 'Comandos de clan.',
            aliases: [''],
            category: 'Game',
            howToUse: `clan [nome*]`
        })
    }

    run = async (client, message, args) => {

        return message.reply({ content: `Comando em manutenção.` })

        if (args.length <= 0) {

            const profileData = await profileSchema.findOne({ userID: message.member.id })
            if (!profileData) return message.reply({ content: `Use ${await NormalCommand.prefix(message.guild)}create para criar um personagem.` });

            const clanName = args.join(' ') || await clanSchema.findOne({ id: profileData.clan.id }) ? (await clanSchema.findOne({ id: profileData.clan.id })).name : false

            const clanData = await clanSchema.findOne({ name: clanName })
            if (!clanData) return message.reply({ content: `Clan mencionado não foi encontrado.` });

            const timeTest = Date.now() - profileData.createdAt.getTime()
            const getTime = await time.time(timeTest)
            const getTemplate = await time.formatDate('DD/MM/YYYY ás HH:mm:ss', profileData.createdAt.getTime())

            const embed = new MessageEmbed()
                .setTitle(`${clanData.name}`)
                .setColor('#ff0000')
                .setThumbnail(clanData.iconURL == null ? client.user.displayAvatarURL() : clanData.iconURL)
                .addField(`Dono`, `${client.users.cache.get(clanData.ownerID).tag}`, true)
                .addField(`Membros`, `${clanData.members.length}/${clanData.maxMembers}`, true)
                .addField(`Banco`, `${clanData.bank}/${clanData.maxCoins}`, true)
                .addField(`Nível`, `${clanData.lvl}`, true)
                .addField(`Criado em`, `${getTemplate} UTC 0 - (${getTime.hour}h ${getTime.min}m ${getTime.seconds}s).`)

            return message.reply({ embeds: [embed] })
        }

        if (args.join(' ')) {
            // const profileData = await profileSchema.findOne({ userID: message.member.id })
            // if (!profileData) return message.reply({ content: `Use ${await this.prefix}create para criar um personagem.` });

            // const clanData = await clanSchema.findOne({ name: profileData.clan.id })
            // if (!clanData) return message.reply({ content: 'Você precisa estar em um clan para executar este comando.' })

            require(`../../game/clansCommand/${args[0]}`).property(this.client, message, args.slice(1))
        } else {
            return;
        }
    }
}