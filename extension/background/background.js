// extension/background/background.js - 静态注入版本
// 简化版本，使用content_scripts静态注入

let softcatEnabled = false;

// 监听扩展安装
chrome.runtime.onInstalled.addListener(() => {
  console.log('软体猫扩展已安装');
});

// 监听来自弹窗的消息
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  try {
    if (request.action === 'toggleSoftCat') {
      const result = await toggleSoftCat();
      sendResponse(result);
    } else if (request.action === 'getSoftCatStatus') {
      sendResponse({ enabled: softcatEnabled });
    } else if (request.action === 'test') {
      sendResponse({ status: 'background script working' });
    }
  } catch (error) {
    console.error('Background script error:', error);
    sendResponse({ error: error.message });
  }
  return true; // 保持消息通道开放
});

// 切换软体猫状态
async function toggleSoftCat() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      throw new Error('无法获取当前标签页');
    }

    if (softcatEnabled) {
      // 停止软体猫 - 发送消息给content script
      await chrome.tabs.sendMessage(tab.id, { action: 'stopSoftCat' });
      softcatEnabled = false;
      return { success: true, enabled: false, message: '软体猫已停止' };
    } else {
      // 启动软体猫 - 发送消息给content script
      await chrome.tabs.sendMessage(tab.id, { action: 'startSoftCat' });
      softcatEnabled = true;
      return { success: true, enabled: true, message: '软体猫已启动' };
    }
  } catch (error) {
    console.error('切换软体猫状态失败:', error);
    return { success: false, error: error.message };
  }
}

// 处理标签页更新
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && softcatEnabled) {
    // 页面刷新后重新启动软体猫
    setTimeout(function() {
      chrome.tabs.sendMessage(tabId, { action: 'startSoftCat' }).catch(function(error) {
        console.error('重新启动软体猫失败:', error);
      });
    }, 500);
  }
});

// 处理标签页激活
chrome.tabs.onActivated.addListener(function(activeInfo) {
  if (softcatEnabled) {
    // 切换标签页后检查是否需要启动软体猫
    chrome.tabs.sendMessage(activeInfo.tabId, { action: 'startSoftCat' }).catch(function(error) {
      console.error('启动软体猫失败:', error);
    });
  }
});