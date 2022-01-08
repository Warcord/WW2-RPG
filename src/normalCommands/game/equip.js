const NormalCommand = require('../../structures/NormalCommands')

const profileSchema = require('../../database/models/profileSchema')
const inventorySchema = require('../../database/models/inventorySchema')

module.exports = class extends NormalCommand {
    constructor(client) {
        super(client, {

            name: 'equip',
            description: 'Equipa o item mencionado.',
            aliases: ['equipar'],
            category: 'Game',
            howToUse: `equip [itemID]`
        })
    }

    run = async (client, message, args) => {

        const profileData = await profileSchema.findOne({ userID: message.author.id })
        if (!profileData) return message.reply({ content: `Você não tem um personagem criado, use **${await NormalCommand.prefix(message.guild)}create** para criar um.` });

        const inventoryData = await inventorySchema.findOne({ userID: message.member.id })
        if (!inventoryData) return message.reply({ content: `Você não tem um personagem criado, use **${await NormalCommand.prefix(message.guild)}create** para criar um.` });

        const mentionedItem = args[0]
        if (!mentionedItem) return message.reply({ content: `Mencione a ID de um item válido.` });
        if (!inventoryData.itensID.includes(args[0])) return message.reply({ content: `Este item não está em seu inventário.` });

        await profileSchema.findOneAndUpdate({ userID: message.member.id }, {
            equipedItem1: args[0]
        })

        return message.reply({ content: `Item com a ID \`\`${args[0]}\`\`, foi equipado com sucesso.` })
    }
}