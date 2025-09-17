// 内容脚本 - 负责注入库文件和核心逻辑

console.log('软体猫内容脚本已加载');

// 通用注入函数
function inject(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(path);
    script.onload = () => {
      script.remove();
      resolve();
    };
    script.onerror = () => {
      script.remove();
      reject(new Error(`Failed to load ${path}`));
    };
    (document.head || document.documentElement).appendChild(script);
  });
}

// 等待全局库加载完成
function waitForGlobals(): Promise<void> {
  return new Promise((resolve, reject) => {
    const checkInterval = setInterval(() => {
      if (typeof (window as any).PIXI !== 'undefined' && typeof (window as any).Matter !== 'undefined') {
        clearInterval(checkInterval);
        console.log('所有库文件已加载完成');
        resolve();
      }
    }, 20);
    
    // 10秒超时
    setTimeout(() => {
      clearInterval(checkInterval);
      reject(new Error('PIXI/Matter not loaded within timeout'));
    }, 10000);
  });
}

// 主初始化函数
async function initializeSoftCat() {
  try {
    console.log('开始注入库文件...');
    
    // 先注入PIXI.js
    await inject('libs/pixi.iife.js');
    console.log('PIXI.js 注入完成');
    
    // 再注入Matter.js
    await inject('libs/matter.iife.js');
    console.log('Matter.js 注入完成');
    
    // 等待全局库就绪
    await waitForGlobals();
    
    // 最后注入核心逻辑
    await inject('shared/softcat-core.js');
    console.log('软体猫核心逻辑注入完成');
    
  } catch (error) {
    console.error('软体猫初始化失败:', error);
  }
}

// 监听来自popup和background的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('内容脚本收到消息:', request);
  
  try {
    switch (request.action) {
      case 'toggleDebug':
        if ((window as any).SoftCat && (window as any).SoftCat.toggleDebug) {
          (window as any).SoftCat.toggleDebug();
          sendResponse({ success: true, message: '调试模式已切换' });
        } else {
          sendResponse({ success: false, error: '软体猫未加载' });
        }
        break;
        
      case 'resetCat':
        if ((window as any).SoftCat && (window as any).SoftCat.resetCat) {
          (window as any).SoftCat.resetCat();
          sendResponse({ success: true, message: '软体猫已重置' });
        } else {
          sendResponse({ success: false, error: '软体猫未加载' });
        }
        break;
        
      case 'stopSoftCat':
        if ((window as any).SoftCat && (window as any).SoftCat.stop) {
          (window as any).SoftCat.stop();
          sendResponse({ success: true, message: '软体猫已停止' });
        } else {
          sendResponse({ success: false, error: '软体猫未运行' });
        }
        break;
        
      case 'getSoftCatStatus':
        if ((window as any).SoftCat && (window as any).SoftCat.getStatus) {
          const status = (window as any).SoftCat.getStatus();
          sendResponse(status);
        } else {
          sendResponse({
            loaded: !!(window as any).SoftCatLoaded,
            running: false,
            debugMode: false,
            error: '软体猫未加载'
          });
        }
        break;
        
      case 'test':
        sendResponse({ status: 'content script working', url: window.location.href });
        break;
        
      default:
        sendResponse({ error: 'Unknown action: ' + request.action });
    }
  } catch (error) {
    console.error('内容脚本处理消息失败:', error);
    sendResponse({ error: error.message });
  }
  
  return true; // 保持消息通道开放
});

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSoftCat);
} else {
  initializeSoftCat();
}
