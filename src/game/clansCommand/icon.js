const { MessageEmbed, MessageAttachment } = require('discord.js')
const clanSchema = require('../../database/models/clanSchema')
const profileSchema = require('../../database/models/profileSchema')


const property = async (client, message, args) => {

    const profileData = await profileSchema.findOne({ userID: message.member.id })
    if (!profileData) return message.reply({ content: `Use ${await this.prefix}create para criar um personagem.` });

    if (profileData.clan.id == null) return message.reply({ content: 'Você não está em um clan!' })
    if (profileData.clan.permission != 'OWNER') return message.reply({ content: 'Apenas o dono pode alterar os dados do clan.' })

    let atch = message.attachments.map(r => r.length)

    let obj = {
        type: null,
        url: null,
        size: null,
    }

    if (atch != 0) {
        obj = {
            type: message.attachments.map(r => r.width).toString(),
            url: message.attachments.map(r => r.url).toString(),
            size: message.attachments.map(r => r.size).toString(),
        }
    }

    if (atch == 0) {

        if (!args[0]) {
            return message.reply({ content: 'Adicione uma imagem para continuar.' })
        }
        atch = args[0]
    }

    if (atch == args[0]) {
        const attach = new MessageAttachment(args[0], 'IMAGEM', { size: 40, width: 562 })

        obj = {
            type: attach.width.toString(),
            url: attach.attachment.toString(),
            size: attach.size.toString()
        }
    }

    if (obj.type == '562' || '714' || '860') {
        if (obj.size > 60) return message.reply({ content: 'O tamanho de sua imagem é muito grande.' })

        await clanSchema.findOneAndUpdate({ id: profileData.clan.id }, {
            iconURL: obj.url
        })
        return message.reply({ content: 'Icone do clan alterado com sucesso!' })
    } else {
        return message.reply({ content: 'Adicione um tipo de arquivo válido.' })
    }
}


module.exports.property = property