const inventorySchema = require('../database/models/inventorySchema')
const profileSchema = require('../database/models/profileSchema');
const shopSchema = require('../database/models/shopSchema');

/**
 * @param {string} userID ID do Usuário
 * @param {string} itemID ID do item que deseja comprar.
 * @param {number} itemPrice Valor do item
 * @returns {boolean} true = compra realizada com sucesso/false = erro durante a compra
 */

const buy = async (client, userID, itemID, itemPrice) => {

    const inventoryData = await inventorySchema.findOne({ userID })
    if (!inventoryData) return false;

    const profileData = await profileSchema.findOne({ userID })
    if (!profileData) return false;
    if (profileData.coins < itemPrice) return false;

    await profileSchema.findOneAndUpdate({ userID }, {
        $inc: {
            coins: -itemPrice
        }
    })

    const item = await shopSchema.findOne({ clientID: client.user.id })
    const filtering = item.items.filter(i => i.id == itemID)

    await profileSchema.findOneAndUpdate({ userID: filtering[0].authorID }, {
        $inc: {
            coins: itemPrice
        }
    })

    await shopSchema.findOneAndUpdate({ clientID: client.user.id }, {
        $pull: {
            items: { id: itemID }
        }
    })

    await inventorySchema.findOneAndUpdate({ userID }, {
        $addToSet: {
            itensID: itemID
        }
    })

    return true;
}

module.exports = { buy }