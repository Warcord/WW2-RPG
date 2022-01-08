const profileSchema = require('../../database/models/profileSchema')
const clanSchema = require('../../database/models/clanSchema')

const property = async (client, message, args) => {

    const profileData = await profileSchema.findOne({ userID: message.member.id })
    if (!profileData) return message.reply({ content: `Use ${await this.prefix}create para criar um personagem.` });

    if (profileData.clan.id == null) return message.reply({ content: 'Você não está em um clan!' })
    if (profileData.clan.permission != 'OWNER') return message.reply({ content: 'Apenas o dono pode alterar os dados do clan.' })

    const clanTag = args.join(' ')
    if (!clanTag) return message.reply({ content: 'Adicione uma tag para executar este comando!' })
    if (!clanTag.length > 3) return message.reply({ content: 'A Tag não pode passar de 3 caracteres.' })

    await clanSchema.findOneAndUpdate({ id: profileData.clan.id }, {
        tag: clanTag
    })
    return message.reply({ content: 'Tag do clan alterada com sucesso!' })
}


module.exports.property = property