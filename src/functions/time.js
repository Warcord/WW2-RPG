const time = async (time) => {

    let timeSeconds = Math.floor(time / 1000)
    timeSeconds %= 86400;

    const hour = Math.floor(timeSeconds / 3600);
    timeSeconds %= 3600;

    const minFormated = (timeSeconds / 60);
    const min = Math.floor(minFormated)
    const seconds = (timeSeconds % 60);

    const timeObj = {
        hour: hour,
        min: min,
        seconds: seconds
    }

    return timeObj;
}

/**
 * 
 * @param {string} template Formato da Data.
 * @param {number} date Tempo em milisegundos.
 * @returns {string}
 */

function formatDate (template, date) {
    var specs = 'YYYY-MM-DD-HH-mm-ss'.split('-')
    date = new Date(date || Date.now() - new Date().getTimezoneOffset() * 6e4)
    return date.toISOString().split(/[-:.TZ]/).reduce(function (template, item, i) {
      return template.split(specs[i]).join(item)
    }, template)
}

module.exports = { time, formatDate }