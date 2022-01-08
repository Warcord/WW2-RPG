const { Schema, model } = require('mongoose')

const itensSchema = new Schema({
    UID: { type: String, require: true, unique: true },
    name: { type: String, require: true, default: null },
    description: { type: String, default: null },
    type: { type: String, require: true, default: null },
    prop: { type: String, default: null },
    rarity: { type: String, require: true, default: null },
    typeHand: { type: String, require: true, default: null },
    val: { type: Number, require: true, default: null },
    propType: { type: String, require: true, default: null },
    model: { type: String, require: true, default: null },
    status: { type: Boolean, require: true, default: false }
})

module.exports = model('allItens', itensSchema)