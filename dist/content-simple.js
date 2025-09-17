// 简化的内容脚本 - 参考 TabPet 的方法
console.log("软体猫内容脚本已加载");

// 检查是否在合适的页面上运行
function isSuitablePage() {
  const url = window.location.href;
  // 排除特殊页面
  if (url.startsWith('chrome://') || 
      url.startsWith('chrome-extension://') || 
      url.startsWith('moz-extension://') ||
      url.startsWith('edge://') ||
      url.startsWith('about:')) {
    return false;
  }
  return true;
}

// 简化的库文件加载
async function loadLibraries() {
  if (!isSuitablePage()) {
    console.log("当前页面不适合运行软体猫");
    return false;
  }

  try {
    console.log("开始加载库文件...");
    
    // 加载 PIXI.js
    const pixiScript = document.createElement('script');
    pixiScript.src = chrome.runtime.getURL('libs/pixi.iife.js');
    await new Promise((resolve, reject) => {
      pixiScript.onload = resolve;
      pixiScript.onerror = reject;
      document.head.appendChild(pixiScript);
    });
    console.log("PIXI.js 加载完成");

    // 加载 Matter.js
    const matterScript = document.createElement('script');
    matterScript.src = chrome.runtime.getURL('libs/matter.iife.js');
    await new Promise((resolve, reject) => {
      matterScript.onload = resolve;
      matterScript.onerror = reject;
      document.head.appendChild(matterScript);
    });
    console.log("Matter.js 加载完成");

    // 等待库文件就绪
    await new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (typeof window.PIXI !== 'undefined' && typeof window.Matter !== 'undefined') {
          clearInterval(checkInterval);
          resolve();
        }
      }, 50);
    });

    // 加载核心逻辑
    const coreScript = document.createElement('script');
    coreScript.src = chrome.runtime.getURL('shared/softcat-core.js');
    await new Promise((resolve, reject) => {
      coreScript.onload = resolve;
      coreScript.onerror = reject;
      document.head.appendChild(coreScript);
    });
    console.log("软体猫核心逻辑加载完成");

    return true;
  } catch (error) {
    console.error("库文件加载失败:", error);
    return false;
  }
}

// 监听来自 background 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("内容脚本收到消息:", request);
  
  if (request.action === 'startSoftCat') {
    loadLibraries().then(success => {
      if (success) {
        sendResponse({ success: true, message: '软体猫已启动' });
      } else {
        sendResponse({ success: false, message: '库文件加载失败' });
      }
    });
    return true; // 保持消息通道开放
  }
  
  if (request.action === 'stopSoftCat') {
    if (window.SoftCat && window.SoftCat.stop) {
      window.SoftCat.stop();
      sendResponse({ success: true, message: '软体猫已停止' });
    } else {
      sendResponse({ success: false, message: '软体猫未运行' });
    }
  }
  
  if (request.action === 'getSoftCatStatus') {
    const status = {
      loaded: typeof window.SoftCat !== 'undefined',
      running: window.SoftCat && window.SoftCat.isRunning ? window.SoftCat.isRunning() : false,
      pixiAvailable: typeof window.PIXI !== 'undefined',
      matterAvailable: typeof window.Matter !== 'undefined'
    };
    sendResponse(status);
  }
  
  return true;
});

// 自动加载（可选）
if (isSuitablePage()) {
  console.log("页面适合运行软体猫，开始自动加载...");
  loadLibraries();
}
