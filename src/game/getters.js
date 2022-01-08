const clanSchema = require('../database/models/clanSchema')
const profileSchema = require('../database/models/profileSchema')
const ranks = require('../game/ranks');

/**
 * @param {string} userID ID do usuário
 * @returns {object}
 */

const getUser = async (userID) => {

    if (!userID || typeof userID != 'string') {
        throw new Error("Forneça a ID do usuário corretamente.")
    }

    const profileData = await profileSchema.findOne({ userID })
    if (!profileData) {
        throw new Error("O Usuário não existe.")
    }
    return profileData;
}

/**
 * @param {string} ownerID ID do dono do clan
 * @returns {object}
 */

const getClan = async (ownerID) => {

    if (!ownerID || typeof ownerID != 'string') {
        return null
    }

    const clanData = await clanSchema.findOne({ ownerID })
    if (!clanData) {
        return null
    }
    return clanData;
}

/**
 * @param {string} userID ID do usuário
 * @returns {object}
 */

const getUserRank = async (userID) => {

    if (!userID || typeof userID != 'string') {
        throw new Error("Forneça a ID do usuário corretamente.")
    }

    const userData = await getUser(`${userID}`)
    if (!userData) {
        throw new Error("O Usuário não existe.")
    }

    const getRank = await ranks.verification(userData.rank, userData.xp, true)

    return [{ actualRank: getRank[1].rank, actualRankType: getRank[1].rankType }, { toGetRank: getRank[0].rank, toGetRankType: getRank[0].rankType, neededXp: getRank[0].neededXp }]
    
}

/**
 * @param {string} userID ID do usuário
 * @returns {object}
 */

const getRankDB = async (userID) => {

    if (!userID || typeof userID != 'string') {
        return null
    }

    const userData = await getUser(`${userID}`)
    if (!userData) {
        return null
    }

    var coins = await profileSchema.find().sort({ coins: -1 })
    for (let i = 0; i < coins.length; i++) {
        const id = coins[i].userID
        if (id == userID) {
            coins = i + 1
            break;
        } else {
            continue;
        }
    }

    var xp = await profileSchema.find().sort({ xp: -1 })
    for (let i = 0; i < xp.length; i++) {
        const id = xp[i].userID
        if (id == userID) {
            xp = i + 1
            break;
        } else {
            continue;
        }
    }
    var victories = await profileSchema.find().sort({ wins: -1 })
    for (let i = 0; i < victories.length; i++) {
        const id = victories[i].userID
        if (id == userID) {
            victories = i + 1
            break;
        } else {
            continue;
        }
    }

    const obj = {
        coins,
        xp,
        victories
    }
    
    return obj
}

module.exports = { getUser, getClan, getUserRank, getRankDB }