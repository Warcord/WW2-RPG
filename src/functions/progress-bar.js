const main = async (value, maxValue, info) => {
    const percentage = value / maxValue;
    const progress = Math.round((10 * percentage));
    const emptyProgress = 10 - progress;

    const progressText = '▇'.repeat(progress);
    const emptyProgressText = '—'.repeat(emptyProgress);
    const percentageText = Math.round(percentage * 100) + '%';

    const bar = '[' + progressText + emptyProgressText + ']' + ' ' + percentageText
    if (info) return bar + ` ${value}/${maxValue}`;
    return bar;
}

module.exports.main = main