const registry = async () => {
    const items = require('./itens/soldierGunItens.json')
    const itensSchema = require('../database/models/itemSchema')
    const { code } = require('../functions/randomNumber')

    const item = items.itens[Math.floor(Math.random() * items.itens.length)]

    const itens = await itensSchema.find()
    var generatedID = code(6)
    for (var i in itens) {
        if (generatedID == itens[i].UID) {
            generatedID = code(6)
            continue;
        } else {
            break;
        }
    }

    const createItem = await itensSchema.create({
        UID: generatedID,
        name: item.name,
        description: item.description,
        type: item.type,
        prop: item.prop,
        propType: item.propType,
        typeHand: item.typeHand,
        rarity: item.rarity,
        val: item.val,
        status: true
    })
    return createItem;
}

module.exports = { registry }