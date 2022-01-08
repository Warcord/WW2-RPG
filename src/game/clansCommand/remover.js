const { MessageActionRow, MessageButton } = require('discord.js')
const clanSchema = require('../../database/models/clanSchema')
const profileSchema = require('../../database/models/profileSchema')

const property = async (client, message, args) => {

    const profileData = await profileSchema.findOne({ userID: message.member.id })
    if (!profileData) return message.reply({ content: `Use ${await this.prefix}create para criar um personagem.` });

    if (profileData.clan.id == null) return message.reply({ content: 'Você não está em um clan!' });
    if (profileData.clan.permission != 'OWNER') return message.reply({ content: 'Apenas o dono do clan pode expulsar alguém.' });

    const user = message.mentions.members.first() || client.users.cache.get(args[0])
    if (!user) return message.reply({ content: 'Mencione um usuário para executar este comando!' })
    const userData = await profileSchema.findOne({ userID: user.id })
    if (!userData) return message.reply({ content: 'Usuário mencionado não tem um personagem criado.' })
    if (userData.clan.id != profileData.clan.id) return message.reply({ content: 'Este usuário não está no seu clan.' })

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

    const m = await message.reply({ content: 'Você realmente deseja remover este membro do clan?', components: [buttons] })

    const filter = (i) => {
        return ['aceitar', 'negar'].includes(i.customId) && i.user.id === message.member.id;
    }

    const collector = message.channel.createMessageComponentCollector({ filter, idle: 60000 * 10 });

    collector.on('collect', async i => {

        if (i.customId == 'aceitar') {

            await clanSchema.findOneAndUpdate({ id: profileData.clan.id }, {
                $pull: {
                    members: user.id
                }
            })
            await profileSchema.findOneAndUpdate({ userID: user.id }, {
                clan: {
                    id: null,
                    permission: null,
                    memberEntrieNumber: null
                }
            })
            await m.edit({ content: `Usuário ${userData.userName} removido do clan com sucesso.`, components: [] })
            await setTimeout(() => { m.delete() }, 20000)
        }

        if (i.customId == 'negar') {
            await m.edit({ content: 'Pedido de remoção de usuário do clan negado com sucesso!' })
            await setTimeout(() => { m.delete() }, 20000)
        }
    })
}

module.exports.property = property