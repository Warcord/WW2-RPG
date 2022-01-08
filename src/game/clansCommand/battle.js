// const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
// const profileSchema = require('../../database/models/profileSchema')
// const clanSchema = require('../../database/models/clanSchema')

// const property = async (client, message, args) => {

//     if (args.length > 4) return message.reply({ content: 'O Máximo permitido em batalha é 4 membros.' })
//     if (args.length <= 2) return message.reply({ content: 'O Minímo permitido em batalha é 2 membros.'})

//     if (args)

//     const clanData = await clanSchema.findOneAndUpdate({ clanID: profileData.clan.id }, {
//         $addToSet: {
//             inBattle: args
//         }
//     })
// }

//INCOMPLETE