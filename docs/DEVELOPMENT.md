# 🚀 软体猫桌宠 WebExtension 开发指南

## 📋 项目概述

这是一个基于 WebExtension 的软体猫桌宠项目，支持 Chrome、Firefox、Edge 等主流浏览器。

## 🏗️ 项目架构

### **前端 (Frontend)**
- **技术栈**: React + TypeScript + Vite
- **物理引擎**: Matter.js
- **渲染引擎**: Pixi.js
- **状态管理**: Zustand

### **后端 (Backend)**
- **技术栈**: Node.js + Express + TypeScript
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **ORM**: Prisma
- **认证**: JWT

### **扩展 (Extension)**
- **Manifest**: V3
- **内容脚本**: 注入软体猫到网页
- **弹窗**: 用户控制界面
- **后台脚本**: 数据管理和通信

## 🛠️ 开发环境搭建

### 1. **安装依赖**
```bash
# 安装根目录依赖
npm install

# 安装各模块依赖
npm run install:all
```

### 2. **开发模式启动**
```bash
# 同时启动前端、后端、扩展开发服务器
npm run dev

# 或者分别启动
npm run dev:frontend  # 前端开发服务器
npm run dev:backend   # 后端开发服务器
npm run dev:extension # 扩展开发服务器
```

### 3. **构建项目**
```bash
# 构建所有模块
npm run build

# 构建特定模块
npm run build:frontend
npm run build:backend
npm run build:extension
```

## 📁 目录结构说明

```
softcat/
├── extension/           # WebExtension 核心
│   ├── manifest/        # Manifest 配置文件
│   ├── popup/          # 弹窗页面
│   ├── content/        # 内容脚本
│   ├── background/     # 后台脚本
│   ├── options/        # 选项页面
│   └── assets/         # 扩展资源
├── frontend/           # 前端应用
│   ├── src/           # 源代码
│   ├── dist/          # 构建输出
│   └── public/        # 静态资源
├── backend/           # 后端服务
│   ├── api/           # API 路由
│   ├── services/      # 业务逻辑
│   ├── models/        # 数据模型
│   └── utils/         # 工具函数
├── shared/            # 共享代码
│   ├── types/         # TypeScript 类型
│   ├── constants/     # 常量定义
│   └── utils/         # 共享工具
└── scripts/           # 构建脚本
```

## 🔧 开发工作流

### **1. 功能开发**
1. 在 `shared/` 中定义类型和常量
2. 在 `backend/` 中实现 API 和业务逻辑
3. 在 `frontend/` 中实现用户界面
4. 在 `extension/` 中集成到浏览器扩展

### **2. 软体猫核心开发**
- 核心逻辑在 `shared/softcat-core.js`
- 基于现有的 Pixi.js + Matter.js 实现
- 支持动态加载和注入

### **3. 扩展开发**
- 内容脚本负责注入软体猫到网页
- 弹窗提供用户控制界面
- 后台脚本管理数据和通信

## 🧪 测试

### **单元测试**
```bash
npm run test
```

### **扩展测试**
```bash
npm run test:extension
```

### **集成测试**
```bash
npm run test:integration
```

## 📦 打包和发布

### **开发版本**
```bash
npm run package:dev
```

### **生产版本**
```bash
npm run package:prod
```

### **发布到应用商店**
```bash
npm run publish:chrome    # Chrome Web Store
npm run publish:firefox   # Firefox Add-ons
```

## 🌐 浏览器兼容性

| 浏览器 | 版本 | 支持状态 |
|--------|------|----------|
| Chrome | 88+ | ✅ 完全支持 |
| Firefox | 78+ | ✅ 完全支持 |
| Edge | 88+ | ✅ 完全支持 |
| Safari | 14+ | ⚠️ 部分支持 |

## 🔍 调试技巧

### **扩展调试**
1. 打开 Chrome 扩展管理页面
2. 启用开发者模式
3. 加载 `dist/` 目录
4. 使用 Chrome DevTools 调试

### **内容脚本调试**
1. 在网页中按 F12
2. 查看 Console 中的软体猫日志
3. 使用 Sources 面板调试

### **后台脚本调试**
1. 在扩展管理页面点击"检查视图"
2. 使用 Service Worker 调试工具

## 📚 相关文档

- [Chrome Extension 开发文档](https://developer.chrome.com/docs/extensions/)
- [Firefox Extension 开发文档](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Matter.js 文档](https://brm.io/matter-js/)
- [Pixi.js 文档](https://pixijs.download/)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 📄 许可证

MIT License
