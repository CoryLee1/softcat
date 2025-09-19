# 🐱 软体猫桌宠项目概览

## 📁 主项目结构

```
softcat/                          # 主项目目录
├── extension/                     # Chrome扩展源码
│   ├── background/               # 后台脚本
│   │   └── background.js         # 核心控制器，管理库文件加载
│   ├── content/                  # 内容脚本
│   │   └── content.js            # 页面消息处理器
│   ├── popup/                    # 弹窗界面
│   │   ├── popup.html            # 弹窗HTML
│   │   ├── popup.css             # 弹窗样式
│   │   └── popup.js              # 弹窗逻辑
│   ├── options/                  # 设置页面
│   └── lib/                      # 第三方库文件
│       ├── p5.min.js             # p5.js图形库
│       └── matter.min.js         # Matter.js物理引擎
├── shared/                       # 共享代码
│   └── softcat-core.js           # 软体猫核心逻辑
├── src/                          # TypeScript源码
├── dist/                         # 构建输出
└── docs/                         # 文档
```

## 🔄 点击"召喚喵助手"后的完整数据流

### 1. 用户交互 (popup.js)
```javascript
// 用户点击按钮
toggleSoftCat() {
  // 发送消息到后台脚本
  chrome.runtime.sendMessage({ action: 'toggleSoftCat' })
}
```

### 2. 后台处理 (background.js)
```javascript
// 接收消息，开始注入流程
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleSoftCat') {
    await injectSoftCat(tabId);  // 关键步骤
  }
});
```

### 3. 库文件加载 (background.js)
```javascript
// 按顺序加载库文件
injectLibraryLoader(tabId) {
  // 1. 先加载 p5.js
  p5Script.src = chrome.runtime.getURL('lib/p5.min.js');
  
  // 2. 再加载 Matter.js  
  matterScript.src = chrome.runtime.getURL('lib/matter.min.js');
  
  // 等待两个库都加载完成
  waitForLibrariesLoaded(tabId);
}
```

### 4. 注入核心脚本 (background.js)
```javascript
// 库文件加载完成后，注入软体猫核心
chrome.scripting.executeScript({
  target: { tabId },
  files: ['shared/softcat-core.js']
});
```

### 5. 软体猫初始化 (softcat-core.js)
```javascript
// 检测库文件是否就绪
waitForLibraries() {
  const p5Loaded = typeof p5 !== 'undefined';
  const matterLoaded = typeof Matter !== 'undefined';
  
  if (p5Loaded && matterLoaded) {
    // 开始初始化软体猫系统
    initSoftCat();
  }
}
```

### 6. 创建软体猫系统 (softcat-core.js)
```javascript
initSoftCat() {
  // 1. 初始化p5.js渲染
  initP5();
  
  // 2. 初始化Matter.js物理引擎
  initMatter();
  
  // 3. 创建物理对象
  createMachine();    // 洗衣机
  createSoftBody();   // 软体猫
  createTail();       // 尾巴
  createConstraints(); // 约束
  
  // 4. 开始渲染循环
  startRenderLoop();
}
```

## 🎯 关键协作点

### 消息传递链
```
Popup → Background → Content → SoftCat Core
  ↓         ↓          ↓         ↓
用户界面   库文件加载   消息转发   物理模拟
```

### 库文件加载顺序（重要！）
```
1. p5.js (图形渲染) → 2. Matter.js (物理引擎) → 3. 软体猫核心
```

### 状态管理
- **Background**: 全局软体猫状态 (`softcatEnabled`)
- **Content**: 页面级别控制接口
- **Popup**: 用户界面状态显示
- **SoftCat Core**: 物理模拟状态

## 🔧 主脚本位置

1. **入口**: `extension/popup/popup.js` - 用户点击启动
2. **控制器**: `extension/background/background.js` - 核心逻辑和库文件管理
3. **处理器**: `extension/content/content.js` - 页面消息处理
4. **核心**: `shared/softcat-core.js` - 软体猫物理模拟和渲染

## ⚡ 技术栈

- **图形渲染**: p5.js (替代PIXI.js)
- **物理引擎**: Matter.js
- **扩展框架**: Chrome Extension Manifest V3
- **开发语言**: JavaScript + TypeScript

## 🚀 使用流程

1. 用户点击扩展图标
2. 点击"召喚喵助手"按钮
3. 后台脚本开始库文件加载流程
4. 按顺序加载p5.js和Matter.js
5. 注入软体猫核心脚本
6. 软体猫在页面上开始物理模拟
7. 用户可以通过拖拽和键盘控制软体猫

这个架构确保了软体猫能够可靠地在任何网页上运行，同时提供了良好的用户体验和错误处理机制。
