const NormalCommand = require('../../structures/NormalCommands')
const profileSchema = require('../../database/models/profileSchema');
const inventorySchema = require('../../database/models/inventorySchema')
const itemSchema = require('../../database/models/itemSchema')

module.exports = class extends NormalCommand {
    constructor(client) {
        super(client, {

            name: 'give',
            description: 'Envia coins a um usuário.',
            aliases: ['enviar', 'g', 'trocar'],
            category: 'Economia',
            howToUse: `give [user] [item/coins] [ID/quantia]`
        })
    }

    run = async (client, message, args) => {

        const profileData = await profileSchema.findOne({ userID: message.member.id })
        if (!profileData) return message.reply(`Você não tem um personagem criado, use **${await NormalCommand.prefix(message.guild)}create** para criar um.`);

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!user) return message.reply({ content: 'Erro, mencione um usuário para iniciar uma troca!' });
        if (user.id == message.member.id) return message.reply({ content: 'Você não pode iniciar uma troca para você mesmo.' });
        const userData = await profileSchema.findOne({ userID: user.id })
        if (!userData || user.user.bot) return message.reply({ content: `O Usuário mencionado não tem um perfil.` })

        const prop = args[1] == null? args[0] : args[1]
        if (!prop) return message.reply({ content: 'Adicione um tipo de item (após o usuário), para executar este comando.' });
        if (!["item", "itens", "coins", "coin"].includes(prop)) return message.reply({ content: `O Tipo do item está inválido. *Tipos aceitos: item, coin.*` })

        if (["coins", "coin"].includes(prop)) {

            const coins = args[2] == null? args[1] : args[2]
            if (!coins) return message.reply({ content: `Você não adicionou a quantia!` })
            if (coins <= 0) return message.reply({ content: `A Quantia deve ser maior que 0.` })
            if (parseInt(coins) > profileData.coins) return message.reply({ content: `A Quantia de coins adicionada é maior que a no banco.` })
            if (isNaN(parseInt(coins))) return message.reply({ content: `A Quantia deve ser um número.` })

            await profileSchema.findOneAndUpdate({
                userID: user.id,
            }, {
                $inc: {
                    coins: coins,
                }
            })

            await profileSchema.findOneAndUpdate({
                userID: message.member.id,
            }, {
                $inc: {
                    coins: -coins,
                }
            })

            return message.reply({ content: `Transação de **${coins}** coins, entre **${message.member.user.tag}** e **${user.user.tag}** bem sucedida.` });
        }

        if (["item", "itens"].includes(prop)) {

            const inventoryData = await inventorySchema.findOne({ userID: message.member.id })
            const userInvData = await inventorySchema.findOne({ userID: user.id })
            if (!inventoryData || !userInvData) return message.reply({ content: `Algo deu errado!` })

            const item = args[2] == null? args[1] : args[2]
            if (!item) return message.reply({ content: `Você não adicionou o ID do item.` })
            if (!inventoryData.itensID.includes(item)) return message.reply({ content: `Você não tem este item.` })
            const itemData = await itemSchema.findOne({ UID: item })
            if (!itemData) return message.reply({ content: `Algo deu errado!` })

            await inventorySchema.findOneAndUpdate({ userID: message.member.id }, {
                $pull: {
                    itensID: item
                }
            })

            await inventorySchema.findOneAndUpdate({ userID: user.id }, {
                $addToSet: {
                    itensID: item
                }
            })

            return message.reply({ content: `Item **${itemData.name}** enviado com sucesso para **${user.user.tag}(${userData.userName})**.`})
        }
    }
}