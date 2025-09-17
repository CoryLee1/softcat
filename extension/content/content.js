// extension/content/content.js - 修复版本
// 处理页面级别的消息通信

(function() {
  'use strict';
  
  console.log('软体猫内容脚本已加载');
  
  // 监听来自弹窗和后台脚本的消息
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('内容脚本收到消息:', request);
    
    try {
      switch (request.action) {
        case 'toggleDebug':
          handleToggleDebug(sendResponse);
          break;
          
        case 'resetCat':
          handleResetCat(sendResponse);
          break;
          
        case 'stopSoftCat':
          handleStopSoftCat(sendResponse);
          break;
          
        case 'getSoftCatStatus':
          handleGetStatus(sendResponse);
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
  
  // 处理调试模式切换
  function handleToggleDebug(sendResponse) {
    if (window.SoftCat && window.SoftCat.toggleDebug) {
      window.SoftCat.toggleDebug();
      sendResponse({ success: true, message: '调试模式已切换' });
    } else {
      sendResponse({ success: false, error: '软体猫未加载' });
    }
  }
  
  // 处理重置软体猫
  function handleResetCat(sendResponse) {
    if (window.SoftCat && window.SoftCat.resetCat) {
      window.SoftCat.resetCat();
      sendResponse({ success: true, message: '软体猫已重置' });
    } else {
      sendResponse({ success: false, error: '软体猫未加载' });
    }
  }
  
  // 处理停止软体猫
  function handleStopSoftCat(sendResponse) {
    if (window.SoftCat && window.SoftCat.stop) {
      window.SoftCat.stop();
      sendResponse({ success: true, message: '软体猫已停止' });
    } else {
      sendResponse({ success: false, error: '软体猫未运行' });
    }
  }
  
  // 获取软体猫状态
  function handleGetStatus(sendResponse) {
    if (window.SoftCat && window.SoftCat.getStatus) {
      const status = window.SoftCat.getStatus();
      sendResponse(status);
    } else {
      sendResponse({
        loaded: !!window.SoftCatLoaded,
        running: false,
        debugMode: false,
        error: '软体猫未加载'
      });
    }
  }
  
  // 监听页面变化，确保软体猫状态同步
  let lastUrl = window.location.href;
  const observer = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      console.log('页面URL发生变化，重新检查软体猫状态');
      
      // 通知后台脚本页面已变化
      chrome.runtime.sendMessage({
        action: 'pageChanged',
        url: window.location.href
      }).catch(error => {
        console.log('发送页面变化消息失败:', error);
      });
    }
  });
  
  observer.observe(document, {
    subtree: true,
    childList: true
  });
  
  // 页面卸载时清理
  window.addEventListener('beforeunload', () => {
    observer.disconnect();
    
    if (window.SoftCat && window.SoftCat.stop) {
      window.SoftCat.stop();
    }
  });
  
  // 定期向后台报告状态
  setInterval(() => {
    if (window.SoftCat && window.SoftCat.getStatus) {
      const status = window.SoftCat.getStatus();
      
      // 只在状态变化时报告
      if (window.lastReportedStatus !== JSON.stringify(status)) {
        chrome.runtime.sendMessage({
          action: 'statusReport',
          status: status
        }).catch(error => {
          // 忽略连接错误，这很正常
        });
        
        window.lastReportedStatus = JSON.stringify(status);
      }
    }
  }, 5000); // 每5秒检查一次
  
})();