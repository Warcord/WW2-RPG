const profileSchema = require('../../database/models/profileSchema')
const clanSchema = require('../../database/models/clanSchema')
const randomNumber = require('../../functions/randomNumber')

const property = async (client, message, args) => {

    const profileData = await profileSchema.findOne({ userID: message.member.id })
    if (!profileData) return message.reply({ content: `Use ${await this.prefix}create para criar um personagem.` });

    const clanData = await clanSchema.findOne({ id: profileData.clan.id })
    if (clanData) return message.reply({ content: `Você já está em um clan.` });

    const name = args.join(' ')
    if (!name) return message.reply({ content: 'Adicione o nome que deseja colocar no clan.' })
    if (name.length > 12) {
        return message.reply({ content: 'O Nome do clan deve ser entre 12 caracteres.' })
    }

    const createClan = await clanSchema.create({
        ownerID: message.member.id,
        members: [message.member.id],
        name: name,
        id: randomNumber.code(6)
    })

    await profileSchema.findOneAndUpdate({ userID: message.member.id }, {
        clan: {
            id: `${createClan.id}`,
            memberEntrieNumber: 1,
            permission: 'OWNER'
        }
    })

    return message.reply({ content: `Clan com o nome ${createClan.name}, criado com sucesso!` })
}

module.exports.property = property