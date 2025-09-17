# 🐱 SoftCat WebExtension 项目架构

## 📁 项目结构

```
softcat/
├── 📁 extension/                 # WebExtension 核心文件
│   ├── 📁 manifest/             # Manifest V3 配置文件
│   │   ├── manifest.json        # 主配置文件
│   │   ├── manifest.chrome.json # Chrome 特定配置
│   │   └── manifest.firefox.json# Firefox 特定配置
│   ├── 📁 popup/                # 扩展弹窗页面
│   │   ├── popup.html
│   │   ├── popup.js
│   │   └── popup.css
│   ├── 📁 content/              # 内容脚本
│   │   ├── content.js           # 注入到网页的脚本
│   │   └── cat-injector.js      # 软体猫注入器
│   ├── 📁 background/           # 后台脚本
│   │   ├── background.js        # Service Worker
│   │   └── message-handler.js   # 消息处理
│   ├── 📁 options/              # 选项页面
│   │   ├── options.html
│   │   ├── options.js
│   │   └── options.css
│   └── 📁 assets/               # 扩展资源
│       ├── icons/               # 扩展图标
│       ├── images/              # 图片资源
│       └── sounds/              # 音效文件
├── 📁 frontend/                 # 前端应用
│   ├── 📁 src/                  # 源代码
│   │   ├── 📁 components/       # React/Vue 组件
│   │   ├── 📁 pages/           # 页面组件
│   │   ├── 📁 hooks/           # 自定义 Hooks
│   │   ├── 📁 utils/           # 工具函数
│   │   └── 📁 styles/          # 样式文件
│   ├── 📁 dist/                # 构建输出
│   └── 📁 public/              # 静态资源
├── 📁 backend/                 # 后端服务
│   ├── 📁 api/                 # API 路由
│   │   ├── 📁 v1/              # API 版本 1
│   │   └── 📁 middleware/      # 中间件
│   ├── 📁 services/            # 业务逻辑
│   │   ├── cat-service.js      # 软体猫服务
│   │   ├── user-service.js     # 用户服务
│   │   └── storage-service.js  # 存储服务
│   ├── 📁 models/              # 数据模型
│   │   ├── Cat.js              # 软体猫模型
│   │   └── User.js             # 用户模型
│   └── 📁 utils/               # 工具函数
├── 📁 shared/                  # 共享代码
│   ├── 📁 types/               # TypeScript 类型定义
│   ├── 📁 constants/           # 常量定义
│   └── 📁 utils/               # 共享工具函数
├── 📁 scripts/                 # 构建和部署脚本
│   ├── build.js                # 构建脚本
│   ├── deploy.js               # 部署脚本
│   └── package-extension.js    # 打包扩展
├── 📁 docs/                    # 文档
│   ├── API.md                  # API 文档
│   ├── DEVELOPMENT.md          # 开发指南
│   └── DEPLOYMENT.md           # 部署指南
├── 📄 package.json             # 项目依赖
├── 📄 webpack.config.js        # Webpack 配置
├── 📄 tsconfig.json            # TypeScript 配置
└── 📄 README.md                # 项目说明
```

## 🎯 各模块职责

### **Extension 模块**
- **Manifest**: 定义扩展权限和能力
- **Popup**: 用户交互界面
- **Content Script**: 在网页中注入软体猫
- **Background**: 后台服务和数据管理
- **Options**: 扩展设置页面

### **Frontend 模块**
- **React/Vue 应用**: 管理界面和用户交互
- **软体猫渲染**: 基于现有 Pixi.js + Matter.js
- **状态管理**: Redux/Vuex 管理应用状态
- **API 调用**: 与后端服务通信

### **Backend 模块**
- **API 服务**: 提供 RESTful API
- **数据存储**: 用户设置、软体猫状态
- **业务逻辑**: 软体猫行为、用户管理
- **实时通信**: WebSocket 支持

### **Shared 模块**
- **类型定义**: TypeScript 接口
- **常量**: 配置常量
- **工具函数**: 通用工具函数

## 🔧 技术栈建议

### **前端技术**
- **框架**: React 18 + TypeScript
- **状态管理**: Zustand 或 Redux Toolkit
- **构建工具**: Vite 或 Webpack 5
- **样式**: Tailwind CSS + Styled Components
- **物理引擎**: Matter.js (现有)
- **渲染引擎**: Pixi.js (现有)

### **后端技术**
- **运行时**: Node.js + Express
- **数据库**: SQLite (轻量) 或 PostgreSQL
- **ORM**: Prisma 或 TypeORM
- **认证**: JWT + Passport.js
- **实时通信**: Socket.io

### **扩展技术**
- **Manifest**: V3 (Chrome/Firefox 兼容)
- **构建**: Webpack + Chrome Extension API
- **测试**: Jest + Puppeteer
- **发布**: Chrome Web Store + Firefox Add-ons

## 🚀 开发流程

1. **环境搭建**: 安装依赖，配置开发环境
2. **共享模块**: 先开发 shared 模块
3. **后端开发**: API 和业务逻辑
4. **前端开发**: 用户界面和软体猫渲染
5. **扩展开发**: 集成到浏览器扩展
6. **测试部署**: 单元测试和集成测试
7. **发布上线**: 打包发布到应用商店

## 📦 浏览器兼容性

- ✅ **Chrome**: Manifest V3
- ✅ **Firefox**: Manifest V3 (部分兼容)
- ✅ **Edge**: 基于 Chromium
- ✅ **Safari**: 需要额外适配
- ✅ **Opera**: 基于 Chromium
