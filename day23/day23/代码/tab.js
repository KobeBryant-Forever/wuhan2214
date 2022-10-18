function Tab(headers, contents) {
    // 使用对象属性将 div的dom对象保存
    this.headers = headers;
    this.contents = contents;
    // 构造函数调用init 避免每次实例化后手动调用
    this.init();
}
// Tab的原型上添加初始化选项卡功能方法
Tab.prototype.init = function () {
    // 在此时this表示的当前Tab的对象 将this使用新的变量保存
    let that = this;
    this.headers.forEach((dom, index) => {
        // 为每一个选项卡的dom对象绑定点击事件
        dom.onclick = function () {
            // 点击事件 点击事件中this表示的是事件源的dom对象
            // 此时无法通过this 获取到Tab对象下的信息
            // 先移除所有的active样式
            that.headers.forEach(item => item.className = '');
            // 当前的加上active样式
            this.className = 'active';
            // 将所有的内容隐藏 
            that.contents.forEach(item => item.style.display = 'none');
            // 当前点击对应的设置为显示
            that.contents[index].style.display = 'block'
        }
    })
}