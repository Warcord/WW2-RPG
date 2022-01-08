const Event = require('../../structures/Event')

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: 'guildDelete'
        })
    }
    run = async (guild) => {
        console.log(guild)
        const configSchema = require('../../database/models/configSchema');
  
        await configSchema.findOneAndDelete({ serverID: guild.id })
    }
}