/**
 * @param {string} rank Level atual do usuário
 * @param {number} xp Experiência do usuário
 * @param {boolean} toNextLevel true = retorna o próximo level/false = retorna apenas o level atual
 * @returns {object} xpToGive, coinsToGive, battleCooldown, lvlUp, lvlToUp
*/

const verification = async (rank, actualXp, toNextLevel) => {

    const rankType = require('../game/tankerRanks.json')

    const currentLevel = rankType.ranks.filter(r => r.rankLvl == rank)
    const nextLevel = rankType.ranks.filter(a => a.rankLvl == currentLevel[0].rankLvl + 1)

    if (toNextLevel) {
        return [
            {
                battleCooldown: nextLevel[0].battleCooldown + Date.now(),
                lvlUp: true,
                lvlToUp: nextLevel[0].rankLvl,
                rankType: nextLevel[0].rank,
                neededXp: nextLevel[0].neededXp
            },
            {
                battleCooldown: currentLevel[0].battleCooldown + Date.now(),
                rank: currentLevel[0].rank,
                rankType: currentLevel[0].rankLvl,
                neededXp: currentLevel[0].neededXp
            }
        ]
    }

    const possibleXps = [10, 30, 100, 15]
    const possibleCoins = [45, 20, 1000, 6700, 100]

    const giveXp = Math.floor(currentLevel[0].xpBooster * possibleXps[Math.floor(Math.random() * possibleXps.length)])
    const giveCoins = Math.floor(currentLevel[0].coinBooster * possibleCoins[Math.floor(Math.random() * possibleCoins.length)])

    if (actualXp + giveXp >= nextLevel[0].neededXp) {

        const obj = {
            xpToGive: giveXp,
            coinsToGive: giveCoins,
            battleCooldown: currentLevel[0].battleCooldown + Date.now(),
            lvlUp: true,
            lvlToUp: nextLevel[0].rankLvl,
            rankType: nextLevel[0].rank
        }

        return obj;
    }

    const obj = {
        xpToGive: giveXp,
        coinsToGive: giveCoins,
        battleCooldown: currentLevel[0].battleCooldown + Date.now(),
        lvlUp: false
    }

    return obj;
}

module.exports.verification = verification