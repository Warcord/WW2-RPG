const Event = require('../../structures/Event')

const configSchema = require('../../database/models/configSchema')

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: 'messageCreate'
        })
    }

    run = async (message) => {

        if (message.author.bot) return;
        if (message.channel.type === "DM") return;

        const configData = await configSchema.findOne({ serverID: message.guild.id })

        const prefix = !configData? "t!" : configData.prefix;

        try {
        if (!message.content.toLowerCase().startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).split(' ');
        const cmd = args.shift().toLowerCase();

        if (cmd.length === 0) return;

        const NormalCommand = this.client.normalCommands.find(c => c.name == cmd) || this.client.normalCommands.find(a => a.aliases && a.aliases.includes(cmd));

        if (!NormalCommand) return;
        if (NormalCommand) NormalCommand.run(this.client, message, args);
        } catch(error) {
            console.log('Erro em messageCreate.js', error)
        }
    }
}