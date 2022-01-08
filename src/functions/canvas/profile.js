const { createCanvas, loadImage, registerFont } = require('canvas');
const { getUser, getClan, getUserRank, getRankDB } = require('../../game/getters');
const { stopChar } = require('./string')
const { join } = require('path')
const { formatDate } = require('../time')
registerFont(join(__dirname, "..", "..", "assets", "fonts", "Roboto-Bold-Condensed.ttf"), { family: "Roboto Condensed" });

/**
 * @param {object} client Bot
 * @param {object} userID ID do usuário
 * @returns {buffer}
 */

const create = async (client, userID) => {

    const userData = await getUser(`${userID}`)
    const userSecondData = client.users.cache.get(`${userID}`)
    const clanData = await getClan(`${userID}`)
    const getRank = await getUserRank(userID)
    const getRankInDB = await getRankDB(userID)
    const date = formatDate('DD/MM/YYYY', userData.createdAt.getTime())

    if (!userData || !getRank) {
        throw new Error("O ID do usuário não foi encontrado.")
    }

    const canvas = createCanvas(1920, 1080);
    const context = canvas.getContext('2d');

    const background = await loadImage('./src/assets/images/templates/profile.png');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.font = "58px 'Roboto Condensed'";
    context.fillStyle = '#000000';
    context.fillText(`${stopChar(`${userData.userName.toUpperCase()}`, 13)}`, 68, 677);

    context.font = "58px 'Roboto Condensed'";
    context.fillStyle = '#000000';
    context.fillText(`${stopChar(`${userData.coins}`, 11)}`, 607, 677);

    context.font = "58px 'Roboto Condensed'";
    context.fillStyle = '#000000';
    context.fillText(`${getRank[0].actualRank}`, 1192, 677);

    context.font = "30px 'Roboto Condensed'";
    context.fillStyle = '#000000';
    context.fillText(`${userID}`, 651, 541);

    context.font = "58px 'Roboto Condensed'";
    context.fillStyle = '#000000';
    context.fillText(`${date}`, 612, 832);

    context.font = "30px 'Roboto Condensed'";
    context.fillStyle = '#000000';
    context.fillText(`#${getRankInDB.coins}`, 212, 837);

    context.font = "30px 'Roboto Condensed'";
    context.fillStyle = '#000000';
    context.fillText(`#${getRankInDB.xp}`, 255, 893);

    context.font = "30px 'Roboto Condensed'";
    context.fillStyle = '#000000';
    context.fillText(`#${getRankInDB.victories}`, 364, 953);


    if (clanData) {
        const clanIcon = await loadImage(`${clanData.iconURL == null ? './src/assets/images/templates/WW2RPG_CLAN-SHILD.png' : clanData.iconURL}`)
        context.drawImage(clanIcon, 612, 136, 250, 250)

        context.font = "30px 'Roboto Condensed'";
        context.fillStyle = '#000000';
        context.fillText(`${clanData.name.toUpperCase()}`, 717, 449);

    }

    const avatar = await loadImage(`${await userSecondData.displayAvatarURL({ format: 'png' })}`);
    context.drawImage(avatar, 81, 79, 468, 468);

    return canvas.toBuffer()
}

module.exports = { create }