// 简化的background.js - 参考TabPet的成功经验
console.log('软体猫扩展已安装');

let softcatEnabled = false;

// 监听扩展安装
chrome.runtime.onInstalled.addListener(() => {
  console.log('软体猫扩展已安装');
});

// 监听来自弹窗的消息
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log('Background收到消息:', request);
  
  try {
    if (request.action === 'toggleSoftCat') {
      const result = await toggleSoftCat();
      sendResponse(result);
    } else if (request.action === 'getSoftCatStatus') {
      sendResponse({ 
        enabled: softcatEnabled,
        loaded: true,
        running: softcatEnabled
      });
    } else if (request.action === 'test') {
      sendResponse({ status: 'background script working' });
    }
  } catch (error) {
    console.error('Background script error:', error);
    sendResponse({ error: error.message });
  }
  return true; // 保持消息通道开放
});

// 简化的切换软体猫状态
async function toggleSoftCat() {
  try {
    console.log('切换软体猫状态，当前状态:', softcatEnabled);
    
    if (softcatEnabled) {
      // 停止软体猫
      softcatEnabled = false;
      console.log('软体猫已停止');
      return { success: true, enabled: false, message: '软体猫已停止' };
    } else {
      // 启动软体猫 - 让内容脚本处理库文件加载
      softcatEnabled = true;
      console.log('软体猫已启动');
      return { success: true, enabled: true, message: '软体猫已启动' };
    }
  } catch (error) {
    console.error('切换软体猫状态失败:', error);
    return { success: false, error: error.message };
  }
}

// 处理标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    console.log('页面刷新，软体猫状态:', softcatEnabled);
  }
});

// 处理标签页激活
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log('标签页激活，软体猫状态:', softcatEnabled);
});
