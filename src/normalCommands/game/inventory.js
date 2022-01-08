const NormalCommand = require('../../structures/NormalCommands')

const inventorySchema = require('../../database/models/inventorySchema')
const profileSchema = require('../../database/models/profileSchema')
const itemSchema = require('../../database/models/itemSchema')
const { MessageEmbed } = require('discord.js')

module.exports = class extends NormalCommand {
    constructor(client) {
        super(client, {

            name: 'inventory',
            description: 'Vê o inventário de um usuário.',
            aliases: ['inv'],
            category: 'Game',
            howToUse: `inv [user*]`
        })
    }

    run = async (client, message, args) => {

        const inventoryData = await inventorySchema.findOne({ userID: message.member.id })
        if (!inventoryData) return message.reply(`Você não tem um personagem criado, use **${await NormalCommand.prefix(message.guild)}create** para criar um.`);

        const profileData = await profileSchema.findOne({ userID: message.member.id })
        if (!profileData) return message.reply(`Você não tem um personagem criado, use **${await NormalCommand.prefix(message.guild)}create** para criar um.`);

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        if (!user) return message.reply({ content: 'Algo deu errado.' })

        const embed = new MessageEmbed()
            .setTitle(`INVENTÁRIO DE ${user.user.tag}`)
            .setColor('#ff0000')
            .setThumbnail(user.user.displayAvatarURL())
            .setTimestamp();

        if (inventoryData.itensID.length <= 0) {
            await embed.setDescription('Inventário vazio.')
        } else {
            inventoryData.itensID.length = 10
            for (var item in inventoryData.itensID) {
                
                if (item > inventoryData.itensID.length) break;
                if (!inventoryData.itensID[item]) break;

                const itemID =  inventoryData.itensID[item].replace(' ', '')
                const itemData = await itemSchema.findOne({ UID: `${itemID}` })

                if (itemData.UID == profileData.equipedItem1 || itemData.UID == profileData.equipedItem2) {
                    await embed.addField(`${itemData.name} (equipado)`, `- **Tipo:** ${itemData.type}, **ID:** \`\`${itemData.UID}\`\`, **Dano:** ${itemData.prop}, **Valor:** ${itemData.val}`);
                    continue;
                } else {
                    await embed.addField(`${itemData.name}`, `- **Tipo:** ${itemData.type}, **ID:** \`\`${itemData.UID}\`\`, **Dano:** ${itemData.prop}, **Valor:** ${itemData.val}`);
                    continue;
                }
            }
        }

        return message.reply({ embeds: [embed] });
    }
}