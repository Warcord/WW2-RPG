const NormalCommand = require('../../structures/NormalCommands')

const profileSchema = require('../../database/models/profileSchema');
const configSchema = require('../../database/models/configSchema')
const inventorySchema = require('../../database/models/inventorySchema')


module.exports = class extends NormalCommand {
    constructor(client) {
        super(client, {

            name: 'create',
            description: 'Cria um personagem.',
            aliases: ['criar'],
            category: 'Game',
            howToUse: `create [nomeDoPersonagem]`
        })
    }

    run = async (client, message, args) => {
        if (message.member.user.bot) return;

        const nomeDoPersonagem = args[0];
        const profileData = await profileSchema.findOne({ userID: message.member.id })

        if (await NormalCommand.getProfile(message.guild)) return message.channel.send({ content: 'Você já tem um personagem.' }).then((msg) => setTimeout(function () { msg.delete() }, 30000));;
        if (!nomeDoPersonagem) return message.channel.send({ content: 'Escreva o nome do personagem que deseja criar.' })

        if (!profileData) {
            await profileSchema.create({
                userID: message.member.id,
                userName: nomeDoPersonagem,
                serverID: message.guild.id,
                coins: 1000,
                typeUser: 'NON-PREMIUM',
                class: 'Tanqueiro',
                rank: 1,
                classEmojiId: '904584854295965716'
            });

            await inventorySchema.create({
                userID: message.member.id
            })

            message.channel.send({ content: `Personagem criado com sucesso! Digite **${await NormalCommand.prefix(message.guild)}battle** para iniciar uma batalha.` }).then((msg) => setTimeout(function () { msg.delete() }, 30000));
        }
    }
}