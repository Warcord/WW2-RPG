const NormalCommand = require('../../structures/NormalCommands')

const profileSchema = require('../../database/models/profileSchema');
const configSchema = require('../../database/models/configSchema');
const time = require('../../functions/time')

module.exports = class extends NormalCommand {
    constructor(client) {
        super(client, {

            name: 'daily',
            description: 'Pega o kit diário.',
            aliases: ['diario'],
            category: 'Economia',
            howToUse: `daily`
        })
    }

    run = async (client, message, args) => {


        const profileData = await profileSchema.findOne({ userID: message.member.id })

        if(!profileData) return message.reply(`Você não tem um personagem criado, use **${await NormalCommand.prefix(message.guild)}create** para criar um.`);

        var data = profileData.dailyCooldown
        if (data == null) {
            data = Date.now()
        }

        if (data <= Date.now()) {

            const randomNumber = Math.floor(Math.random() * 500) + 1;
            await profileSchema.findOneAndUpdate({
                userID: message.member.id,
             }, {
                 $inc: {
                     coins: randomNumber
                },
                dailyCooldown: Date.now() + 1000 * 60 * 60 * 20
            })

            return message.reply({ content: `Você conseguiu ${randomNumber} coins.` });
        } else {

            const getTime = await time.time(profileData.dailyCooldown - Date.now())

            return message.reply({ content: `Você está em cooldown. Tempo de espera: **${getTime.hour}h, ${getTime.min}m, ${getTime.seconds}s**`});
        }
    }
};