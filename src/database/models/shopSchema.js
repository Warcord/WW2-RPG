const { Schema, model } = require('mongoose')

const shopSchema = new Schema({
    items: [
        {
            id: { type: String, require: true, unique: true },
            price: { type: Number, require: true, unique: false },
            authorID: { type: Number, require: true, unique: false }
        }
    ],
    clientID: { type: String, require: true, unique: true }
})

module.exports = model('shop', shopSchema)