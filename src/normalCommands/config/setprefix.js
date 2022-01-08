const configSchema = require('../../database/models/configSchema')
const NormalCommand = require('../../structures/NormalCommands')

module.exports = class extends NormalCommand {
    constructor(client) {
        super(client, {

            name: 'setprefix',
            description: 'Owner NormalCommand.',
            aliases: ['addprefix'],
            category: 'Staff'
        })
    }

    run = async (client, message, args) => {

        if (!message.member.permissions.has('ADMNISTRATOR')) return;
        try {

            const serverID = message.guild.id
            const prefix = args[0]

            if (!args[0]) return message.channel.send({ content: 'Adicione um prefixo para concluir esta ação.', reply: { messageReference: message.id } }).then((msg) => setTimeout(function () { msg.delete() }, 30000));


            await configSchema.findOneAndUpdate({
                serverID: serverID
            }, {
                serverID: serverID,
                prefix
            }, {
                upsert: true
            })

            message.reply({ content: `O prefixo do bot foi definido para **${prefix}**` }).then((msg) => setTimeout(function () { msg.delete() }, 30000))
        } catch (err) {
            console.log(err)
        }
    }
}