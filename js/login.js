document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    // 处理密码显示/隐藏
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    // 获取URL中的return_url参数
    const getReturnUrl = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('return_url') || '/';
    };

    // 表单提交处理
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        if (!username || !password) {
            showMessage('请填写用户名和密码', 'error');
            return;
        }

        try {
            const response = await fetch('http://35.241.68.14:8001/auth-global/api/admin/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    remember
                })
            });

            const data = await response.json();

            if (data.success) {
                showMessage('登录成功', 'success');
                // 如果登录成功，将token添加到return_url
                const returnUrl = getReturnUrl();
                window.location.href = `${returnUrl}${returnUrl.includes('?') ? '&' : '?'}token=${data.data.token}`;
            } else {
                showMessage(data.message || '登录失败，请重试', 'error');
            }
        } catch (error) {
            showMessage('网络错误，请稍后重试', 'error');
            console.error('Login error:', error);
        }
    });

    // 消息提示函数
    function showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;

        // 样式设置
        Object.assign(messageDiv.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            borderRadius: '4px',
            backgroundColor: type === 'error' ? '#ff4d4f' : '#52c41a',
            color: 'white',
            zIndex: 1000,
            transition: 'all 0.3s ease'
        });

        document.body.appendChild(messageDiv);

        // 3秒后移除消息
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 3000);
    }

    // 第三方登录处理
    const thirdPartyLogin = (type) => {
        // 这里添加第三方登录的逻辑
        console.log(`Initiating ${type} login...`);
    };

    // 为第三方登录按钮添加点击事件
    document.querySelectorAll('.login-icons a').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            const type = icon.getAttribute('title').split('登录')[0];
            thirdPartyLogin(type);
        });
    });
});
