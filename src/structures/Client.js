const { Client } = require('discord.js')

const { readdirSync } = require('fs')
const { join } = require('path')

const { connect } = require('mongoose')

module.exports = class extends Client {
    constructor(options) {
        super(options)

        this.normalCommands = []
        this.loadEvents()
        this.loadNormalCommands()
    }

    loadEvents(path = 'src/events') {
        const categories = readdirSync(path)

        for (const category of categories) {
            const events = readdirSync(`${path}/${category}`)

            for (const event of events) {
                const eventClass = require(join(process.cwd(), `${path}/${category}/${event}`))
                const evt = new (eventClass)(this)

                this.on(evt.name, evt.run)
            }
        }
    }

    async connectToDatabase() {
        await connect(process.env.MONGO_URL)

        console.log('Database conectada com sucesso!')
    }

    async loadNormalCommands(path = 'src/normalCommands', commandName, isCategory) {
        const categories = readdirSync(path)

        for (const category of categories) {
            const commands = readdirSync(`${path}/${category}`)

            for (const NormalCommand of commands) {
                const commandClass = require(join(process.cwd(), `${path}/${category}/${NormalCommand}`))
                const cmd = new (commandClass)(this)

                if (commandName == 'all') {

                    return this.normalCommands;
                } else if (isCategory) {

                    const comando = this.normalCommands.filter(a => a.category == commandName)
                    if (!comando) return;

                    return await comando;
                } else if (commandName) {

                    const comando = this.normalCommands.filter(a => a.name == commandName)
                    if (!comando) return;

                    const obj = {
                        name: comando[0].name,
                        description: comando[0].description,
                        aliases: comando[0].aliases,
                        category: comando[0].category,
                        howToUse: comando[0].howToUse
                    };

                    return obj;
                }

                this.normalCommands.push(cmd) || this.normalCommands.aliases.push(cmd.aliases)
            }
        }
    }
}