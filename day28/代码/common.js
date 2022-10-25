/**
 * 发送Ajax请求
 * @param {Object} options 
 */
function ajax(options) {
    // 1、默认配置信息
    const config = {
        type: 'get', //请求方式
        url: '', //请求地址
        data: '', //请求参数 为了使用者方便 支持传递字符串或者对象格式数据
        success: function () {}, //成功拿到数据的回调
        dataType: 'json', //表示服务端返回数据的格式
        contentType: 'application/x-www-form-urlencoded',
        headers: {
            // 表示请求过程中携带的其他的头信息，属性名称使用头的名称，值就是请头对应的值
        }
    };
    // 2、合并配置信息
    Object.keys(config).forEach(key => options[key] != undefined && (config[key] = options[key]));
    // 3、参数验证
    // 3.1、验证请求类型
    let allowType = ['get', 'post', 'put', 'delete'];
    // 将请求方式强制装好为字符串在设置为小写
    config.type = String(config.type).toLowerCase();
    if (!allowType.includes(config.type)) {
        throw new Error('请求方式错误');
    }
    // 3.2、验证url地址  config.url.constructor != String 验证数据类型
    // startsWith判断是否以指定的字符串开头
    if (config.url.constructor != String || !(config.url.startsWith('http://') || config.url.startsWith('https://'))) {
        throw new Error('请求URL地址错误');
    }
    // 3.3、验证请求参数
    // 保存请求参数的数据类型
    const dataType = Object.prototype.toString.call(config.data);
    if (dataType != '[object String]' && dataType != '[object Object]') {
        throw new Error('请求携带参数格式错误')
    }
    // 3.4、验证回调函数
    if (Object.prototype.toString.call(config.success) != '[object Function]') {
        throw new Error('回调必须传递函数');
    }
    // 3.5、验证contentType
    if (config.contentType != 'application/x-www-form-urlencoded' && config.contentType != 'application/json') {
        throw new Error('contentType头错误');
    }
    // 3.6、验证headers
    if (config.headers.constructor != Object) {
        throw new Error('headers数据类型错误');
    }

    // 4、获取对象
    let xhr = new XMLHttpRequest;
    // 5、打开连接
    let url = config.url;; //保存请求 地址
    if ((config.type == 'get' || config.type == 'delete')) {
        if (dataType == '[object String]') {
            // 说明data是字符串类型
            url && (url += '?' + config.data);
        } else {
            // 说明data是对象
            let param = '?';
            Object.keys(config.data).forEach(item => param += `${item}=${config.data[item]}&`);
            url += param.slice(0, -1);
        }
    }
    xhr.open(config.type, url);
    // 6、设置请求头信息
    xhr.setRequestHeader('Content-Type', config.contentType);
    for (let key in config.headers) {
        // key就是表示请求头的名称
        key != 'Content-Type' && xhr.setRequestHeader(key, config.headers[key]);
    }
    // 7、发送请求
    let requestBody = ''; //保存请求携带的参数
    if (config.type == 'post' || config.type == 'put') {
        if (dataType == '[object String]') {
            requestBody = config.data;
        } else {
            // 对象格式
            if (config.contentType == 'application/json') {
                requestBody = JSON.stringify(config.data);
            } else {
                // 将数据转换为表单格式
                Object.keys(config.data).forEach(item => requestBody += `${item}=${config.data[item]}&`);
                requestBody = requestBody.slice(0, -1);
            }
        }
    }
    xhr.send(requestBody);
    // 监听状态的改变
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // 获取服务端返回的结果
            let response = config.dataType == 'json' ? JSON.parse(xhr.responseText) : xhr.responseText;
            // 回调
            config.success(response);
        }
    }

}

/**
 * 设置cookie
 * @param {String} key cookie的名称 
 * @param {String} value cookie的值
 * @param {Number} expires 表示有效时间0 表示关闭浏览器失效 其他数字表示以当前计算多少秒之后过期 
 */
function setCookie(key, value, expires = 0) {
    if (Object.prototype.toString.call(key) != '[object String]' && Object.prototype.toString.call(value) != '[object String]') {
        throw new Error('参数类型错误')
    }
    if (expires == 0) {
        document.cookie = `${key}=${value};path=/`;
    } else {
        let d = new Date();
        // 根据有效时间计算日期
        d.setTime(d.getTime() + expires * 1000 - 8 * 3600 * 1000);
        document.cookie = `${key}=${value};path=/;expires=` + d;
    }
}
/**
 * 获取cookie中的值
 * @param {String} key 
 */
function getCookie(key) {
    let value;
    document.cookie.split('; ').forEach(item => {
        if (item.startsWith(key + '=')) {
            value = item.substr(key.length + 1);
        }
    })
    return value;
}
/**
 * 获取URL地址上指定参数
 * @param {String} key 要查询的参数名称
 * @returns 
 */
function getUrlParam(key) {
    var result = '';
    location.search.substr(1).split('&').forEach(function (item, index) {
        let keyValue = item.split('=');
        if (key == keyValue[0]) {
            result = keyValue[1];
        }
    })
    return result;
}
/**
 * 删除cookie
 * @param {String} key 被删除的cookie的名称 
 */
function removeCookie(key) {
    setCookie(key, '', -1);
}
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
/**
 * 事件监听的方式绑定事件
 * @param {Document} dom 事件源的dom对象
 * @param {String} eventName 事件名称 传递没有on前缀的名称
 * @param {Function} handler 事件处理程序
 */
function linstenEvent(dom, eventName, handler) {
    // 先执行try中代码 如果执行出错自动自动catch中代码
    try {
        dom.addEventListener(eventName, handler);
    } catch (error) {
        dom.attachEvent('on' + eventName, handler);
    }
}
/**
 * 深拷贝
 * @param {Array|Object} data 拷贝的数据
 * @returns 
 */
function deepCopy(data) {
    // 验证数据类型 传递的参数需要是数组或者对象
    let allowType = ['[object Array]', '[object Object]'];
    // 提取当前数据的类型
    let dataType = Object.prototype.toString.call(data);
    // 验证是否满足要求的类型
    if (!allowType.includes(dataType)) {
        throw new Error('参数类型错误');
    }
    // result变量是用于保存结果 根据现在的数据类型创建新的数组或者对象
    let result = (dataType == '[object Array]') ? [] : {};
    // 数组也是对象 也可以使用for in遍历
    for (let key in data) {
        if (allowType.includes(Object.prototype.toString.call(data[key]))) {
            result[key] = deepCopy(data[key]);
        } else {
            result[key] = data[key];
        }
    }
    return result;
}