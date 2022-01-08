const NormalCommand = require('../../structures/NormalCommands')
const { MessageEmbed } = require('discord.js')
const { discloud } = require('../../functions/log')

module.exports = class extends NormalCommand {
    constructor(client) {
        super(client, {

            name: 'dclog',
            description: 'Mostra a log da discloud.',
            aliases: ['dl'],
            category: 'Moderação',
            howToUse: 'dclog'
        })
    }

    run = async (client, message, args) => {

        if (message.author.id != '434353523065487360') return;

        const data = await discloud.log()

        const embed = new MessageEmbed()
            .setTitle('DISCLOUD LOG')
            .setColor('#ff0000')
            .setDescription(`\`\`\`js\n${await data.logs}\`\`\``)
            .setTimestamp()


        return message.reply({ embeds: [embed] })
    }
}