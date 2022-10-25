---
typora-root-url: img
---

# Ajax封装

## Ajax参数处理

```javascript
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
    console.log(config);
}
```

## 参数验证

1、验证请求方式

```javascript
// 3.1、验证请求类型
    let allowType = ['get','post','put','delete'];
    // 将请求方式强制装好为字符串在设置为小写
    config.type =String(config.type).toLowerCase();
    if(!allowType.includes(config.type)){
        throw new Error('请求方式错误');
    }
```

2、验证请求地址

```javascript
    // 3.2、验证url地址  config.url.constructor != String 验证数据类型
    // startsWith判断是否以指定的字符串开头
    if (config.url.constructor != String || !(config.url.startsWith('http://') || config.url.startsWith('https://'))) {
        throw new Error('请求URL地址错误');
    }
```

3、验证请求参数

```javascript
// 3.3、验证请求参数
// 保存请求参数的数据类型
const dataType = Object.prototype.toString.call(config.data);
if(dataType != '[object String]' && dataType != '[object Object]'){
throw new Error('请求携带参数格式错误')
}
```

4、数据验证

```javascript
// 3.5、验证contentType
    if(config.contentType != 'application/x-www-form-urlencoded' && config.contentType !='application/json'){
        throw new Error('contentType头错误');
    }

if(config.headers.constructor != Object){
        throw new Error('headers数据类型错误');
    }
```

## 使用ajax

1、组装地址打开

```javascript
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
            url += param.slice(0,-1);
        }
    }
    xhr.open(config.type,url);
```

2、设置请求头

```javascript
 // 6、设置请求头信息
    xhr.setRequestHeader('Content-Type', config.contentType);
    for (let key in config.headers) {
        // key就是表示请求头的名称
        key != 'Content-Type' && xhr.setRequestHeader(key, config.headers[key]);
    }
```

3、发送请求

```javascript
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
```

4、监听结果

```javascript
// 监听状态的改变
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        // 获取服务端返回的结果
        let response = config.dataType == 'json' ? JSON.parse(xhr.responseText) : xhr.responseText;
        // 回调
        config.success(response);
    }
}
```

# ajax案例

## 注册功能

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <input type="text" placeholder="输入用户名" class="username">
    <input type="text" placeholder="输入密码" class="password">
    <button>注册</button>
    <script src="../common.js"></script>
    <script>
        document.querySelector('button').onclick = function () {
            // 获取输入的账号密码
            let username = document.querySelector('.username').value;
            let password = document.querySelector('.password').value;
            ajax({
                url:'http://phpclub.org.cn/edu/server/regist.php',
                type:'post',
                data:{mobile:username,password},
                success: function(backData){
                    if(backData.code != 100){
                        console.log(backData.msg);
                        return;
                    }
                    // 跳转登录
                    window.location.href = 'login.html';
                }
            });
        }
    </script>
</body>

</html>
```

## 实现登录

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <input type="text" placeholder="输入用户名" class="username">
    <input type="text" placeholder="输入密码" class="password">
    <button>登录</button>
    <script src="../common.js"></script>
    <script>
        document.querySelector('button').onclick = function () {
            // 获取输入的账号密码
            let username = document.querySelector('.username').value;
            let password = document.querySelector('.password').value;
            // 发送请求验证信息是否正确
            ajax({
                type:'post',
                url:'http://phpclub.org.cn/edu/server/login.php',
                data:{ mobile:username,password},
                success:function(response){
                    if(response.code !=100){
                        alert(response.msg);
                    }else{
                        window.location.href = 'index.html';
                    }
                }
            })
        }
    </script>
</body>

</html>
```

## 显示首页

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div class="nav">
        <h1><span>XXX</span>欢迎！</h1>
    </div>
    <ul class="app"></ul>
    <script src="../common.js"></script>
    <script>
        // 获取到热点新闻
        ajax({
            url:'http://phpclub.org.cn/edu/server/news.php',
            success:function(response){
                let html = '';
                response.data.forEach(item=>html+=`<li><a href="">${item.title}</a></li>`)
                document.querySelector('.app').innerHTML = html;
            }
        })
    </script>
</body>

</html>
```

# cookie

## cookie介绍

cookie属于浏览器的本地客户端存储技术，本质实现依托于http协议。可以将cookie理解为本地客户端的存储介

质，可以将数据保存到cookie中后期在拿出来使用

## cookie使用

### 设置cookie

1、语法

```javascript
document.cookie = '名称=值;path=/;expires=有效时间'
```

2、查看现有的cookie

![1666680559947](/1666680559947.png)

3、设置不带有效时间的cookie

```javascript
//document.cookie = '名称=值;path=/;expires=有效时间'
        // 设置cookie  cookie为键值对格式 名称任意设置，值只能是字符串
        // path 表示有效路径 建议不管 直接设置/
        // expires表示有效时间 默认是关闭浏览器失效
        // 1、设置不带有效时间的cookie
        document.cookie = 'nickname=cookies;path=/'
```

4、具备有效时间的cookie

```javascript
// 2设置有效时间
// 有效时间 需求为一个格林威治的时间  一旦达到这个时间浏览器会自动将cookie删除掉
let d = new Date();
// d.getTime() 获取到当前时间戳毫秒 +3600*100 是因为需要控制cookie1小时后过期，由于当前是北京时间 所以需要减掉8小时的时间戳
d.setTime(d.getTime() + 3600 * 1000 - 8 * 3600 * 1000)
document.cookie = 'age=20;path=/;expires=' + d;
```

### 读取cookie

```javascript
console.log(document.cookie);
```

结果

![1666682619999](/1666682619999.png)

### 删除cookie

```javascript
// 删除cookie就是将cookie的有效时间设置一个已经过期的时间
        let d = new Date();
        d.setTime(d.getTime() - 8 * 3600 * 1000 - 1000);
        document.cookie = 'age=20;path=/;expires=' + d;
```

## cookie的封装

1、封装设置cookie的函数

```javascript
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
```

2、设置获取cookie的函数

```javascript
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
```

3、封装删除cookie函数

```javascript
/**
 * 删除cookie
 * @param {String} key 被删除的cookie的名称 
 */
function removeCookie(key) {
    setCookie(key, '', -1);
}
```

## 使用cookie处理登录问题

1、登录记住用户信息

![1666684788775](/1666684788775.png)

2、首页判断登录

```javascript
// 判断当前用户是否已经登录
        let mobile = getCookie('mobile');
        if(mobile){
            // 证明用户已经登录
            document.querySelector('.nav').innerHTML = `<strong>${mobile}欢迎！</strong><a href="">退出</a>`
        }else{
            document.querySelector('.nav').innerHTML = `<a href="login.html">登录</a>`
        }
```

# localstorage

## localstorage介绍

localstorage与cookie类似 都是属于本地存储技术。对于cookie虽然也是本地存储技术。但是存在部分缺陷，问题

一cookie存储 的容量比较小，大约4K左右，问题二cookie有条数的限制 大约150条左右。为了解决设计了

localstorage技术。也是属于键值对的格式 并且也只能存储字符串

## localstorage使用

1、设置

```javascript
 // 存在就修改 不存在就添加 设置时没有时间限制
// 第一个参数是名称 第二个参数是值
localStorage.setItem('name','abc');
```

2、获取

```javascript
// 获取localstorage中数据
console.log(localStorage.getItem('name'))
// 获取一共有多少条
console.log(localStorage.length);
```

3、删除

```javascript
// 删除数据
localStorage.removeItem('name');
// 清空
localStorage.clear();
```

## cookie与localstorage区别

相同点：

​	1、都是基于域名的生效

​	2、都属于键值对格式

​	3、值都只能使用字符串

不同点：

​	1、cookie有容量限制 大约4k localstorage也有容量限制大约是5M

​	2、cookie有条数的限制 大约150条 localstorage没有限制

​	3、cookie 有时效性 localstorage没有（只要不手动或者使用代码删除localstorage中存储的数据长期保存）

​	4、cookie可以以域名单独设置有效路径，localstorage没有

# Ajax案例显示新闻详情

1、先设置连接地址

![1666687167157](/1666687167157.png)

2、实现新闻详情

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1 class="title">标题</h1>
    <div class="content">内容</div>

    <script src="../common.js"></script>
    <script>
        // 1、获取URL中id参数
        let newsId = getUrlParam('id')
        // 2、显示新闻详情
        ajax({
            url:'http://phpclub.org.cn/edu/server/getContent.php',
            data:{id:newsId},
            success: function(backData){
                document.querySelector('.title').innerHTML=backData.data.title;
                document.querySelector('.content').innerHTML=backData.data.content;
            }
        });
    </script>
</body>
</html>
```



