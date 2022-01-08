const { MessageEmbed } = require('discord.js')
const NormalCommand = require('../../structures/NormalCommands')
const time = require('../../functions/time')
const ranks = require('../../game/ranks')
const profileSchema = require('../../database/models/profileSchema')
const itemSchema = require('../../database/models/itemSchema')
const inventorySchema = require('../../database/models/inventorySchema')
const { registry } = require('../../game/registryItens')

module.exports = class extends NormalCommand {
    constructor(client) {
        super(client, {

            name: 'status',
            description: 'Veja o status da sua batalha',
            aliases: ['s'],
            category: 'Game',
            howToUse: `status`
        })
    }

    run = async (client, message, args) => {

        const profileData = await profileSchema.findOne({ userID: message.member.id })
        if (!profileData) return message.reply({ content: `Você não tem um personagem criado! Use ${await NormalCommand.prefix(message.guild)}create para criar um!` })

        const cooldown = profileData.battleCooldown
        if (cooldown == null) return message.reply({ content: `Você não está em uma batalha! Use ${await NormalCommand.prefix(message.guild)}battle [level]` })

        const timed = await time.time(cooldown - Date.now())
        if (cooldown > Date.now()) return message.reply({ content: `Você está em batalha! Espere **${timed.hour}h ${timed.min}m ${timed.seconds}s.**` })

        const verification = await ranks.verification(profileData.rank, profileData.xp)
        if (verification.lvlUp) {

            await profileSchema.findOneAndUpdate({ userID: message.member.id }, {
                rank: verification.lvlToUp,
                battleCooldown: null,
                $inc: {
                    xp: verification.xpToGive,
                    coins: verification.coinsToGive
                }
            })

            return message.reply({ content: `Você upou para o rank ${verification.rankType}. Parabéns!` })
        }

        await profileSchema.findOneAndUpdate({ userID: message.member.id }, {
            battleCooldown: null,
            $inc: {
                xp: verification.xpToGive,
                coins: verification.coinsToGive
            }
        })

        const itemData = await itemSchema.find({ status: true })
        if (itemData.length < Math.random()) {
            const item = await registry()

            await inventorySchema.findOneAndUpdate({ userID: message.member.id }, {
                $addToSet: {
                    itensID: item.UID
                }
            })

            await itemSchema.findOneAndUpdate({ UID: item.id }, {
                status: false
            })

            const embed = new MessageEmbed()
                .setTitle(`Status da Batalha`)
                .setColor('#ff0000')
                .setThumbnail(`${message.member.user.displayAvatarURL({ dynamic: true })}`)
                .addField(`🪙 Coins`, `${verification.coinsToGive}`)
                .addField(`${await NormalCommand.getEmoji(client, '925122132701225032')} Experiência`, `${verification.xpToGive}`)
                .addField(`${await NormalCommand.getEmoji(client, '925123384025686046')} Item`, `${item.name}`)

            return message.reply({ embeds: [embed] })
        }

        const embed = new MessageEmbed()
            .setTitle(`Status da Batalha`)
            .setColor('#ff0000')
            .setThumbnail(`${message.member.user.displayAvatarURL({ dynamic: true })}`)
            .addField(`🪙 Coins`, `${verification.coinsToGive}`)
            .addField(`${await NormalCommand.getEmoji(client, '925122132701225032')} Experiência`, `${verification.xpToGive}`)

        return message.reply({ embeds: [embed] })
    }
}