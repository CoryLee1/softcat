// Background Script - 软体猫桌宠扩展后台服务
console.log('软体猫桌宠扩展已启动');

// 扩展安装时的初始化
chrome.runtime.onInstalled.addListener((details) => {
  console.log('扩展安装/更新:', details.reason);
  
  // 设置默认配置
  chrome.storage.sync.set({
    catEnabled: true,
    catPosition: { x: 0.5, y: 0.65 }, // 相对位置
    catSize: 1.0,
    physicsEnabled: true,
    debugMode: false
  });
});

// 处理来自popup和content script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('收到消息:', request);
  
  switch (request.action) {
    case 'toggleCat':
      // 如果请求来自popup，使用指定的tabId
      const tabId = request.tabId || sender.tab?.id;
      if (tabId) {
        toggleCatInTab(tabId);
        sendResponse({ success: true });
      } else {
        sendResponse({ error: '无法获取标签页ID' });
      }
      break;
      
    case 'getCatStatus':
      // 如果请求来自popup，使用指定的tabId
      const statusTabId = request.tabId || sender.tab?.id;
      if (statusTabId) {
        getCatStatus(statusTabId).then(status => {
          sendResponse({ status });
        });
        return true; // 保持消息通道开放
      } else {
        sendResponse({ status: { enabled: false, visible: false } });
      }
      break;
      
    case 'updateCatSettings':
      updateCatSettings(request.settings);
      sendResponse({ success: true });
      break;
      
    case 'injectCat':
      const injectTabId = request.tabId || sender.tab?.id;
      if (injectTabId) {
        injectCatToTab(injectTabId);
        sendResponse({ success: true });
      } else {
        sendResponse({ error: '无法获取标签页ID' });
      }
      break;
      
    default:
      sendResponse({ error: '未知操作' });
  }
});

// 切换指定标签页的软体猫显示
async function toggleCatInTab(tabId) {
  try {
    // 先检查软体猫是否已存在
    const statusResult = await chrome.scripting.executeScript({
      target: { tabId },
      function: getCatDisplayStatus
    });
    
    const isEnabled = statusResult[0]?.result?.enabled || false;
    
    if (isEnabled) {
      // 如果已启用，则移除软体猫
      await chrome.scripting.executeScript({
        target: { tabId },
        function: removeSoftCat
      });
      console.log('软体猫已移除');
    } else {
      // 如果未启用，则注入软体猫
      await injectCatToTab(tabId);
      console.log('软体猫已注入');
    }
  } catch (error) {
    console.error('切换软体猫失败:', error);
  }
}

// 获取指定标签页的软体猫状态
async function getCatStatus(tabId) {
  try {
    const result = await chrome.scripting.executeScript({
      target: { tabId },
      function: getCatDisplayStatus
    });
    return result[0]?.result || { enabled: false };
  } catch (error) {
    console.error('获取软体猫状态失败:', error);
    return { enabled: false };
  }
}

// 更新软体猫设置
async function updateCatSettings(settings) {
  await chrome.storage.sync.set(settings);
  console.log('软体猫设置已更新:', settings);
}

// 向指定标签页注入软体猫
async function injectCatToTab(tabId) {
  try {
    // 先注入库文件
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['lib/pixi.min.js']
    });
    
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['lib/matter.min.js']
    });
    
    // 等待库文件加载完成并验证
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 验证库文件是否已加载
    const libraryCheck = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        return {
          pixiLoaded: typeof PIXI !== 'undefined',
          matterLoaded: typeof Matter !== 'undefined'
        };
      }
    });
    
    const { pixiLoaded, matterLoaded } = libraryCheck[0].result;
    console.log('库文件加载状态:', { pixiLoaded, matterLoaded });
    
    if (!pixiLoaded || !matterLoaded) {
      console.error('库文件未正确加载，等待更长时间...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // 然后注入软体猫核心脚本
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['shared/softcat-core.js']
    });
    
    console.log('软体猫已注入到标签页:', tabId);
  } catch (error) {
    console.error('注入软体猫失败:', error);
  }
}

// 在页面中执行的函数 - 切换软体猫显示
function toggleCatDisplay() {
  const catContainer = document.getElementById('softcat-container');
  if (catContainer) {
    catContainer.style.display = catContainer.style.display === 'none' ? 'block' : 'none';
    return { success: true, visible: catContainer.style.display !== 'none' };
  } else {
    // 如果软体猫容器不存在，创建它
    createSoftCatContainer();
    return { success: true, visible: true };
  }
}

// 在页面中执行的函数 - 获取软体猫显示状态
function getCatDisplayStatus() {
  const catContainer = document.getElementById('softcat-container');
  return {
    enabled: !!catContainer,
    visible: catContainer ? catContainer.style.display !== 'none' : false
  };
}

// 在页面中执行的函数 - 创建软体猫容器
function createSoftCatContainer() {
  // 这个函数会在content script中实现
  console.log('创建软体猫容器');
}

// 在页面中执行的函数 - 移除软体猫
function removeSoftCat() {
  const container = document.getElementById('softcat-container');
  if (container) {
    container.remove();
    console.log('软体猫容器已移除');
    return { success: true };
  }
  return { success: false, message: '软体猫容器不存在' };
}
