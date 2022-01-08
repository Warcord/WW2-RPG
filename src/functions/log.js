const { appendFileSync, readFileSync, writeFileSync } = require('fs')

const formatDate = (date) => {
  const a = [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map(function (n) { return n.toString().padStart(2, '0'); })
    .join(':');

  const b = [date.getDay(), date.getMonth() + 1, date.getFullYear()]
    .map(function (n) { return n.toString().padStart(2, '0'); })
    .join('-');

  return `${b}` + ' ' + `${a}`;
};

const writeOnLog = async (result) => {

  if (result == 'iniciando...') {
    writeFileSync('./src/logs/errorLog.log', '');
    return console.log('Started Log!')
  }

  const hour = await formatDate(new Date())

  appendFileSync('./src/logs/errorLog.log', `\n${hour} ${result}`)

  return console.log('Updated!');
}

const logContent = async () => {

  const data = readFileSync('./src/logs/errorLog.log')

  if (data.length <= 0) return 'Log de erros vazia.'

  return data;
}

const discloud = {

  log: async () => {
    const fetch = require('node-fetch')

    const data = await fetch(`https://discloud.app/status/bot/795141733754077204/logs`, {
      headers: {
        "api-token": `${process.env.DISCLOUD_TOKEN}`
      }
    })

    return data.json()
  },

  bot: async () => {
    const fetch = require('node-fetch')

    const data = await fetch(`https://discloud.app/status/bot/795141733754077204`, {
      headers: {
        "api-token": `${process.env.DISCLOUD_TOKEN}`
      }
    })

    return data.json()
  },

  authorBot: async () => {
    
    const fetch = require('node-fetch')

    const data = await fetch(`https://discloud.app/status/user`, {
      headers: {
        "api-token": `${process.env.DISCLOUD_TOKEN}`
      }
    })

    return data.json()
  }
}

module.exports = { formatDate, writeOnLog, logContent, discloud }