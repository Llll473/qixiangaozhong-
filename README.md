# 河南省杞县高中官方网站

河南省杞县高中官方网站，使用HTML、CSS和JavaScript构建的现代化响应式网站。

## 学校简介

杞县高中，始创于1952年，属省级示范性普通高中，省级文明单位。学校在职教职工360 人，其中专任教师 326 人，特级教师2 人，高级教师 63人，具有本科学历的教师达92 %，有研究生毕业的教师 9 人。

学校现有 84 个教学班，学生5540 人。校园占地面积 180 亩，建筑面积9.6 万 平方米，绿化面积 2.3万平方米。校园地理位置优越，环境优雅，是三季有花、四季常绿的花园式学校，是教育精英会集之地，是莘莘学子深造升学的理想场所。

## 网站特点

- 现代化设计
- 完全响应式布局
- 平滑滚动效果
- 联系表单与验证
- 动画效果
- 移动端友好的导航
- 支持各种屏幕尺寸

## 文件结构

```
.
├── index.html         # 主HTML文件
├── css/
│   └── style.css      # 主样式表
├── js/
│   └── main.js        # JavaScript脚本
└── README.md          # 项目说明文件
```

## 使用方法

1. 克隆或下载此仓库
2. 使用网页浏览器打开`index.html`文件
3. 根据您的需求自定义内容

## 定制

### 更改颜色主题

在`css/style.css`文件中，您可以更改主色调：

```css
/* 更改为您喜欢的颜色 */
.btn {
    background: #3498db; /* 主色调 */
}

.btn:hover {
    background: #2980b9; /* 主色调的暗色版本 */
}
```

### 添加新的部分

要添加新的部分，请在HTML文件中复制现有部分的结构并修改内容：

```html
<section id="新部分名称">
    <div class="container">
        <div class="section-header">
            <h2>部分标题</h2>
            <p>部分描述</p>
        </div>
        <!-- 此处添加您的内容 -->
    </div>
</section>
```

### 修改导航菜单

在`index.html`文件中更新导航链接：

```html
<nav>
    <ul>
        <li><a href="#home">首页</a></li>
        <li><a href="#about">关于</a></li>
        <li><a href="#services">服务</a></li>
        <li><a href="#新部分">新部分名称</a></li>
        <li><a href="#contact">联系我们</a></li>
    </ul>
</nav>
```

## 兼容性

此网站模板兼容所有现代浏览器，包括：

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)
- Opera (最新版本)

## 许可

此模板可以免费用于个人和商业项目。 