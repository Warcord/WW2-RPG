const NormalCommand = require('../../structures/NormalCommands')

const time = require('../../functions/time')
const ranks = require('../../game/ranks')
const profileSchema = require('../../database/models/profileSchema')

module.exports = class extends NormalCommand {
    constructor(client) {
        super(client, {

            name: 'battle',
            description: 'Inicia uma batalha.',
            aliases: ['batalhar', 'b'],
            category: 'Economia',
            howToUse: `battle [user*]`
        })
    }

    run = async (client, message, args) => {

        const profileData = await profileSchema.findOne({ userID: message.member.id })
        if (!profileData) return message.reply({ content: `Você não tem um personagem criado! Use ${await NormalCommand.prefix(message.guild)}create para criar um!` })
        // if (profileData.class == null) return message.reply({ content: `Para batalhar você precisa estar em uma classe, use ${await NormalCommand.prefix(message.guild)}class para continuar.` })
        if (profileData.battleCooldown != null) return message.reply({ content: `Você está em batalha! **${await NormalCommand.prefix(message.guild)}status** para ver o status de sua batalha.` })
        if (!args[0]) return message.reply({ content: 'Adicione o nível que deseja entrar em batalha.' })
        if (profileData.level < args[0]) return message.reply({ content: 'Seu nível é inferior ao nível adicionado.' })
        const verification = await ranks.verification(args[0], profileData.xp)

        await profileSchema.findOneAndUpdate({ userID: message.member.id }, {
            battleCooldown: verification.battleCooldown
        })

        return message.reply({ content: `Você entrou em batalha, nível: ${args[0]}` })

    }
}   