const NormalCommand = require('../../structures/NormalCommands')

const { MessageActionRow } = require('discord.js')
const itemSchema = require('../../database/models/itemSchema')
const shopSchema = require('../../database/models/shopSchema')
const inventorySchema = require('../../database/models/inventorySchema')
const { create } = require('../../functions/buttonGenerator')
const profileSchema = require('../../database/models/profileSchema')

module.exports = class extends NormalCommand {
    constructor(client) {
        super(client, {

            name: 'sell',
            description: 'Coloca um item na loja',
            aliases: ['vender'],
            category: 'Economia',
            howToUse: `sell [ID do Item] [valor]`
        })
    }

    run = async (client, message, args) => {

        try {

            if (!await NormalCommand.getProfile(message.member.id)) return message.reply({ content: `Você não tem um personagem criado, use **${await NormalCommand.prefix(message.guild)}create** para criar um.` });

            const invData = await inventorySchema.findOne({ userID: message.member.id })
            if (!invData) return message.reply({ content: `Você não tem um personagem criado, use **${await NormalCommand.prefix(message.guild)}!create** para criar um.` });
            
            if (!invData.itensID.includes(args[0])) return message.reply({ content: `Você não tem este item.` })

            const itemData = await itemSchema.findOne({ UID: args[0] })
            if (!itemData) return;

            if (!args[1]) return message.reply({ content: `Adicione uma quantia **após a ID** para executar este comando.` })

            const button = new MessageActionRow()
                .addComponents(
                    create({
                        style: 'SUCCESS',
                        customId: 'yes',
                        emoji: '✅'
                    }),
                    create({
                        style: 'DANGER',
                        customId: 'no',
                        emoji: '❌'
                    })
                )

            const msg = await message.reply({ content: `Você deseja colocar **${itemData.name}** por ${args[1]} coins na loja? *Será cobrado uma taxa de 15%*`, components: [button] })

            const filter = (i) => {
                return ["yes", "no"].includes(i.customId) && i.user.id == message.member.id
            }

            const collector = await msg.channel.createMessageComponentCollector({ filter, idle: 60000 })

            collector.on('collect', async (i) => {

                try {

                    if (i.customId == "yes") {

                        if (Math.floor(((await NormalCommand.getProfile(message.member.id)).coins * 0.15 / 100)) < 0 || isNaN(Math.floor(((await NormalCommand.getProfile(message.member.id)).coins * 0.15 / 100)))) return i.update({ content: `Você não tem saldo para essa ação.`, components: [] })

                        await shopSchema.findOneAndUpdate({ clientID: this.client.user.id }, {
                            $addToSet: {
                                items: { id: args[0], price: args[1], authorID: message.member.id }
                            },
                            clientID: this.client.user.id
                        }, {
                            upsert: true
                        })

                        await profileSchema.findOneAndUpdate({ userID: message.member.id }, {
                            $inc: {
                                coins: -Math.floor(((await NormalCommand.getProfile(message.member.id)).coins * 15 / 100))
                            }
                        })

                        await inventorySchema.findOneAndUpdate({ userID: message.member.id }, {
                            $pull: {
                                itensID: args[0]
                            }
                        })

                        return i.update({ content: `O Item **${itemData.name}** por **${args[1]}** coins, foi colocado na loja com sucesso!`, components: [] })
                    }

                    if (i.customId == "no") {
                        return await i.update({ content: `Operação cancelada com sucesso!`, components: [] })
                    }
                } catch (err) {
                    if (err.code == 10062) return;
                    console.error(err)
                    return;
                }
            })

        } catch (err) {
            if (err.code == 10062) return;
            console.error(err)
            return;
        }
    }
}