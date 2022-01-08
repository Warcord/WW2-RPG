const clanSchema = require('../../database/models/clanSchema')
const profileSchema = require('../../database/models/profileSchema')

const property = async (client, message, args) => {

    const profileData = await profileSchema.findOne({ userID: message.member.id })
    if (!profileData) return message.reply({ content: `Use ${await this.prefix}create para criar um personagem.` });

    if (profileData.clan.id == null) return message.reply({ content: 'Você não está em um clan!' })
    if (profileData.clan.permission != 'OWNER') return message.reply({ content: 'Apenas o dono pode alterar os dados do clan.' })

    const clanDescription = args.join(' ')
    if (!clanDescription) return message.reply({ content: 'Adicione uma descrição para executar este comando!' })
    if (!clanDescription.length > 40) return message.reply({ content: 'A descrição não pode passar de 40 caracteres.' })

    await clanSchema.findOneAndUpdate({ id: profileData.clan.id }, {
        description: clanDescription
    })
    return message.reply({ content: 'Descrição do clan alterada com sucesso!' })
}

module.exports.property = property