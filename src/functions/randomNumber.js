function code(quantidadeDeCaracteres) {

    if (isNaN(quantidadeDeCaracteres)) {
        throw new Error('A quantidade de caracteres do code tem de ser um NÚMERO.')
    }

    let result = '';
    let numbers = '0123456789';
    for (let i = 0; i < quantidadeDeCaracteres; i++) {
        result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return result;
}

module.exports = { code }