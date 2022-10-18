/**
 * 生成指定区间的随机数
 * @param {Number} min 开始数字
 * @param {Number} max 结束数字
 * @param {Boolean} hasEnd 是否包含结束true包含
 */
function makeRandomNumber(min, max, hasEnd = true) {
    if (hasEnd) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    return Math.floor(Math.random() * (max - min) + min);
}