const NormalCommand = require('../../structures/NormalCommands')
const { MessageEmbed } = require('discord.js')
const { logContent } = require('../../functions/log')

module.exports = class extends NormalCommand {
    constructor(client) {
        super(client, {

            name: 'loge',
            description: 'Mostra a log de erros.',
            aliases: ['le'],
            category: 'Moderação',
            howToUse: 'loge'
        })
    }

    run = async (client, message, args) => {

        if (message.author.id != '434353523065487360') return;

        const data = logContent()

        const embed = new MessageEmbed()
            .setTitle('ERROR LOG')
            .setColor('#ff0000')
            .setDescription(`\`\`\`js\n${await data}\`\`\``)
            .setTimestamp()


        return message.reply({ embeds: [embed] })
    }
}