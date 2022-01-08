const item = async (itemType) => {
    const itensSchema = require('../database/models/itemSchema')

    const num = Math.random()

    const commonPercentage = 40
    const uncommonPercentage = 25
    const rarePercentage = 15
    const epicPercentage = 8
    const legedaryPercentage = 4
    const ultraPercentage = 0.1

    if (num < commonPercentage) {

        const commonItem = await itensSchema.find({ itemRarity: 'Comum' })
        return commonItem[Math.floor(Math.random() * commonItem.length)]
    }

    if (num < uncommonPercentage) {

        const a = await itensSchema.find({ itemRarity: 'Incomum' })
        return a[Math.floor(Math.random() * a.length)]
    }

    if (num < rarePercentage) {

        const a = await itensSchema.find({ itemRarity: 'Raro' })
        return a[Math.floor(Math.random() * a.length)]
    }

    if (num < epicPercentage) {

        const a = await itensSchema.find({ itemRarity: 'Épico' })
        return a[Math.floor(Math.random() * a.length)]
    }

    if (num < legedaryPercentage) {

        const a = await itensSchema.find({ itemRarity: 'Lendário' })
        return a[Math.floor(Math.random() * a.length)]
    }

    if (num < ultraPercentage) {

        const a = await itensSchema.find({ itemRarity: 'Ultra' })
        return a[Math.floor(Math.random() * a.length)]
    }
}

module.exports.item = item