const NormalCommand = require('../../structures/NormalCommands')

const { MessageEmbed } = require('discord.js')
const profileSchema = require('../../database/models/profileSchema')
const clanSchema = require('../../database/models/clanSchema')

module.exports = class extends NormalCommand {
    constructor(client) {
        super(client, {

            name: 'top',
            description: 'Mostra o top.',
            aliases: [''],
            category: 'Economia',
            howToUse: `top [tipo]`
        })
    }

    run = async (client, message, args) => {

        const typeTop = args.slice(0, 2).join(' ')
        
        if (!typeTop) return message.reply({ content: 'Adicione o tipo de top que deseja visualizar. (coins, xp, clan coins, clan xp etc.)' })

        if (typeTop == 'coins') {

            const profileData = await profileSchema.find().sort({ coins: -1 })

            profileData.length = 10;
            const finalEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('TOP COINS | 10 PRIMEIROS')
            .setThumbnail(message.guild.me.user.displayAvatarURL())
            .setTimestamp()
    
            for (const i in profileData) {
    
                const coins = profileData[i].coins
                var name = profileData[i].userName;
                var discordUser = client.users.cache.get(profileData[i].userID);
    
                const colocationNumber = parseInt(i)
                
                finalEmbed.addField(`[${colocationNumber+1}] ${name}(${discordUser.tag})`, `\`\`Coins: [${coins}]\`\``, false);
            }

            return message.reply({ embeds: [finalEmbed] })
        }

        if (typeTop == 'xp') {

            const profileData = await profileSchema.find().sort({ xp: -1 })

            profileData.length = 10;
            const finalEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('TOP XP | 10 PRIMEIROS')
            .setThumbnail(message.guild.me.user.displayAvatarURL())
            .setTimestamp()
    
            for (const i in profileData) {
    
                const xp = profileData[i].xp
                var name = profileData[i].userName;
                var discordUser = client.users.cache.get(profileData[i].userID);
    
                const colocationNumber = parseInt(i)
                
                finalEmbed.addField(`[${colocationNumber+1}] ${name}(${discordUser.tag})`, `\`\`Experiência: [${xp}]\`\``, false);
            }

            return message.reply({ embeds: [finalEmbed] })
        }

        if (typeTop == 'clan coins') {

            const clanData = await clanSchema.find().sort({ bank: -1 })

            clanData.length = 10;
            const finalEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('TOP CLAN COIN | 10 PRIMEIROS')
            .setThumbnail(message.guild.me.user.displayAvatarURL())
            .setTimestamp()
    
            for (const i in clanData) {
    
                const coins = clanData[i].bank
                var name = clanData[i].name;
                var clanTag = clanData[i].tag;
    
                const colocationNumber = parseInt(i)
                
                finalEmbed.addField(`[${colocationNumber+1}] ${name}(${clanTag})`, `\`\`Clan Coins: [${coins}]\`\``, false);
            }

            return message.reply({ embeds: [finalEmbed  ] })
        }

        if (typeTop == 'clan xp') {

            // const clanData = await clanSchema.find().sort({ xp: -1 })

            // profileData.length = 10;
            // const finalEmbed = new MessageEmbed()
            // .setColor('#ff0000')
            // .setTitle('TOP CLAN COIN | 10 PRIMEIROS')
            // .setThumbnail(message.guild.me.user.displayAvatarURL())
            // .setTimestamp()
    
            // for (const i in profileData) {
    
            //     const xp = profileData[i].xp
            //     var name = profileData[i].userName;
            //     var discordUser = message.guild.members.cache.get(profileData[i].userID);
    
            //     const colocationNumber = parseInt(i)
                
            //     finalEmbed.addField(`[${colocationNumber+1}] ${name}(${discordUser.user.tag})`, `\`\`Experiência: [${xp}]\`\``, false);
            // }

            return message.reply({ content: 'Em manutenção.' })
        }
    }
}