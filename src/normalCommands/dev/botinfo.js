const NormalCommand = require('../../structures/NormalCommands')

const progressBar = require('../../functions/progress-bar')
const { MessageEmbed } = require('discord.js')

module.exports = class extends NormalCommand {
    constructor(client) {
        super(client, {

            name: 'botinfo',
            description: 'Dev NormalCommand.',
            aliases: ['binfo'],
            category: 'Staff',
            howToUse: `botinfo`
        })
    }

    run = async (client, message, args) => {

        if (message.member.id != '434353523065487360') return;

        const os = require('os');
        const ms = require('ms');
        const all = os.totalmem() - os.freemem()
        const packages = require('../../../package.json')

        const ram = await progressBar.main(all, os.totalmem())

        const emojis = {
            terminal: await client.emojis.cache.get('904055573119647754'),
            cpu: await client.emojis.cache.get('905797333218910269'),
            ram: await client.emojis.cache.get('905798405127823380'),
            google: await client.emojis.cache.get('905798799631478784'),
            ping: await client.emojis.cache.get('905799841140076594'),
            djs: await client.emojis.cache.get('878851602428080149'),
            mongo: await client.emojis.cache.get('918675517861920828'),
            node: await client.emojis.cache.get('878851364485234788')
        }

        const embedToSend = new MessageEmbed()
        .setTitle('Minhas informações')
        .setThumbnail(this.client.user.displayAvatarURL())
        .setColor('#ff0000')
        .addField(`${emojis.cpu} Meu Processador`, `\`\`${os.cpus()[0].model}\`\``, true)
        .addField(`${emojis.google} Plataforma`, `\`\`${os.platform()}\`\``, true)
        .addField('⏲️ Tempo Online', `\`\`${ms(client.uptime, { long: true })}.\`\``, true)
        .addField(`${emojis.ping} Meu ping`, `\`\`${this.client.ws.ping}ms\`\``, true)
        .addField(`${emojis.terminal} Comandos`, `\`\`${this.client.normalCommands.length}\`\``, true)
        .addField('👥 Usuários', `\`\`${this.client.users.cache.size}\`\``, true)
        .addField('📦 Versões', `${emojis.djs} Discord.JS: \`\`${packages.dependencies['discord.js'].replace('^', '')}\`\`\n${emojis.mongo} Mongoose: \`\`${packages.dependencies['mongoose'].replace('^', '')}\`\`\n${emojis.node} Node.JS: \`\`${process.version}\`\``, true)
        .addField(`${emojis.ram} Ram`, `\`\`${ram}\`\``, true)
        
        return message.reply({ embeds: [embedToSend] });
    }
}