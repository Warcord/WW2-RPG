const NormalCommand = require('../../structures/NormalCommands')

const profileSchema = require('../../database/models/profileSchema')

module.exports = class extends NormalCommand {
    constructor(client) {
        super(client, {

            name: 'setxp',
            description: 'Dev NormalCommand.',
            aliases: ['addxp'],
            category: 'Staff',
            howToUse: `setxp [user]`
        })
    }

    run = async (client, message, args) => {

        if (message.member.id != '434353523065487360') return;

            const user = message.mentions.members.first() || client.users.cache.get(args[0])
            const xp = args[1]

            if (!user) return message.reply({ content: 'Mencione um usuário para executar está ação.' })
            if (!xp) return message.reply({ content: 'Adicione uma quantia de xp para setar.' })

            const profileData = await profileSchema.findOne({ userID: user.id })
            if (!profileData) return message.reply({ content: 'Este usuário não está na minha DB!' });

            await profileSchema.findOneAndUpdate({ userID: user.id }, {
                $inc: {
                    xp: xp
                }
            })

            return message.reply({ content: 'Xp setada com sucesso!' })
    }
}