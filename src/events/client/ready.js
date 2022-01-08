const Event = require('../../structures/Event')
const { writeOnLog, discloud } = require('../../functions/log')

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: 'ready'
        })
    }

    run = async () => {
        console.log(`Bot ${this.client.user.username} logado com sucesso em ${this.client.guilds.cache.size} servidores.`)
        await this.client.connectToDatabase()

        setTimeout(() => {
            return writeOnLog('iniciando...');
        }, 15000)
    }
}