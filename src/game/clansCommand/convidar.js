const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

const profileSchema = require('../../database/models/profileSchema')
const clanSchema = require('../../database/models/clanSchema')

const property = async (client, message, args) => {

    const profileData = await profileSchema.findOne({ userID: message.member.id })
    if (!profileData) return message.reply({ content: `Use ${await this.prefix}create para criar um personagem.` });

    const user = message.mentions.members.first() || guild.members.cache.get(args[0])

    if (user.bot) return message.reply({ content: 'Um bot não pode participar da sua guilda.' });

    const userData = await profileSchema.findOne({ userID: user.id })
    if (!userData) return message.reply({ content: `Usuário mencionado não tem um personagem.` });

    const clanData = await clanSchema.findOne({ id: profileData.clan.id })
    if (!clanData) return message.reply({ content: 'Você não está em uma guilda.' })
    if (userData.clan.id != null) return message.reply({ content: 'Você já está em um clan.' })
    if (!profileData.clan.permission == 'OWNER') return message.reply({ content: 'Você não tem permissão para convidar membros para seu clan.' });

    const buttons = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(`aceitar`)
                .setEmoji('✔️')
                .setStyle('SUCCESS'),

            new MessageButton()
                .setCustomId(`negar`)
                .setEmoji(`❌`)
                .setStyle('DANGER'),
        );

    const embed = new MessageEmbed()
        .setAuthor(`CONVITE PARA CLAN`, message.member.user.displayAvatarURL())
        .setColor('#159815')
        .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`<@${user.id}>, você recebeu um convite para participar da guilda ${clanData.name}, sendo convidado por <@${message.member.id}>. **Você aceita?**`)


    message.reply({ embeds: [embed], components: [buttons] })

    const filter = (i) => {
        return ['aceitar', 'negar'].includes(i.customId) && i.user.id === user.id;
    }

    const collector = message.channel.createMessageComponentCollector({ filter, idle: 60000 * 10 });

    collector.on('collect', async (i) => {
        if (i.customId == 'aceitar') {


            await profileSchema.findOneAndUpdate({ userID: user.id }, {
                clan: {
                    id: profileData.clan.id,
                    permission: 'MEMBER',
                    memberEntrieNumber: clanData.members.length + 1
                }
            })

            await clanSchema.findOneAndUpdate({ id: profileData.clan.id }, {
                $addToSet: {
                    members: [user.id]
                }
            })

            return await i.update({ content: `<@${user.id}> agora é membro de **${clanData.name}**. Seja Bem-Vindo(a)!`, embeds: [], components: [] })
        }

        if (i.customId == 'negar') {
            return await i.update({ content: 'Convite negado!', embeds: [], components: [] })
        }
    })
}

module.exports.property = property