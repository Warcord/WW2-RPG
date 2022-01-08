const NormalCommand = require('../../structures/NormalCommands')

const { MessageEmbed } = require('discord.js')
const { helpEmbed } = require('../../game/help-game')

module.exports = class extends NormalCommand {
    constructor(client) {
        super(client, {

            name: 'help',
            description: 'Veja meus comandos.',
            aliases: ['ajuda'],
            category: 'Informação',
            howToUse: `help [comando/categoria/all*]`
        })
    }

    run = async (client, message, args) => {

        const commandName = args[0]

        if (!commandName) {

            const commands = await this.client.loadNormalCommands('src/normalCommands', 'all')
            
            var informationCommands = commands.map((a) => {
                if (a.category == 'Informação') return a.name
            }).filter(a => a != undefined)
            var gameCommands = commands.map((a) => {
                if (a.category == 'Game') return a.name
            }).filter(a => a != undefined)
            var ecoCommands = commands.map((a) => {
                if (a.category == 'Economia') return a.name
            }).filter(a => a != undefined)

            const embed = new MessageEmbed()
            .setTitle('Todos os Meus Comandos')
            .setColor('#ff0000')
            .setThumbnail(this.client.user.displayAvatarURL())
            .setDescription(`Seja bem-vindo ao meu menu de ajuda! Use \`${await NormalCommand.prefix(message.guild)}help [comando]\` para ver informações de um comando.\nMostrando atualmente: Todos os Comandos`)
            .addField('Informação', `\`\`\`${informationCommands.length <= 1 ? informationCommands : informationCommands.join(', ')}.\`\`\``)
            .addField('Game', `\`\`\`${gameCommands.length <= 1 ?  gameCommands : gameCommands.join(', ')}.\`\`\``)
            .addField('Econômia', `\`\`\`${ecoCommands.length <= 1 ?  ecoCommands : ecoCommands.join(', ')}.\`\`\``)
            .setTimestamp()

            return message.reply({ embeds: [embed] })
        } else if (commandName == 'game') {
            return message.reply({ embeds: [await helpEmbed(this.client)] });
        } else {

            const command = await this.client.loadNormalCommands('src/normalCommands', commandName)

            const embed = new MessageEmbed()
            .setTitle(`Informações sobre um Comando`)
            .setColor('#ff0000')
            .setThumbnail(this.client.user.displayAvatarURL())
            .addField(`Nome`, `${command.name}`)
            .addField(`Descrição`, `${command.description}`)
            .addField(`Categoria`, `${command.category}`, true)
            .addField(`Aliases`, `${command.aliases? this.aliases.join(', ') : 'Nenhum'}.`, true)
            .addField(`Como usar`, `\`\`${await NormalCommand.prefix(message.guild)}${command.howToUse}\`\``)
            .setTimestamp()

            return message.reply({ embeds: [embed] })
        }
    }
}