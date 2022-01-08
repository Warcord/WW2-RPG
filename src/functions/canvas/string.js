/**
 * 
 * @param {string} string String que deseja ter o stopChar.
 * @param {number} max Máximo de caracteres até o stopChar.
 * @returns {string}
 */

const stopChar = (string, max) => {

    if (typeof string != 'string') {
        throw new Error('O Parâmetro "string" deve ser uma string.')
    }

    if (typeof max != 'number') {
        throw new Error('O Parâmetro "max" deve ser um número.')
    }

    if (string.length < max) return string;

    const toReplace = string.slice(0, max) + '...'

    return toReplace
}

module.exports = { stopChar }