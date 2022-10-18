/**
 * 多个属性运动 -最终版
 * @param {Document} dom 
 * @param {Object} targets 对象格式 属性名称使用样式名称，属性值就是这个样式和运动的终止点
 * @param {Function} callback 表示回调函数 就是运动结束后做什么
 */
 function annimate(dom, targets,callback) {
    //  每次调用annimate函数时需要找到现在已经针对于该元素创建的定时器 然后进行清除
    // 判断如果已经存在定时器需在运动 就先关闭定时器
    dom.timer && clearInterval(dom.timer)
    // 使用dom下的timer属性保存定时器标识
    dom.timer = setInterval(() => {
        for (let key in targets) {
            // 判断是否是透明度 如果是 将值扩大1000倍
            let currentStyle;
            if (key == 'opacity') {
                currentStyle = parseFloat(getStyle(dom, key)) * 1000;
            } else {
                currentStyle = parseInt(getStyle(dom, key));
            }
            let target = (key == 'opacity') ? targets[key] * 1000 : targets[key]
            if (currentStyle == target) {
                delete targets[key];
                if (Object.keys(targets).length == 0) {
                    // 只有准备执行清除定时器才可以证明现在动画执行结束
                    // 判断callback是函数才调用 因为可能使用者不会传递该参数
                    Object.prototype.toString.call(callback) == '[object Function]' &&callback()
                    clearInterval(dom.timer)
                }
            } else {
                let speed = target - currentStyle > 0 ? Math.ceil((target - currentStyle) * 0.05) : Math.floor((target - currentStyle) * 0.05);
                dom.style[key] = (key == 'opacity') ? (currentStyle + speed) / 1000 : currentStyle + speed + 'px';
            }
        }
    }, 30);
}
/**
 * 多个属性运动V6版本-解决运动结束支持
 * @param {Document} dom 
 * @param {Object} targets 对象格式 属性名称使用样式名称，属性值就是这个样式和运动的终止点
 * @param {Function} callback 表示回调函数 就是运动结束后做什么
 */
 function annimateV6(dom, targets,callback) {
    let timer = setInterval(() => {
        for (let key in targets) {
            // 判断是否是透明度 如果是 将值扩大1000倍
            let currentStyle;
            if (key == 'opacity') {
                currentStyle = parseFloat(getStyle(dom, key)) * 1000;
            } else {
                currentStyle = parseInt(getStyle(dom, key));
            }
            let target = (key == 'opacity') ? targets[key] * 1000 : targets[key]
            if (currentStyle == target) {
                delete targets[key];
                if (Object.keys(targets).length == 0) {
                    // 只有准备执行清除定时器才可以证明现在动画执行结束
                    // 判断callback是函数才调用 因为可能使用者不会传递该参数
                    Object.prototype.toString.call(callback) == '[object Function]' &&callback()
                    clearInterval(timer)
                }
            } else {
                let speed = target - currentStyle > 0 ? Math.ceil((target - currentStyle) * 0.05) : Math.floor((target - currentStyle) * 0.05);
                dom.style[key] = (key == 'opacity') ? (currentStyle + speed) / 1000 : currentStyle + speed + 'px';
            }
        }
    }, 30);
}
/**
 * 多个属性运动V5版本-解决透明度问题
 * @param {Document} dom 
 * @param {Object} targets 对象格式 属性名称使用样式名称，属性值就是这个样式和运动的终止点
 */
function annimateV5(dom, targets) {
    let timer = setInterval(() => {
        for (let key in targets) {
            // 判断是否是透明度 如果是 将值扩大1000倍
            let currentStyle;
            if (key == 'opacity') {
                currentStyle = parseFloat(getStyle(dom, key)) * 1000;
            } else {
                currentStyle = parseInt(getStyle(dom, key));
            }
            // 计算目标值  因为取出的透明度被放大了1000倍 如果还以0-1之间的小数作为目标就错误
            let target = (key == 'opacity') ? targets[key] * 1000 : targets[key]
            if (currentStyle == target) {
                delete targets[key];
                if (Object.keys(targets).length == 0) {
                    clearInterval(timer)
                }
            } else {
                // 需要根据正向与反向运动进行判断到底是向上还是向下取整
                let speed = target - currentStyle > 0 ? Math.ceil((target - currentStyle) * 0.05) : Math.floor((target - currentStyle) * 0.05);
                dom.style[key] = (key == 'opacity') ? (currentStyle + speed) / 1000 : currentStyle + speed + 'px';
            }
        }
    }, 30);
}
/**
 * 多个属性运动V4版本-解决反向运动问题
 * @param {Document} dom 
 * @param {Object} targets 对象格式 属性名称使用样式名称，属性值就是这个样式和运动的终止点
 */
function annimateV4(dom, targets) {
    let timer = setInterval(() => {
        for (let key in targets) {
            // 获取key变量对应值的样式
            let currentStyle = parseInt(getStyle(dom, key));
            console.log('运动样式' + key + '当前的值：' + currentStyle)
            if (currentStyle == targets[key]) {
                delete targets[key];
                if (Object.keys(targets).length == 0) {
                    clearInterval(timer)
                }
            } else {
                // 需要根据正向与反向运动进行判断到底是向上还是向下取整
                let speed = targets[key] - currentStyle > 0 ? Math.ceil((targets[key] - currentStyle) * 0.05) : Math.floor((targets[key] - currentStyle) * 0.05);
                dom.style[key] = currentStyle + speed + 'px';
            }
        }
    }, 30);
}
/**
 * 多个属性运动V3版本-解决运动无法到达终点问题
 * @param {Document} dom 
 * @param {Object} targets 对象格式 属性名称使用样式名称，属性值就是这个样式和运动的终止点
 */
function annimateV3(dom, targets) {
    let timer = setInterval(() => {
        for (let key in targets) {
            // 获取key变量对应值的样式
            let currentStyle = parseInt(getStyle(dom, key));
            console.log('运动样式' + key + '当前的值：' + currentStyle)
            if (currentStyle == targets[key]) {
                delete targets[key];
                if (Object.keys(targets).length == 0) {
                    clearInterval(timer)
                }
            } else {
                // 计算速度 每次运动剩余距离的百分比 targets[key] - currentStyle 表示剩余的距离
                let speed = Math.ceil((targets[key] - currentStyle) * 0.05);
                dom.style[key] = currentStyle + speed + 'px';
            }
        }
    }, 30);
}
/**
 * 多个属性运动V2版本-解决运动不均匀问题
 * @param {Document} dom 
 * @param {Object} targets 对象格式 属性名称使用样式名称，属性值就是这个样式和运动的终止点
 */
function annimateV2(dom, targets) {
    let timer = setInterval(() => {
        for (let key in targets) {
            // 获取key变量对应值的样式
            let currentStyle = parseInt(getStyle(dom, key));
            console.log('运动样式' + key + '当前的值：' + currentStyle)
            if (currentStyle == targets[key]) {
                delete targets[key];
                if (Object.keys(targets).length == 0) {
                    clearInterval(timer)
                }
            } else {
                // 计算速度 每次运动剩余距离的百分比 targets[key] - currentStyle 表示剩余的距离
                let speed = (targets[key] - currentStyle) * 0.05;
                dom.style[key] = currentStyle + speed + 'px';
            }
        }
    }, 30);
}
/**
 * 多个属性运动V1版本
 * @param {Document} dom 
 * @param {Object} targets 对象格式 属性名称使用样式名称，属性值就是这个样式和运动的终止点
 */
function annimateV1(dom, targets) {
    // 设置一个定时器每次对所有需要运动的样式进行修改
    let timer = setInterval(() => {
        console.log('run')
        // 针对targets中每一个元素进行修改样式 key表示样式名称 targets[key] 表示运动终止点
        for (let key in targets) {
            // 获取key变量对应值的样式
            let currentStyle = parseInt(getStyle(dom, key));
            if (currentStyle == targets[key]) {
                // 一旦条件满足 不一定要清除定时器，有可能有其他的样式还没有运动完毕
                // 一旦当前的样式运动完毕 就将从对象中移除。定时器下一次执行时就不会继续处理已经结束运动的样式
                delete targets[key];
                // 如果targets对象下的属性个数为0 就证明所有的样式全部运动完毕
                if (Object.keys(targets).length == 0) {
                    clearInterval(timer)
                }
            } else {
                dom.style[key] = currentStyle + 5 + 'px';
            }
        }
    }, 30);
}


/**
 * 简单运动函数
 * @param {Document} dom 运动元素的dom对象
 * @param {String} attrName 运动的样式名称
 * @param {Number} attrValue 运动的终止点
 */
function simpleSport(dom, attrName, attrValue) {
    let timer = setInterval(() => {
        // 获取当前的left值
        let currentStyle = parseInt(getStyle(dom, attrName));
        if (currentStyle == attrValue) {
            // 已经到达终点
            clearInterval(timer);
        } else {
            dom.style[attrName] = currentStyle + 5 + 'px';
        }
    }, 30);
}