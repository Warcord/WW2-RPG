const { Schema, model } = require('mongoose')

const clanSchema = new Schema({

    ownerID: { type: String, require: true, unique: true },
    members: [String],
    bank: { type: Number, default: 0 },
    name: { type: String, require: true, unique: true },
    id: { type: String, require: true, unique: true },
    maxMembers: { type: Number, default: 50 },
    iconURL: { type: String, default: null },
    description: { type: String, default: null },
    lvl: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    maxCoins: { type: Number, default: 350000 },
    nation: { type: String, default: null },
    tag: { type: String, default: null },
    boosters: {
        coins: { type: String, default: null },
        xpForMembers: { type: String, default: null },
        xpForClan: { type: String, default: null }
    },
    inBattle: [String]
    
}, {
    timestamps: true
})

module.exports = model('clans', clanSchema)