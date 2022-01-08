const configSchema = require("../database/models/configSchema")
const profileSchema = require('../database/models/profileSchema');

class NormalCommand {
    constructor(client, options) {
        this.client = client
        this.name = options.name
        this.description = options.description
        this.aliases = options.aliases
        this.category = options.category
        this.howToUse = options.howToUse
    }

    /**
     * @param {Guild} guild Guilda
    */

    static async prefix(guild) {
        
        const configData = await configSchema.findOne({ serverID: guild.id })
        if (!configData) return "t!"

        return configData.prefix
    }

    /**
     * @param {string} userID ID do usúario
    */
    
    static async getProfile(userID) {

        const profileData = await profileSchema.findOne({ userID })

        if (!profileData) return null
        return profileData
    }

    static async getEmoji(client, emojiID) {

        const emoji = client.emojis.cache.get(emojiID)
        return emoji;
    }
}

module.exports = NormalCommand