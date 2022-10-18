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

/**
 * 获取元素的dom对象
 * @param {String} selector 选择器
 * @param {Boolean} isMore 是否匹配多个元素 true 表示多个  使用了默认参数  默认参数就是不传递直接使用所设置的值
 */
function $$(selector, isMore = false) {
    if (isMore) {
        return document.querySelectorAll(selector);
    }
    return document.querySelector(selector)
}

/**
 * 获取元素的样式
 * @param {Document} dom 获取元素的dom对象
 * @param {String} attrName 样式名称
 * @returns 
 */
function getStyle(dom, attrName) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(dom)[attrName];
    }
    return dom.currentStyle[attrName]
}