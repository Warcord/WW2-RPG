const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const profileSchema = require('../../database/models/profileSchema')
const clanSchema = require('../../database/models/clanSchema')


const property = async (client, message, args) => {

    const profileData = await profileSchema.findOne({ userID: message.member.id })
    if (!profileData) return message.reply({ content: `Use ${await this.prefix}create para criar um personagem.` });


    let clanName = args.join(' ')
    var clanDados = await clanSchema.findOne({ name: clanName })
    if (!clanDados && clanName.length > 0) return message.reply({ content: 'Clan mencionado não foi encontrado.' })

    if (!clanName) {
        clanName = await clanSchema.findOne({ id: profileData.clan.id }) ? (await clanSchema.findOne({ id: profileData.clan.id })).name : false
    }

    const clanData = await clanSchema.findOne({ name: clanName })
    if (!clanData) return message.reply({ content: `Clan não encontrado.` });

    const embed = new MessageEmbed()
        .setTitle(`Banco de ${clanData.name}`)
        .setColor('#ff0000')
        .setThumbnail(clanData.iconURL == null ? client.user.displayAvatarURL() : clanData.iconURL)
        .addField('Saldo', `${clanData.bank}`)
        .setTimestamp()

    const sendEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`Escreva abaixo a quantia que deseja enviar ao banco.`)
        .setTimestamp()

    const buttons = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(`enviar`)
                .setEmoji('💰')
                .setStyle('SUCCESS'),

            new MessageButton()
                .setCustomId(`close`)
                .setEmoji(`⏹️`)
                .setStyle('DANGER'),
        );
    const buttonsOne = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(`close`)
                .setEmoji(`⏹️`)
                .setStyle('DANGER'),
        );

    try {
        var m;
        if (clanData.members.includes(message.member.id)) {
            m = await message.reply({ embeds: [embed], components: [buttons] })
        } else {
            m = await message.reply({ embeds: [embed], components: [buttonsOne] })
        }

        const filter = (i) => {
            return ['enviar', 'close'].includes(i.customId) && i.user.id === message.member.id;
        }

        const collector = message.channel.createMessageComponentCollector({ filter, idle: 60000 * 10 });

        collector.on('collect', async i => {
            if (i.customId == 'enviar') {

                await i.update({ embeds: [sendEmbed], components: [buttonsOne] });
                const filter2 = (msg) => {
                    console.log(msg)
                    return msg.member.id == message.member.id
                }
                const collector2 = message.channel.createMessageCollector({ filter2, time: 60000 * 3 })

                collector2.on('collect', async msg => {
                    if (parseInt(msg.content)) {

                        const finalEmbed = new MessageEmbed()
                            .setColor('#159815')
                            .setDescription(`Transferência de **${msg.content} moeadas** realizada com sucesso.`)
                            .setTimestamp()

                        await profileSchema.findOneAndUpdate({ userID: message.member.id }, {
                            $inc: {
                                coins: -msg.content
                            }
                        })
                        await clanSchema.findOneAndUpdate({ id: clanData.id }, {
                            $inc: {
                                bank: msg.content
                            }
                        })

                        return m.edit({ embeds: [finalEmbed], components: [] })

                    } else {
                        collector2.stop()
                        return message.channel.send({ content: `${message.member}, a mensagem deve ser um número!` })
                    }
                })
            }

            if (i.customId == 'close') {
                collector.stop()
                setTimeout(() => { }, 500)
                return m.delete();
            }
        })
    } catch (err) {
        if (err.code == 10008) return;
        console.error();
    }
}

module.exports.property = property