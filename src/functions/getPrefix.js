const prefix = async (server) => {

    const configSchema = require('../database/models/configSchema')
    const configData = await configSchema.findOne({ serverID: server.id });

    if (!configData) return `g!`;
    return configData.prefix;
}

module.exports.prefix = prefix