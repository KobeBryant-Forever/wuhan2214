window.addEventListener('load', () => {
    // 发送短信验证码
    $$('.send').addEventListener('click', () => {
        // 获取手机号
        let mobile = $$('.mobile').value;
        if (!/^1[2-9]\d{9}$/.test(mobile)) {
            layer.msg('手机号格式错误', {
                icon: 2
            })
            return;
        }
        // 调用接口发送短信验证码
        ajax({
            url: apiBaseUrl + 'sms/send',
            type: 'post',
            data: {
                mobile,
                scene: 1
            },
            success: function (response) {
                console.log(response);
            }
        })
    })
    // 实现登录
    $$('.login_btn').addEventListener('click', () => {
        let mobile = $$('.mobile').value;
        let code = $$('.code').value;
        ajax({
            url: apiBaseUrl + 'authorize/mobileLogin',
            type: 'post',
            data: {
                mobile,
                code,
                appName: 'web'
            },
            success: function (response) {
                if (response.code != 200) {
                    layer.msg(response.msg, {
                        icon: 2
                    });
                    return;
                }
                // 根据是否勾选保存密码功能 保存cookie的时间
                let expires = 0;
                $$('.chb').checked && (expires = 24 * 3600 * 7);
                // 将信息保存到cookie中
                setCookie('appSessionId',response.data.appSessionId);
                // 获取用户的详细信息
                ajax({
                    url:apiBaseUrl+'user/index',
                    headers:{Authorization:'bearer '+response.data.appSessionId},
                    success:function(response){
                        setCookie('userInfo',JSON.stringify(response.data),expires) ;
                        location.href = 'index.html';
                    }
                })

            }
        })
    })
})