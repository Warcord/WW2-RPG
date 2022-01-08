const NormalCommand = require('../../structures/NormalCommands')

const profileSchema = require('../../database/models/profileSchema')
const inventorySchema = require('../../database/models/inventorySchema')

module.exports = class extends NormalCommand {
    constructor(client) {
        super(client, {

            name: 'deluser',
            description: 'Dev NormalCommand.',
            aliases: ['deletar', 'del'],
            category: 'Staff',
            howToUse: `deluser [user]`
        })
    }

    run = async (client, message, args) => {

        if (message.member.id != '434353523065487360') return;

        const user = message.mentions.members.first() || client.users.cache.get(args[0])

        if (!user) return message.reply({ content: 'Você precisa mencionar um usuário para executar está ação!' })

        const profileData = await profileSchema.findOne({ userID: user.id })
        if (!profileData) return message.reply({ content: 'Este usuário não está em minha DB.' })

        await profileSchema.findOneAndDelete({ userID: user.id });
        await inventorySchema.findOneAndDelete({ userID: user.id });
        message.reply({ content: `Usuário com a ID: ${user.id}, foi deletado com sucesso!`})
    }
}