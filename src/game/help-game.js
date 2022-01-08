const helpEmbed = async (client) => {

    const { MessageEmbed } = require('discord.js')
    const { readdirSync } = require('fs')

    const commandsOfClans = readdirSync('src/game/clansCommand')
    const arrayOfClans = new Array()
    
    for (const NormalCommand of commandsOfClans) {
        arrayOfClans.push(NormalCommand.replace('.js', ''))
    }

    const economyCommand = await client.loadNormalCommands('src/normalCommands', 'Economia', true)
    const arrayOfEconomy = new Array()

    for (const i in economyCommand) {

        const commandName = economyCommand[i].name

        arrayOfEconomy.push(commandName)
    }

    const embed = new MessageEmbed()
        .setTitle('Comandos do Jogo')
        .setColor('#ff0000')
        .addField('Clans', `\`\`\`clan, ${arrayOfClans.join(', ')}.\`\`\``)
        .addField('Economia', `\`\`\`${arrayOfEconomy.join(', ')}.\`\`\``)

    return embed;
}

module.exports = { helpEmbed }