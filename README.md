# 软体猫桌宠 Chrome 扩展

一个可爱的软体猫桌宠 Chrome 扩展，使用 p5.js + Matter.js 实现物理模拟和交互效果。

## ✨ 功能特性

- 🐱 **软体猫物理模拟** - 使用 Matter.js 实现真实的软体物理效果
- 🎨 **精灵图蒙皮** - 支持猫和洗衣机的精美精灵图显示
- 🎮 **交互控制** - 支持拖拽洗衣机、键盘控制等交互
- 🌊 **尾巴系统** - 动态尾巴跟随物理模拟
- 📱 **Chrome 扩展** - 完全符合 Manifest V3 规范
- 🚀 **单文件打包** - 无外部依赖，避免 CSP 违规

## 🎯 核心功能

### 物理模拟
- 软体猫网格系统（8x6 粒子网格）
- 物理约束和弹簧系统
- 洗衣机震动效果
- 重力模拟

### 交互控制
- **拖拽洗衣机** - 点击并拖拽洗衣机移动
- **键盘控制**：
  - `V` - 切换物理可视化显示
  - `R` - 重置猫的形状

### 视觉效果
- 透明背景，不影响网页浏览
- 精灵图蒙皮（cat.png, washing_machine.png）
- 物理约束线可视化
- 平滑动画效果

## 🛠️ 技术栈

- **p5.js** - 2D 图形渲染和动画
- **Matter.js** - 2D 物理引擎
- **TypeScript** - 类型安全的开发
- **esbuild** - 快速打包工具
- **Chrome Extension Manifest V3** - 现代扩展规范

## 📦 安装使用

### 开发环境

1. **克隆项目**
   ```bash
   git clone https://github.com/CoryLee1/softcat.git
   cd softcat
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **构建扩展**
   ```bash
   npm run build:mv3
   ```

4. **加载到 Chrome**
   - 打开 Chrome 扩展管理页面 (`chrome://extensions/`)
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择 `dist/` 目录

### 使用扩展

1. 安装后，点击扩展图标启动软体猫
2. 软体猫会出现在当前网页上
3. 可以拖拽洗衣机移动位置
4. 使用键盘快捷键控制显示效果

## 🏗️ 项目结构

```
softcat/
├── src/                    # 源代码
│   ├── content/           # 内容脚本
│   │   └── index.ts      # 主内容脚本入口
│   ├── core/             # 核心逻辑
│   │   └── softcat-core-entry.ts  # 软体猫核心实现
│   └── vendor/           # 第三方库入口
│       └── matter-entry.ts # Matter.js 入口
├── dist/                  # 构建输出
│   ├── manifest.json     # 扩展清单
│   ├── background.js     # 后台脚本
│   ├── content.iife.js   # 内容脚本（单文件）
│   ├── popup.html        # 弹窗界面
│   ├── popup.css         # 弹窗样式
│   ├── popup.js          # 弹窗逻辑
│   └── assets/           # 资源文件
│       └── images/       # 精灵图
├── build.js              # 构建脚本
└── package.json          # 项目配置
```

## 🔧 开发命令

```bash
# 构建完整扩展
npm run build:mv3

# 单独构建库文件
npm run build:matter    # 构建 Matter.js
npm run build:content   # 构建内容脚本

# 清理构建文件
npm run clean
```

## 🎮 控制说明

| 操作 | 说明 |
|------|------|
| 鼠标拖拽 | 拖拽洗衣机移动位置 |
| `V` 键 | 切换物理约束可视化 |
| `R` 键 | 重置软体猫形状 |

## 🐛 故障排除

### 扩展无法加载
- 确保使用 Chrome 浏览器
- 检查是否开启了开发者模式
- 确认 `dist/` 目录包含所有必要文件

### 软体猫不显示
- 检查浏览器控制台是否有错误信息
- 确认图片资源是否正确加载
- 尝试刷新页面重新加载扩展

### 物理效果异常
- 按 `R` 键重置软体猫形状
- 检查 Matter.js 是否正确加载
- 查看控制台物理引擎日志

## 📝 开发日志

### v1.0.0 (2024-01-XX)
- ✨ 初始版本发布
- 🐱 实现软体猫物理模拟
- 🎨 添加精灵图蒙皮效果
- 🎮 支持拖拽和键盘交互
- 📱 完全兼容 Manifest V3

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👨‍💻 作者

**CoryLee1** - [GitHub](https://github.com/CoryLee1)

---

🐱 让软体猫陪伴你的浏览时光！
