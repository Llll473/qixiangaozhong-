// 简化版论坛功能，重点关注功能可用性
document.addEventListener('DOMContentLoaded', function() {
    // 声明全局变量
    let posts = [];
    let uploadedMedia = []; // 存储上传的媒体文件
    let currentUser = null; // 当前登录用户
    
    // 基础DOM元素
    const postsList = document.querySelector('.posts-list');
    const quickPostContent = document.getElementById('quickPostContent');
    const quickPostCategory = document.getElementById('quickPostCategory');
    const quickPostBtn = document.querySelector('.quick-post-btn');
    const categoryFilter = document.getElementById('category-filter');
    const imageUpload = document.getElementById('imageUpload');
    const videoUpload = document.getElementById('videoUpload');
    const uploadPreview = document.querySelector('.upload-preview');
    
    // 初始化函数 - 加载帖子并设置事件监听
    function init() {
        console.log('论坛初始化开始...');
        
        // 检查登录状态
        checkLoginStatus();
        
        // 加载帖子
        loadPosts();
        
        // 设置发帖按钮事件
        quickPostBtn.addEventListener('click', handleQuickPost);
        
        // 设置分类筛选事件
        categoryFilter.addEventListener('change', filterPosts);
        
        // 使用事件委托处理所有交互
        postsList.addEventListener('click', handlePostsListClick);
        
        // 设置媒体上传事件
        imageUpload.addEventListener('change', handleImageUpload);
        videoUpload.addEventListener('change', handleVideoUpload);
        uploadPreview.addEventListener('click', handleRemoveMedia);
        
        console.log('论坛初始化完成');
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
        console.log('当前登录用户:', currentUser.username);
    }
    
    // 处理图片上传
    function handleImageUpload(e) {
        const files = e.target.files;
        if (!files.length) return;
        
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) {
                console.error('不支持的文件类型:', file.type);
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                const mediaItem = {
                    id: Date.now() + Math.random().toString(36).substr(2, 5),
                    type: 'image',
                    url: event.target.result,
                    file: file
                };
                
                uploadedMedia.push(mediaItem);
                renderMediaPreview();
            };
            reader.readAsDataURL(file);
        });
        
        // 重置input，允许重复选择同一文件
        e.target.value = '';
    }
    
    // 处理视频上传
    function handleVideoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
                if (!file.type.startsWith('video/')) {            console.error('不支持的文件类型:', file.type);            return;        }        // 检查视频大小限制 (最大 10MB)        const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB        if (file.size > MAX_VIDEO_SIZE) {            alert('视频文件过大，请上传小于10MB的视频');            return;        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const mediaItem = {
                id: Date.now() + Math.random().toString(36).substr(2, 5),
                type: 'video',
                url: event.target.result,
                file: file
            };
            
            uploadedMedia.push(mediaItem);
            renderMediaPreview();
        };
        reader.readAsDataURL(file);
        
        // 重置input，允许重复选择同一文件
        e.target.value = '';
    }
    
    // 渲染媒体预览
    function renderMediaPreview() {
        uploadPreview.innerHTML = '';
        
        uploadedMedia.forEach(item => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.dataset.id = item.id;
            
            if (item.type === 'image') {
                previewItem.innerHTML = `
                    <img src="${item.url}" alt="Image Preview">
                    <div class="remove-media" data-id="${item.id}"><i class="fas fa-times"></i></div>
                `;
            } else if (item.type === 'video') {
                previewItem.innerHTML = `
                    <video src="${item.url}" muted></video>
                    <div class="remove-media" data-id="${item.id}"><i class="fas fa-times"></i></div>
                `;
            }
            
            uploadPreview.appendChild(previewItem);
        });
    }
    
    // 处理移除媒体
    function handleRemoveMedia(e) {
        if (!e.target.closest('.remove-media')) return;
        
        const removeBtn = e.target.closest('.remove-media');
        const mediaId = removeBtn.dataset.id;
        
        // 从数组中移除媒体
        uploadedMedia = uploadedMedia.filter(item => item.id !== mediaId);
        
        // 更新预览
        renderMediaPreview();
    }
    
    // 处理快速发帖
    function handleQuickPost() {
        const content = quickPostContent.value.trim();
        const category = quickPostCategory.value;
        
        console.log('尝试发布帖子:', { content: content.substring(0, 20) + '...', category });
        
        if (!content && uploadedMedia.length === 0) {
            alert('请输入内容或上传媒体后再发布');
            return;
        }
        
        // 创建新帖子对象
        const post = {
            id: Date.now(),
            content: content,
            category: category,
            author: currentUser.realName || currentUser.username,
            authorId: currentUser.id,
            date: new Date().toISOString().split('T')[0],
            likes: 0,
            views: 0,
            comments: [],
            media: uploadedMedia
        };
        
        // 添加到本地存储和内存中
        posts.unshift(post);
        savePosts();
        
        // 重新渲染帖子列表
        renderPosts();
        
        // 清空输入框和媒体
        quickPostContent.value = '';
        uploadedMedia = [];
        uploadPreview.innerHTML = '';
        
        console.log('帖子发布成功，ID:', post.id);
    }
    
    // 处理帖子列表的点击事件（事件委托）
    function handlePostsListClick(e) {
        // 处理点赞按钮
        if (e.target.closest('.btn-like')) {
            const likeBtn = e.target.closest('.btn-like');
            const postId = parseInt(likeBtn.closest('.post-card').dataset.id);
            handleLike(postId, likeBtn);
        }
        
        // 处理评论按钮
        if (e.target.closest('.btn-comment')) {
            const postCard = e.target.closest('.post-card');
            const commentsSection = postCard.querySelector('.comments-section');
            commentsSection.classList.toggle('active');
        }
        
        // 处理评论提交
        if (e.target.closest('.btn-submit-comment')) {
            const postCard = e.target.closest('.post-card');
            const postId = parseInt(postCard.dataset.id);
            const textarea = postCard.querySelector('.comment-form textarea');
            const commentContent = textarea.value.trim();
            
            if (commentContent) {
                addComment(postId, commentContent, postCard);
                textarea.value = '';
            } else {
                alert('请输入评论内容');
            }
        }
    }
    
    // 处理点赞
    function handleLike(postId, likeBtn) {
        console.log('处理点赞，帖子ID:', postId);
        
        // 查找帖子
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex === -1) {
            console.error('点赞失败：找不到帖子', postId);
            return;
        }
        
        // 更新点赞数
        posts[postIndex].likes++;
        
        // 更新UI
        const likesCounter = likeBtn.querySelector('span');
        likesCounter.textContent = posts[postIndex].likes;
        likeBtn.classList.add('active');
        likeBtn.dataset.likes = posts[postIndex].likes;
        
        // 保存到localStorage
        savePosts();
        
        console.log('点赞成功，新点赞数:', posts[postIndex].likes);
    }
    
    // 添加评论
    function addComment(postId, content, postCard) {
        console.log('添加评论，帖子ID:', postId);
        
        // 查找帖子
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex === -1) {
            console.error('评论失败：找不到帖子', postId);
            return;
        }
        
        // 创建评论对象
        const comment = {
            id: Date.now(),
            author: currentUser.realName || currentUser.username,
            authorId: currentUser.id,
            date: new Date().toISOString().split('T')[0],
            content: content
        };
        
        // 添加评论到帖子
        posts[postIndex].comments.push(comment);
        
        // 保存到localStorage
        savePosts();
        
        // 更新UI
        const commentsList = postCard.querySelector('.comments-list');
        const commentHTML = `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-date">${comment.date}</span>
                </div>
                <p class="comment-content">${comment.content}</p>
            </div>
        `;
        commentsList.insertAdjacentHTML('beforeend', commentHTML);
        
        console.log('评论添加成功');
    }
    
    // 根据分类筛选帖子
    function filterPosts() {
        const selectedCategory = categoryFilter.value;
        console.log('筛选分类:', selectedCategory);
        
        const postCards = document.querySelectorAll('.post-card');
        postCards.forEach(card => {
            if (selectedCategory === 'all' || card.dataset.category === selectedCategory) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
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
    
    // 从localStorage加载帖子
    function loadPosts() {
        try {
            const storedPosts = localStorage.getItem('forumPosts');
            if (storedPosts) {
                posts = JSON.parse(storedPosts);
                console.log('从localStorage加载了', posts.length, '个帖子');
            } else {
                console.log('localStorage中没有找到帖子');
                posts = [];
            }
            
            // 如果没有帖子，保留现有示例帖子
            if (posts.length === 0) {
                const examplePosts = document.querySelectorAll('.post-card');
                if (examplePosts.length > 0) {
                    console.log('保留示例帖子');
                    return;
                }
            }
            
            // 渲染帖子列表
            renderPosts();
        } catch (error) {
            console.error('加载帖子出错:', error);
            alert('加载帖子时出错，请刷新页面重试');
        }
    }
    
    // 保存帖子到localStorage
    function savePosts() {
        try {
            // 创建一个克隆版本的帖子数组，转换视频URL为简短的版本以节省空间
            const postsToSave = posts.map(post => {
                // 克隆帖子对象
                const clonedPost = {...post};
                
                // 如果有媒体，处理媒体数据
                if (clonedPost.media && clonedPost.media.length > 0) {
                    clonedPost.media = clonedPost.media.map(media => {
                        // 创建媒体的克隆版本
                        const clonedMedia = {...media};
                        
                        // 删除file属性，无法保存在localStorage中
                        delete clonedMedia.file;
                        
                        // 对于视频，我们存储一个标记而不是完整的数据URL
                        // 这样会丢失实际视频数据，但保证不会超出localStorage限制
                        if (media.type === 'video') {
                            // 保存视频的一些元数据，而不是完整的视频数据
                            clonedMedia.url = 'video_placeholder'; 
                            clonedMedia.videoSaved = false;
                        }
                        
                        return clonedMedia;
                    });
                }
                
                return clonedPost;
            });
            
            localStorage.setItem('forumPosts', JSON.stringify(postsToSave));
            console.log('帖子已保存到localStorage');
        } catch (error) {
            console.error('保存帖子出错:', error);
            alert('保存帖子时出错，您的数据可能不会被保存');
        }
    }
    
    // 渲染帖子列表
    function renderPosts() {
        console.log('渲染帖子列表, 共', posts.length, '个帖子');
        
        // 清空帖子列表
        postsList.innerHTML = '';
        
        // 渲染所有帖子
        posts.forEach(post => {
            let mediaHTML = '';
            
            // 生成媒体HTML
            if (post.media && post.media.length > 0) {
                mediaHTML = '<div class="post-media">';
                post.media.forEach(media => {
                    if (media.type === 'image') {
                        mediaHTML += `<img src="${media.url}" alt="Post Image">`;
                    } else if (media.type === 'video') {
                        // 检查视频URL是否是占位符
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
                        <span class="author"><i class="fas fa-user"></i> ${post.author}</span>
                        <span class="date"><i class="fas fa-clock"></i> ${post.date}</span>
                    </div>
                    <p class="post-excerpt">${post.content}</p>
                    ${mediaHTML}
                    <div class="post-footer">
                        <div class="post-actions">
                            <button class="btn-like" data-likes="${post.likes}"><i class="fas fa-heart"></i> <span>${post.likes}</span></button>
                            <button class="btn-comment"><i class="fas fa-comment"></i> 评论</button>
                        </div>
                        <div class="post-stats">
                            <span><i class="fas fa-eye"></i> ${post.views}</span>
                        </div>
                    </div>
                    <div class="comments-section">
                        <div class="comments-list">
                            ${renderComments(post.comments)}
                        </div>
                        <div class="comment-form">
                            <textarea placeholder="添加评论..."></textarea>
                            <button class="btn-submit-comment">发送</button>
                        </div>
                    </div>
                </div>
            `;
            postsList.insertAdjacentHTML('beforeend', postHTML);
        });
    }
    
    // 渲染评论
    function renderComments(comments) {
        if (!comments || comments.length === 0) {
            return '';
        }

        return comments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-date">${comment.date}</span>
                </div>
                <p class="comment-content">${comment.content}</p>
            </div>
        `).join('');
    }
    
    // 启动论坛功能
    init();
}); 