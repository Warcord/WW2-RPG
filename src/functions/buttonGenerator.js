const { MessageButton } = require('discord.js')

/**
 * 
 * @param {*} button { style: string, customId: string, label: string, emoji: string }
 * @returns button
 */

const create = (button) => {

    const returns = new MessageButton()
        .setStyle(`${button.style}`)
        .setCustomId(`${button.customId}`)

        button.label == undefined? '' : returns.setLabel(`${button.label}`)
        button.emoji == undefined? '' : returns.setEmoji(`${button.emoji}`)

    return returns
}

module.exports = { create }