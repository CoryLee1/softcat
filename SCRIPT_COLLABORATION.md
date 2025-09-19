# 🐱 软体猫扩展脚本协作详解

## 📋 项目架构概览

软体猫扩展采用Chrome Extension Manifest V3架构，包含以下核心组件：

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Popup UI      │    │  Background     │    │  Content Script │
│   (popup.js)    │◄──►│  (background.js)│◄──►│  (content.js)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       ▼
         │                       │              ┌─────────────────┐
         │                       │              │  SoftCat Core   │
         │                       └──────────────►│ (softcat-core.js)│
         │                                      └─────────────────┘
         │                                               │
         └───────────────────────────────────────────────┘
```

## 🔄 完整数据流程

### 1. 用户点击"召喚喵助手"按钮

**触发位置**: `extension/popup/popup.js:39-68`

```javascript
async function toggleSoftCat() {
  // 1. 禁用按钮，显示"处理中..."
  toggleBtn.disabled = true;
  toggleBtn.textContent = '处理中...';
  
  // 2. 发送消息到后台脚本
  const response = await sendMessageToBackground({ action: 'toggleSoftCat' });
  
  // 3. 处理响应并更新UI
  if (response.success) {
    showStatus(response.message, 'success');
    await updateUI();
  }
}
```

### 2. 后台脚本处理启动请求

**处理位置**: `extension/background/background.js:12-27, 30-53`

```javascript
// 监听来自弹窗的消息
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'toggleSoftCat') {
    const result = await toggleSoftCat();
    sendResponse(result);
  }
});

async function toggleSoftCat() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (softcatEnabled) {
    // 停止软体猫
    await chrome.tabs.sendMessage(tab.id, { action: 'stopSoftCat' });
    softcatEnabled = false;
    return { success: true, enabled: false, message: '软体猫已停止' };
  } else {
    // 启动软体猫 - 关键步骤
    await injectSoftCat(tab.id);
    softcatEnabled = true;
    return { success: true, enabled: true, message: '软体猫已启动' };
  }
}
```

### 3. 库文件加载流程（关键！）

**执行位置**: `extension/background/background.js:55-212`

#### 3.1 注入库文件加载器
```javascript
function injectLibraryLoader(tabId) {
  return chrome.scripting.executeScript({
    target: { tabId },
    func: function() {
      window.SoftCatLibraryLoader = {
        librariesLoaded: false,
        loadPromise: null,
        
        loadLibraries: function() {
          // 按顺序加载库文件
          // 1. 先加载 p5.js (图形渲染库)
          const p5Script = document.createElement('script');
          p5Script.src = chrome.runtime.getURL('lib/p5.min.js');
          p5Script.onload = function() {
            console.log('p5.js 加载完成');
            onLibraryLoaded();
          };
          document.head.appendChild(p5Script);
          
          // 2. 再加载 Matter.js (物理引擎)
          const matterScript = document.createElement('script');
          matterScript.src = chrome.runtime.getURL('lib/matter.min.js');
          matterScript.onload = function() {
            console.log('Matter.js 加载完成');
            onLibraryLoaded();
          };
          document.head.appendChild(matterScript);
        }
      };
      
      // 立即开始加载
      window.SoftCatLibraryLoader.loadLibraries();
    }
  });
}
```

#### 3.2 等待库文件加载完成
```javascript
function waitForLibrariesLoaded(tabId) {
  return new Promise((resolve, reject) => {
    const checkLibraries = function() {
      chrome.scripting.executeScript({
        target: { tabId },
        func: function() {
          if (window.SoftCatLibraryLoader) {
            return {
              loaded: window.SoftCatLibraryLoader.isLoaded(),
              p5Available: typeof p5 !== 'undefined',
              matterAvailable: typeof Matter !== 'undefined'
            };
          }
          return { loaded: false, p5Available: false, matterAvailable: false };
        }
      }).then(results => {
        const status = results[0].result;
        
        if (status.loaded) {
          console.log('库文件加载完成，可以注入软体猫核心');
          resolve();
        } else {
          // 继续等待
          setTimeout(checkLibraries, 100);
        }
      });
    };
    
    checkLibraries();
  });
}
```

### 4. 注入软体猫核心脚本

**执行位置**: `extension/background/background.js:198-201`

```javascript
// 步骤3: 注入软体猫核心脚本
return chrome.scripting.executeScript({
  target: { tabId },
  files: ['shared/softcat-core.js']
});
```

### 5. 软体猫核心初始化

**执行位置**: `shared/softcat-core.js:4-686`

#### 5.1 等待库文件就绪
```javascript
async waitForLibraries() {
  return new Promise((resolve, reject) => {
        const checkLibraries = () => {
          const p5Loaded = typeof p5 !== 'undefined';
          const matterLoaded = typeof Matter !== 'undefined';
          
          if (p5Loaded && matterLoaded) {
            console.log('所有库文件已加载，开始初始化软体猫');
            resolve();
          } else {
            setTimeout(checkLibraries, 200);
          }
        };
    
    checkLibraries();
  });
}
```

#### 5.2 创建软体猫系统
```javascript
async initSoftCat() {
  // 创建容器
  this.createContainer();
  
  // 初始化p5.js应用
  initP5();
  
  // 初始化Matter.js物理引擎
  initMatter();
  
  // 创建物理对象
  createMachine();        // 洗衣机
  createSoftBody();       // 软体猫
  createTail();           // 尾巴
  createPinConstraints(); // 约束
  
  // 设置渲染循环
  setupRenderLoop();
}
```

### 6. 内容脚本消息处理

**处理位置**: `extension/content/content.js:10-44`

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'toggleDebug':
      if (window.SoftCat && window.SoftCat.toggleDebug) {
        window.SoftCat.toggleDebug();
        sendResponse({ success: true, message: '调试模式已切换' });
      }
      break;
      
    case 'resetCat':
      if (window.SoftCat && window.SoftCat.resetCat) {
        window.SoftCat.resetCat();
        sendResponse({ success: true, message: '软体猫已重置' });
      }
      break;
      
    case 'stopSoftCat':
      if (window.SoftCat && window.SoftCat.stop) {
        window.SoftCat.stop();
        sendResponse({ success: true, message: '软体猫已停止' });
      }
      break;
  }
});
```

## 🎯 关键协作点

### 1. 消息传递机制
- **Popup → Background**: `chrome.runtime.sendMessage()`
- **Background → Content**: `chrome.tabs.sendMessage()`
- **Content → Background**: `chrome.runtime.sendMessage()`

### 2. 库文件加载顺序
```
1. p5.js (图形渲染库)
   ↓
2. Matter.js (物理引擎)
   ↓
3. 软体猫核心脚本
```

### 3. 状态管理
- **Background**: 管理全局软体猫状态 (`softcatEnabled`)
- **Content**: 处理页面级别的软体猫控制
- **Popup**: 显示用户界面和状态反馈

### 4. 错误处理
- 每个脚本都有独立的错误处理机制
- 超时保护（库文件加载最多等待10秒）
- 用户友好的错误提示

## 🔧 主脚本位置

1. **入口脚本**: `extension/popup/popup.js` - 用户交互入口
2. **核心控制器**: `extension/background/background.js` - 扩展核心逻辑
3. **页面处理器**: `extension/content/content.js` - 页面级别处理
4. **软体猫核心**: `shared/softcat-core.js` - 软体猫物理模拟

## 📊 数据流向图

```
用户点击按钮
    ↓
Popup.js (发送消息)
    ↓
Background.js (处理请求)
    ↓
注入库文件加载器
    ↓
加载 p5.js → 加载 Matter.js
    ↓
等待库文件就绪
    ↓
注入 softcat-core.js
    ↓
软体猫初始化
    ↓
创建物理世界和渲染系统
    ↓
软体猫开始运行
```

## ⚠️ 重要注意事项

1. **库文件加载顺序**: 必须先加载p5.js，再加载Matter.js
2. **异步处理**: 所有库文件加载都是异步的，需要等待机制
3. **错误恢复**: 如果库文件加载失败，会显示错误提示
4. **状态同步**: 各脚本之间通过消息传递保持状态同步
5. **资源清理**: 软体猫停止时会清理所有相关资源

这个架构确保了软体猫能够可靠地在任何网页上运行，同时提供了良好的用户体验和错误处理机制。
