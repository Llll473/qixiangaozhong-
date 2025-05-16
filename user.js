document.addEventListener('DOMContentLoaded', function() {
    // 基础DOM元素
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // 获取URL参数
    function getUrlParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
    
    // 登录表单处理
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            if (!username || !password) {
                alert('请填写完整的登录信息');
                return;
            }
            
            // 从localStorage获取用户数据
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                // 设置当前登录用户
                localStorage.setItem('currentUser', JSON.stringify({
                    id: user.id,
                    username: user.username,
                    realName: user.realName,
                    grade: user.grade,
                    className: user.className,
                    joinDate: user.joinDate
                }));
                
                // 获取重定向参数
                const redirect = getUrlParam('redirect');
                if (redirect === 'forum') {
                    window.location.href = 'forum.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                alert('用户名或密码错误');
            }
        });
    }
    
    // 注册表单处理
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();
            const realName = document.getElementById('realName').value.trim();
            const grade = document.getElementById('grade').value;
            const className = document.getElementById('className').value;
            
            // 表单验证
            if (!username || !password || !confirmPassword || !realName || !grade || !className) {
                alert('请填写完整的注册信息');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('两次输入的密码不一致');
                return;
            }
            
            // 从localStorage获取现有用户
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // 检查用户名是否已存在
            if (users.some(u => u.username === username)) {
                alert('该用户名已被注册');
                return;
            }
            
            // 创建新用户
            const newUser = {
                id: Date.now(),
                username: username,
                password: password,
                realName: realName,
                grade: grade,
                className: className,
                joinDate: new Date().toISOString().split('T')[0]
            };
            
            // 保存用户数据
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            alert('注册成功，请登录');
            window.location.href = 'login.html?redirect=forum';
        });
    }
    
    // 退出登录处理
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
    
    // 检查登录状态
    function checkLoginStatus() {
        const currentUser = localStorage.getItem('currentUser');
        
        // 如果是需要登录的页面但用户未登录，重定向到登录页
        if (!currentUser && isRestrictedPage()) {
            window.location.href = 'login.html?redirect=forum';
            return;
        }
        
        // 更新用户菜单
        updateUserMenu(currentUser);
    }
    
    // 判断是否为需要登录的受限页面
    function isRestrictedPage() {
        const restrictedPages = ['forum.html', 'profile.html'];
        const currentPage = window.location.pathname.split('/').pop();
        return restrictedPages.includes(currentPage);
    }
    
    // 更新用户菜单
    function updateUserMenu(currentUser) {
        const userMenu = document.querySelector('.user-menu');
        const userDisplayName = document.getElementById('userDisplayName');
        
        if (userMenu && userDisplayName) {
            if (currentUser) {
                const user = JSON.parse(currentUser);
                userDisplayName.textContent = user.realName || user.username;
                userMenu.style.display = 'flex';
            } else {
                userMenu.style.display = 'none';
            }
        } else if (userMenu) {
            // 如果页面上没有用户显示名称元素，则隐藏用户菜单
            userMenu.style.display = 'none';
        }
    }
    
    // 检查登录状态
    checkLoginStatus();
}); 