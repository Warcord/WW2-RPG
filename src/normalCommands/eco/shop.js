const { MessageEmbed, MessageActionRow } = require('discord.js')
const NormalCommand = require('../../structures/NormalCommands')
const itemSchema = require('../../database/models/itemSchema')
const { create } = require('../../functions/buttonGenerator')
const { buy } = require('../../game/shop')
const shopSchema = require('../../database/models/shopSchema')

module.exports = class extends NormalCommand {
    constructor(client) {
        super(client, {

            name: 'shop',
            description: 'Loja oficial do Bot',
            aliases: ['loja'],
            category: 'Economia',
            howToUse: `shop`
        })
    }

    run = async (client, message, args) => {

        if (!await NormalCommand.getProfile(message.member.id)) return message.reply({ content: `Você não tem um personagem criado, use **${await NormalCommand.prefix(message.guild)}create** para criar um.` });

        const shopData = await shopSchema.findOne({ clientID: this.client.user.id })
        if (shopData.items.length <= 0) return message.reply({ content: `A Loja está vazia.` })
        const itens = []

        for (var item in shopData.items) {
            const itemData = await itemSchema.findOne({ UID: shopData.items[item].id })
            if (item > shopData.items.length) break;

            itemData.val = shopData.items[item].price

            itens.push(itemData)
            continue;
        }

        const button = new MessageActionRow()
            .addComponents(
                create({
                    style: 'PRIMARY',
                    customId: 'previous',
                    emoji: '⬅️'
                }),
                create({
                    style: 'PRIMARY',
                    customId: 'next',
                    emoji: '➡️'
                }),
                create({
                    style: 'SUCCESS',
                    customId: 'buy',
                    emoji: '💰'
                })
            )

        const embed = new MessageEmbed()
            .setTitle('SHOP')
            .setColor('#ff0000')
            .setThumbnail(`${this.client.user.displayAvatarURL()}`)
            .setDescription(`${itens[0].description}`, true)
            .addField('Nome', `${itens[0].name}`, true)
            .addField('Proporciona', `${itens[0].prop} de ${itens[0].propType}`, true)
            .addField('Tipo', `${itens[0].type}`, true)
            .addField('Raridade', `${itens[0].rarity}`, true)
            .addField('Valor', `${itens[0].val}`, true)
            .setFooter(`item 1 de ${itens.length}`)

        const msg = await message.reply({ embeds: [embed], components: [button] })

        const filter = (i) => {
            return ["next", "previous", "buy"].includes(i.customId) && i.user.id == message.member.id
        }

        const collector = await msg.channel.createMessageComponentCollector({ filter, idle: 60000 })

        var n = 0;

        collector.on('collect', async (i) => {

            if (i.customId == "next") {

                if (n + 1 > itens.length - 1) {
                    n = 0

                    if (!itens[n]) return;

                    const newEmbed = new MessageEmbed()
                        .setTitle('SHOP')
                        .setColor('#ff0000')
                        .setThumbnail(`${this.client.user.displayAvatarURL()}`)
                        .addField('Nome', `${itens[n].name}`, true)
                        .addField('Proporciona', `${itens[n].prop}`, true)
                        .addField('Tipo', `${itens[n].type}`, true)
                        .addField('Raridade', `${itens[n].rarity}`, true)
                        .addField('Valor', `${itens[n].val}`, true)
                        .setFooter(`item ${n + 1} ${itens.length}`)

                    return i.update({ embeds: [newEmbed], components: [button] })
                };

                n = n + 1
                if (!itens[n]) return;

                const newEmbed = new MessageEmbed()
                    .setTitle('SHOP')
                    .setColor('#ff0000')
                    .setThumbnail(`${this.client.user.displayAvatarURL()}`)
                    .addField('Nome', `${itens[n].name}`, true)
                    .addField('Dano', `${itens[n].prop}`, true)
                    .addField('Tipo', `${itens[n].type}`, true)
                    .addField('Raridade', `${itens[n].rarity}`, true)
                    .addField('Valor', `${itens[n].val}`, true)
                    .setFooter(`item ${n + 1} ${itens.length}`)

                return i.update({ embeds: [newEmbed], components: [button] })
            }

            if (i.customId == "previous") {

                if (n - 1 < 0) {
                    n = itens.length - 1

                    if (!itens[n]) return;

                    const newEmbed = new MessageEmbed()
                        .setTitle('SHOP')
                        .setColor('#ff0000')
                        .setThumbnail(`${this.client.user.displayAvatarURL()}`)
                        .addField('Nome', `${itens[n].name}`, true)
                        .addField('Proporciona', `${itens[n].prop}`, true)
                        .addField('Tipo', `${itens[n].type}`, true)
                        .addField('Raridade', `${itens[n].rarity}`, true)
                        .addField('Valor', `${itens[n].val}`, true)
                        .setFooter(`item ${n + 1} ${itens.length}`)

                    return i.update({ embeds: [newEmbed], components: [button] })
                };

                n = n - 1
                if (!itens[n]) return;

                const newEmbed = new MessageEmbed()
                    .setTitle('SHOP')
                    .setColor('#ff0000')
                    .setThumbnail(`${this.client.user.displayAvatarURL()}`)
                    .addField('Nome', `${itens[n].name}`, true)
                    .addField('Proporciona', `${itens[n].prop}`, true)
                    .addField('Tipo', `${itens[n].type}`, true)
                    .addField('Raridade', `${itens[n].rarity}`, true)
                    .addField('Valor', `${itens[n].val}`, true)
                    .setFooter(`item ${n + 1} ${itens.length}`)

                return i.update({ embeds: [newEmbed], components: [button] })
            }

            if (i.customId == "buy") {

                const callFunc = await buy(client, message.member.id, itens[n].id, itens[n].val)
                if (!callFunc) return message.reply({ content: `Algo deu errado. Verifique se há saldo o suficiente em sua conta para a compra.` })

                return i.update({ content: `Item **${itens[n].name}**, comprado com sucesso por **${itens[n].val}** coins.`, embeds: [], components: [] })
            }
        })
    }
}