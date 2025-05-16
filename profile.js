document.addEventListener('DOMContentLoaded', function() {
    // 基础DOM元素
    const profileName = document.getElementById('profileName');
    const profileClass = document.getElementById('profileClass');
    const profileJoinDate = document.getElementById('profileJoinDate');
    const profilePostCount = document.getElementById('profilePostCount');
    const profileLikeCount = document.getElementById('profileLikeCount');
    const userPostsList = document.getElementById('userPostsList');
    const userCommentsList = document.getElementById('userCommentsList');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // 当前用户数据
    let currentUser = null;
    let userPosts = [];
    let userComments = [];
    
    // 初始化个人主页
    function init() {
        checkLoginStatus();
        loadUserData();
        setupTabsNavigation();
        loadUserPosts();
        loadUserComments();
    }
    
    // 检查登录状态
    function checkLoginStatus() {
        const userJson = localStorage.getItem('currentUser');
        if (!userJson) {
            // 用户未登录，重定向到登录页
            window.location.href = 'login.html?redirect=forum';
            return;
        }
        
        currentUser = JSON.parse(userJson);
        console.log('当前用户信息:', currentUser);
    }
    
    // 加载用户数据
    function loadUserData() {
        if (!currentUser) return;
        
        // 设置用户基本信息
        profileName.textContent = currentUser.realName || currentUser.username;
        profileClass.textContent = `${currentUser.grade} ${currentUser.className}`;
        profileJoinDate.textContent = currentUser.joinDate || '未知';
        
        // 显示用户名
        const userNickname = document.createElement('p');
        userNickname.className = 'user-nickname';
        userNickname.textContent = `用户名: ${currentUser.username}`;
        profileClass.parentNode.insertBefore(userNickname, profileClass.nextSibling);
    }
    
    // 设置标签页导航
    function setupTabsNavigation() {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // 移除所有按钮的活动状态
                tabButtons.forEach(btn => btn.classList.remove('active'));
                // 添加当前按钮的活动状态
                this.classList.add('active');
                
                // 获取标签页ID
                const tabId = this.dataset.tab;
                
                // 隐藏所有内容
                tabContents.forEach(content => content.classList.remove('active'));
                
                // 显示对应内容
                document.getElementById(tabId + '-tab').classList.add('active');
            });
        });
    }
    
    // 加载用户帖子
    function loadUserPosts() {
        if (!currentUser) return;
        
        // 加载所有帖子
        const allPosts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
        
        // 过滤出用户的帖子
        userPosts = allPosts.filter(post => post.authorId === currentUser.id);
        
        // 更新帖子数量
        profilePostCount.textContent = userPosts.length;
        
        // 计算获赞总数
        let totalLikes = userPosts.reduce((total, post) => total + post.likes, 0);
        profileLikeCount.textContent = totalLikes;
        
        // 渲染用户帖子
        renderUserPosts();
    }
    
    // 渲染用户帖子
    function renderUserPosts() {
        // 清空列表
        userPostsList.innerHTML = '';
        
        if (userPosts.length === 0) {
            userPostsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>您还没有发布过帖子</p>
                </div>
            `;
            return;
        }
        
        // 渲染帖子列表
        userPosts.forEach(post => {
            let mediaHTML = '';
            
            // 生成媒体HTML
            if (post.media && post.media.length > 0) {
                mediaHTML = '<div class="post-media">';
                post.media.forEach(media => {
                    if (media.type === 'image') {
                        mediaHTML += `<img src="${media.url}" alt="Post Image">`;
                    } else if (media.type === 'video') {
                        if (media.url === 'video_placeholder' || media.videoSaved === false) {
                            mediaHTML += `<div class="video-placeholder"><i class="fas fa-video"></i><p>视频内容 (已保存帖子后，视频不会显示)</p></div>`;
                        } else {
                            mediaHTML += `<video src="${media.url}" controls></video>`;
                        }
                    }
                });
                mediaHTML += '</div>';
            }
            
            const postHTML = `
                <div class="post-card" data-category="${post.category}" data-id="${post.id}">
                    <div class="post-header">
                        <h3>${post.content.substring(0, 30)}${post.content.length > 30 ? '...' : ''}</h3>
                        <span class="post-category">${getCategoryName(post.category)}</span>
                    </div>
                    <div class="post-meta">
                        <span class="date"><i class="fas fa-clock"></i> ${post.date}</span>
                    </div>
                    <p class="post-excerpt">${post.content}</p>
                    ${mediaHTML}
                    <div class="post-footer">
                        <div class="post-actions">
                            <span class="post-likes"><i class="fas fa-heart"></i> ${post.likes} 赞</span>
                            <span class="post-comments"><i class="fas fa-comment"></i> ${post.comments.length} 评论</span>
                        </div>
                        <div class="post-stats">
                            <span><i class="fas fa-eye"></i> ${post.views || 0}</span>
                        </div>
                    </div>
                </div>
            `;
            userPostsList.insertAdjacentHTML('beforeend', postHTML);
        });
    }
    
    // 加载用户评论
    function loadUserComments() {
        if (!currentUser) return;
        
        // 加载所有帖子
        const allPosts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
        
        // 从所有帖子中提取用户的评论
        userComments = [];
        allPosts.forEach(post => {
            const postComments = post.comments.filter(comment => comment.authorId === currentUser.id);
            postComments.forEach(comment => {
                userComments.push({
                    ...comment,
                    postId: post.id,
                    postTitle: post.content.substring(0, 30) + (post.content.length > 30 ? '...' : '')
                });
            });
        });
        
        // 渲染用户评论
        renderUserComments();
    }
    
    // 渲染用户评论
    function renderUserComments() {
        // 清空列表
        userCommentsList.innerHTML = '';
        
        if (userComments.length === 0) {
            userCommentsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comment-slash"></i>
                    <p>您还没有发表过评论</p>
                </div>
            `;
            return;
        }
        
        // 渲染评论列表
        userComments.forEach(comment => {
            const commentHTML = `
                <div class="comment-card">
                    <div class="comment-header">
                        <span class="comment-post">评论于: <a href="forum.html">${comment.postTitle}</a></span>
                        <span class="comment-date">${comment.date}</span>
                    </div>
                    <p class="comment-content">${comment.content}</p>
                </div>
            `;
            userCommentsList.insertAdjacentHTML('beforeend', commentHTML);
        });
    }
    
    // 获取分类名称
    function getCategoryName(category) {
        const categories = {
            'game': '游戏',
            'trade': '交易',
            'gossip': '八卦',
            'news': '最新消息',
            'guide': '校园攻略',
            'study': '学习',
            'love': '恋爱'
        };
        return categories[category] || category;
    }
    
    // 初始化页面
    init();
}); 