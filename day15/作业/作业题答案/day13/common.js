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
 * 批量设置标签的杨思
 * @param {Document} dom 被设置标签的dom对象 
 * @param {Object} attrs 对象格式 表示设置的样式名称与值 属性名称为样式名 
 */
function setStyle(dom, attrs) {
    for (var key in attrs) {
        dom.style[key] = attrs[key];
    }
}
/**
 * 获取样式
 * @param {Document} dom 获取样式的标签dom对象
 * @param {String} attrName 样式名称 
 */
function getStyle(dom,attrName){
    if(window.getComputedStyle){
        // 属性存在 说明是w3c标准的浏览器
        return window.getComputedStyle(dom)[attrName];
    }
    return dom.currentStyle[attrName];
}