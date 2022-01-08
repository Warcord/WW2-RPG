const Event = require('../../structures/Event')

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: 'guildCreate'
        })
    }
    run = async (guild) => {
        console.log(guild)
        const configSchema = require('../../database/models/configSchema');
  
        await configSchema.create({
            serverID: guild.id,
            ownerID: guild.ownerId,
            prefix: "t!"
        })
    }
}