const { Schema, model } = require('mongoose')

const profileSchema = new Schema({
    userID: { type: String, require: true, unique: true },
    userName: { type: String, require: true },
    class: { type: String, require: true, default: null },
    serverID: { type: String, require: true },
    coins: { type: Number, default: 1000 },
    xp: { type: Number, default: 0 },
    dailyKitCooldown: { type: String, default: null },
    battleCooldown: { type: String, default: null },
    rank: { type: String, default: null },
    classEmojiId: { type: String, default: null },
    typeUser: { type: String, default: 0 },
    kdr: { type: Number, default: 0 },
    equipedItem1: { type: String, default: null },
    equipedItem2: { type: String, default: null },
    clan: {
        id: { type: String, default: null },
        memberEntrieNumber: { type: Number, default: null },
        permission: { type: String, default: null }
    },
    wins: { type: Number, default: null },
    defeats: { type: Number, default: null }
}, {
    timestamps: true
})

module.exports = model('profiles', profileSchema)