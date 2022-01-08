const { Schema, model } = require('mongoose')

const inventorySchema = new Schema({
    userID: { type: String, require: true, unique: true },
    itensID: [String],
    leftHand: { type: String },
    rightHand: { type: String }
})

module.exports = model('allInventorys', inventorySchema)