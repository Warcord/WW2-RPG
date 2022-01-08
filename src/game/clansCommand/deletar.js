const { MessageActionRow, MessageButton } = require('discord.js')
const clanSchema = require('../../database/models/clanSchema')
const profileSchema = require('../../database/models/profileSchema')

const property = async (client, message, args) => {

    try {

        const profileData = await profileSchema.findOne({ userID: message.member.id })
        if (!profileData) return message.reply({ content: `Use ${await this.prefix}create para criar um personagem.` });

        if (profileData.clan.id == null) return message.reply({ content: 'Você não está em um clan!' })
        if (profileData.clan.permission != 'OWNER') return message.reply({ content: 'Apenas o dono do clan pode deletá-lo.' })

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

        const m = await message.reply({ content: 'Você realmente deseja deletar o clan?', components: [buttons] })

        const filter = (i) => {
            return ['aceitar', 'negar'].includes(i.customId) && i.user.id === message.member.id;
        }

        const collector = message.channel.createMessageComponentCollector({ filter, idle: 60000 * 10 });

        collector.on('collect', async i => {

            if (i.customId == 'aceitar') {

                await clanSchema.findOneAndDelete({ id: profileData.clan.id })
                await profileSchema.findOneAndUpdate({ userID: message.member.id }, {
                    clan: {
                        id: null,
                        permission: null,
                        memberEntrieNumber: null
                    }
                })
                await m.edit({ content: `Clan deletado com sucesso.`, components: [] })
                await setTimeout(() => { m.delete() }, 20000)
            }

            if (i.customId == 'negar') {
                await m.edit({ content: 'Pedido para deletar o clan negado com sucesso!' })
                await setTimeout(() => { m.delete() }, 20000)
            }
        })
    } catch (err) {
        if (err.code == 10062) return;
        console.error()
    }
}

module.exports.property = property