/**
 * 分页构造函数
 * @param {Document|String} elem  分页容器 可以传递字符串或者dom对象 
 * @param {Object} config 分页的参数配置用于控制分页
 * @param {Function} callback 处理数据的回调
 */
function Page(elem, config,callback) {
    // 使用属性保存 处理数据显示的回调
    this.callback = callback
    // 使用属性保存容器的dom对象
    this.elem = Object.prototype.toString.call(elem) == '[object String]' ? document.querySelector(elem) : elem;
    // 设置默认参数  有些参数如果不传递就使用默认的
    this.defaultConfig = {
        // 表示数据相关
        data: {
            total: 100,
            pageSize: 10
        },
        // 分页导航栏上 显示内容
        content: {
            first: '<<',
            prev: '<',
            list: '', //就是一个占位 用于方便以content属性变量循环创建外层容器的标签
            next: '>',
            last: '>>'
        }
    }
    // 保存存放数字标签的dom对象
    this.listDom = null;
    // 保存输入框的dom对象
    this.inputDom = null;
    // 参数合并 将用户传递的config与默认的配置defaultConfig属性值进行合并
    this.mergeConfig(config);
    // 计算总页数
    this.totalPage = Math.ceil(this.defaultConfig.data.total / this.defaultConfig.data.pageSize);
    // 保存当前在第几页
    this.currenPage = 1;
    // 调用启动方法
    this.init();
    this.executeEvent();

}
// 处理点击事件
Page.prototype.executeEvent = function(){
    this.elem.addEventListener('click',event=>{
        switch (event.target.className) {
            case 'first':
                this.currenPage = 1;
                this.init();
                break;
            case 'prev':
                if(this.currenPage>1){
                    this.currenPage--;
                    this.init();
                }
                break;
            case 'next':
                if(this.currenPage < this.totalPage){
                    this.currenPage++;
                    this.init();
                }
                break;
            case 'last':
                this.currenPage = this.totalPage;
                this.init();
                break;
            default:
                if(event.target.nodeName == 'P'){
                    // 点击的是p标签
                    this.currenPage = parseInt(event.target.innerHTML) ;
                    this.init();
                }else if(event.target.nodeName == 'BUTTON'){
                    // 说明点击的是jump按钮
                    if(this.inputDom.value >=1 && this.inputDom.value<=this.totalPage){
                        this.currenPage = this.inputDom.value-0;
                        this.init();
                    } 
                }
                break;
        }
    })
}
// 启动方法
Page.prototype.init = function () {
    this.elem.innerHTML = '';
    this.createOutside();
    this.createNumberTag();
    this.createJump();
    // 调用回调函数对数据进行处理
    // 验证传递的callback是不是函数 如果不是 就不调用 可以避免错误
    Object.prototype.toString.call(this.callback) =='[object Function]' && this.callback(this.currenPage);
}
// 创建跳转的标签
Page.prototype.createJump = function(){
    // 创建输入框
    this.inputDom = document.createElement('input');
    this.inputDom.style.width = '50px'
    this.elem.appendChild(this.inputDom);
    // 创建点击按钮
    let buttonDom = document.createElement('button');
    buttonDom.innerHTML = 'Jump';
    this.elem.appendChild(buttonDom)
}

// 根据范围创建指定数字的标签
Page.prototype.creatNumberByRange = function (start, end) {
    for (let i = start; i <= end; i++) {
        let pDom = document.createElement('p');
        pDom.innerHTML = i;
        // 默认为数字1添加特殊样式
        i == this.currenPage && pDom.classList.add('active');
        this.listDom.appendChild(pDom)
    }
}
// 创建数字导航功能
Page.prototype.createNumberTag = function () {
    if (this.totalPage <= 5) {
        this.creatNumberByRange(1, this.totalPage);
        return;
    }
    // 代码执行到这一行绝对证明总页数大于5
    if (this.currenPage <= 3) {
        this.creatNumberByRange(1, 5);
    } else if (this.currenPage >= this.totalPage - 2) {
        this.creatNumberByRange(this.totalPage - 4, this.totalPage);
    } else {
        this.creatNumberByRange(this.currenPage - 2, this.currenPage + 2);
    }
}

// 创建外层容器的方法
Page.prototype.createOutside = function () {
    for (let key in this.defaultConfig.content) {
        let divDom = document.createElement('div');
        // 设置样式
        divDom.classList.add(key);
        divDom.innerHTML = this.defaultConfig.content[key];
        key == 'list' && (this.listDom = divDom)
        this.elem.appendChild(divDom);
    }
}
// 参数合并
Page.prototype.mergeConfig = function (config) {
    // 根据用户所传递的参数 如果传递了覆盖默认参数 后期就可以直接使用默认参数
    // 以默认的进行遍历，好处 可以让用户省略部分值 并且其他不需要参数 无需理会
    for (let key in this.defaultConfig) {
        // 表示目前key变量值的这个属性 有传递
        if (config[key] != undefined) {
            //在将默认配置下的配一个属性拿出进行处理
            for (let attrName in this.defaultConfig[key]) {
                // 如果attrName变量对应的值 用户有传递 将这个值设置到defaultConfig中
                (config[key][attrName] != undefined) && (this.defaultConfig[key][attrName] = config[key][attrName])
            }
        }
    }
}