// extension/content/content.js - 静态注入版本
// 作为content script入口，管理软体猫的启动和停止

console.log('软体猫 Content Script 已加载');

let softcatRunning = false;
let softcatInstance = null;

// 等待页面加载完成
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  console.log('软体猫 Content Script 初始化');
  
  // 监听来自background script的消息
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('收到消息:', request);
    
    switch (request.action) {
      case 'startSoftCat':
        startSoftCat();
        sendResponse({ success: true, message: '软体猫启动命令已接收' });
        break;
        
      case 'stopSoftCat':
        stopSoftCat();
        sendResponse({ success: true, message: '软体猫停止命令已接收' });
        break;
        
      case 'toggleDebug':
        toggleDebug();
        sendResponse({ success: true, message: '调试模式已切换' });
        break;
        
      case 'resetCat':
        resetCat();
        sendResponse({ success: true, message: '软体猫已重置' });
        break;
        
      case 'getStatus':
        sendResponse({ 
          success: true, 
          running: softcatRunning,
          librariesLoaded: checkLibrariesLoaded()
        });
        break;
        
      default:
        sendResponse({ success: false, message: '未知操作' });
    }
    
    return true; // 保持消息通道开放
  });
}

// 检查库文件是否加载完成
function checkLibrariesLoaded() {
  return typeof p5 !== 'undefined' && typeof Matter !== 'undefined';
}

// 启动软体猫
function startSoftCat() {
  if (softcatRunning) {
    console.log('软体猫已在运行中');
    return;
  }
  
  // 检查库文件是否加载完成
  if (!checkLibrariesLoaded()) {
    console.error('库文件未加载完成，无法启动软体猫');
    return;
  }
  
  try {
    console.log('启动软体猫...');
    
    // 检查是否已有软体猫实例
    if (window.SoftCat && typeof window.SoftCat.start === 'function') {
      window.SoftCat.start();
      softcatInstance = window.SoftCat;
      softcatRunning = true;
      console.log('✅ 软体猫启动成功');
    } else {
      console.error('SoftCat 对象未找到或启动函数不存在');
    }
  } catch (error) {
    console.error('启动软体猫失败:', error);
  }
}

// 停止软体猫
function stopSoftCat() {
  if (!softcatRunning) {
    console.log('软体猫未在运行');
    return;
  }
  
  try {
    console.log('停止软体猫...');
    
    if (softcatInstance && typeof softcatInstance.stop === 'function') {
      softcatInstance.stop();
    }
    
    // 清理画布
    const canvas = document.getElementById('softcat-canvas');
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
    
    softcatInstance = null;
    softcatRunning = false;
    console.log('✅ 软体猫已停止');
  } catch (error) {
    console.error('停止软体猫失败:', error);
  }
}

// 切换调试模式
function toggleDebug() {
  if (softcatInstance && typeof softcatInstance.toggleDebug === 'function') {
    softcatInstance.toggleDebug();
    console.log('调试模式已切换');
  } else {
    console.log('软体猫未运行，无法切换调试模式');
  }
}

// 重置软体猫
function resetCat() {
  if (softcatInstance && typeof softcatInstance.reset === 'function') {
    softcatInstance.reset();
    console.log('软体猫已重置');
  } else {
    console.log('软体猫未运行，无法重置');
  }
}

// 错误处理
window.addEventListener('error', (e) => {
  console.error('Content Script 错误:', e.error);
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
  if (softcatRunning) {
    stopSoftCat();
  }
});