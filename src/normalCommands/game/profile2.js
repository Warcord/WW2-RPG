const NormalCommand = require('../../structures/NormalCommands')

const profileSchema = require('../../database/models/profileSchema');
const itemSchema = require('../../database/models/itemSchema');
const { MessageEmbed } = require('discord.js');
const time = require('../../functions/time')
const progressBar = require('../../functions/progress-bar')
const ranks = require('../../game/ranks');
const clanSchema = require('../../database/models/clanSchema');

module.exports = class extends NormalCommand {
    constructor(client) {
        super(client, {

            name: 'profile2',
            description: 'Mostra o perfil de um usuário.',
            aliases: ['p2', 'perfil2'],
            category: 'Game',
            howToUse: `p2 [user*]`
        })
    }

    run = async (client, message, args) => {

        const profileData = await profileSchema.findOne({ userID: message.author.id })

        if (!profileData) return message.reply(`Você não tem um personagem criado, use **${await this.prefix}create** para criar um.`);

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        const timeTest = Date.now() - profileData.createdAt.getTime()
        const getTime = await time.time(timeTest)
        const getTemplate = await time.formatDate('DD/MM/YYYY ás HH:mm:ss', profileData.createdAt.getTime())

        const findLevel = await ranks.verification(profileData.rank, profileData.xp, true)

        const equipedItem1 = await profileData.equipedItem1 == null ? 'Nenhum' : (await itemSchema.findOne({ UID: profileData.equipedItem1 })) == null? 'Nenhum' : (await itemSchema.findOne({ UID: profileData.equipedItem1 })).name
        const equipedItem2 = await profileData.equipedItem2 == null ? 'Nenhum' : (await itemSchema.findOne({ UID: profileData.equipedItem2 }))== null? 'Nenhum' : (await itemSchema.findOne({ UID: profileData.equipedItem2 })).name

        const embed = new MessageEmbed()
            .setTitle(`Perfil de ${profileData.userName} (${user.user.tag})`)
            .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
            .setColor('#ff0000')
            .addField('Itens equipados', `\`\`${equipedItem1}\`\` **:** \`\`${equipedItem2}\`\``, true)
            .addField('Classe', `${this.client.emojis.cache.get(profileData.classEmojiId)} ${profileData.class}`, true)
            .addField('Patente', `${findLevel[1].rank}(${profileData.rank})`, true)
            .addField('Moedas', `${profileData.coins}`, true)
            .addField('Criou a conta em', `${getTemplate} UTC 0 - (${getTime.hour}h ${getTime.min}m ${getTime.seconds}s).`)
            .addField('Progresso do nível', `\`\`\`${(await progressBar.main((findLevel[1].neededXp - profileData.xp), (findLevel[0].neededXp - findLevel[1].neededXp)))} (${profileData.xp}/${findLevel[0].neededXp})\`\`\``)
            .setTimestamp()


        const clanData = await clanSchema.findOne({ id: profileData.clan.id })
        if (clanData) {
            const data = clanData.tag == null ? '' : `(${clanData.tag})`
            await embed.addField('Clan', `${clanData.name + data}`)
        }

        message.delete()
        return message.channel.send({ content: `<@${message.member.id}>`, embeds: [embed] }).then((msg) => setTimeout(function () { msg.delete() }, 30000));
    }
}