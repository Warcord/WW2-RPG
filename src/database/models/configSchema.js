const { Schema, model } = require('mongoose')

const configSchema = new Schema({
    serverID: { type: String, require: true, unique: true },
    ownerID: { type: String, require: true, unique: false },
    prefix: { type: String, require: true, default: "t!" }
})

module.exports = model('server-config', configSchema)