require('dotenv').config({ path: '.env' })
const { writeOnLog } = require('./src/functions/log')
const Client = require('./src/structures/Client')

const client = new Client({
  intents: 3919,
  allowedMentions: { 
    parse: ['users', 'roles'], 
    repliedUser: true 
  }
})

client.login(process.env.TOKEN)

process.on('unhandledRejection', async (reason, promise) => {
  writeOnLog(`${reason.message}-${reason?.code} Location: ${promise}`)
})
//This bot has been created by GardZock and modified by [YOUR NAME]
