// 内联内容脚本 - 直接加载库文件，不依赖复杂的异步机制
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

// 直接加载库文件
function loadLibrariesDirectly() {
  if (!isSuitablePage()) {
    console.log("当前页面不适合运行软体猫");
    return;
  }

  console.log("开始直接加载库文件...");
  
  // 加载 PIXI.js
  const pixiScript = document.createElement('script');
  pixiScript.src = chrome.runtime.getURL('libs/pixi.iife.js');
  pixiScript.onload = () => {
    console.log("PIXI.js 加载完成");
    
    // 加载 Matter.js
    const matterScript = document.createElement('script');
    matterScript.src = chrome.runtime.getURL('libs/matter.iife.js');
    matterScript.onload = () => {
      console.log("Matter.js 加载完成");
      
      // 等待库文件就绪
      const checkInterval = setInterval(() => {
        if (typeof window.PIXI !== 'undefined' && typeof window.Matter !== 'undefined') {
          clearInterval(checkInterval);
          console.log("所有库文件就绪，加载核心逻辑...");
          
          // 加载核心逻辑
          const coreScript = document.createElement('script');
          coreScript.src = chrome.runtime.getURL('shared/softcat-core.js');
          coreScript.onload = () => {
            console.log("软体猫核心逻辑加载完成");
          };
          coreScript.onerror = (error) => {
            console.error("核心逻辑加载失败:", error);
          };
          document.head.appendChild(coreScript);
        }
      }, 50);
      
      // 超时处理
      setTimeout(() => {
        clearInterval(checkInterval);
        console.error("库文件加载超时");
      }, 10000);
    };
    matterScript.onerror = (error) => {
      console.error("Matter.js 加载失败:", error);
    };
    document.head.appendChild(matterScript);
  };
  pixiScript.onerror = (error) => {
    console.error("PIXI.js 加载失败:", error);
  };
  document.head.appendChild(pixiScript);
}

// 监听来自 background 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("内容脚本收到消息:", request);
  
  if (request.action === 'startSoftCat') {
    loadLibrariesDirectly();
    sendResponse({ success: true, message: '软体猫已启动' });
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

// 自动加载（在合适的页面上）
if (isSuitablePage()) {
  console.log("页面适合运行软体猫，开始自动加载...");
  loadLibrariesDirectly();
}
