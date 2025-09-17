// extension/background/background.js - 修复版本
// 解决库文件加载时序问题，添加详细追踪

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
      // 停止软体猫
      await chrome.tabs.sendMessage(tab.id, { action: 'stopSoftCat' });
      softcatEnabled = false;
      return { success: true, enabled: false, message: '软体猫已停止' };
    } else {
      // 启动软体猫
      await injectSoftCat(tab.id);
      softcatEnabled = true;
      return { success: true, enabled: true, message: '软体猫已启动' };
    }
  } catch (error) {
    console.error('切换软体猫状态失败:', error);
    return { success: false, error: error.message };
  }
}

// 注入软体猫 - 修复版本，确保正确的加载顺序
async function injectSoftCat(tabId) {
  console.log('开始注入软体猫到标签页:', tabId);
  
  try {
    // 步骤1: 注入库文件加载器
    await injectLibraryLoader(tabId);
    
    // 步骤2: 等待库文件加载完成
    await waitForLibrariesLoaded(tabId);
    
    // 步骤3: 注入软体猫核心脚本
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['shared/softcat-core.js']
    });
    
    console.log('软体猫注入完成');
    
  } catch (error) {
    console.error('注入软体猫失败:', error);
    throw error;
  }
}

// 注入库文件加载器 - 使用p5.js替代PIXI.js
async function injectLibraryLoader(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      // 创建库文件加载器
      window.SoftCatLibraryLoader = {
        librariesLoaded: false,
        loadPromise: null,
        loadStartTime: Date.now(),
        
        async loadLibraries() {
          if (this.loadPromise) {
            return this.loadPromise;
          }
          
          this.loadPromise = new Promise((resolve, reject) => {
            let loadedCount = 0;
            const totalLibs = 2;
            const loadTimeouts = {};
            
            function onLibraryLoaded(libName) {
              loadedCount++;
              const loadTime = Date.now() - window.SoftCatLibraryLoader.loadStartTime;
              console.log(`✅ ${libName} 加载完成 (${loadTime}ms) - 进度: ${loadedCount}/${totalLibs}`);
              
              if (loadedCount === totalLibs) {
                console.log('🎉 所有库文件加载完成！');
                window.SoftCatLibraryLoader.librariesLoaded = true;
                resolve();
              }
            }
            
            function onLibraryError(libName, error) {
              console.error(`❌ ${libName} 加载失败:`, error);
              clearTimeout(loadTimeouts[libName]);
              reject(new Error(`${libName} 加载失败: ${error}`));
            }
            
            // 获取库文件URL
            const p5Url = chrome.runtime.getURL('lib/p5.min.js');
            const matterUrl = chrome.runtime.getURL('lib/matter.min.js');
            
            console.log('库文件URL:', { p5Url, matterUrl });
            
            // 加载 p5.js (本地文件)
            const p5Script = document.createElement('script');
            p5Script.src = p5Url;
            p5Script.onload = () => {
              console.log('p5.js 脚本加载完成');
              onLibraryLoaded('p5.js');
            };
            p5Script.onerror = (e) => {
              console.error('p5.js 加载错误:', e);
              onLibraryError('p5.js', '本地文件加载失败');
            };
            document.head.appendChild(p5Script);
            
            // 设置超时
            loadTimeouts['p5.js'] = setTimeout(() => {
              onLibraryError('p5.js', '加载超时');
            }, 10000);
            
            // 加载 Matter.js (本地文件)
            const matterScript = document.createElement('script');
            matterScript.src = matterUrl;
            matterScript.onload = () => {
              console.log('Matter.js 脚本加载完成');
              onLibraryLoaded('Matter.js');
            };
            matterScript.onerror = (e) => {
              console.error('Matter.js 加载错误:', e);
              onLibraryError('Matter.js', '本地文件加载失败');
            };
            document.head.appendChild(matterScript);
            
            // 设置超时
            loadTimeouts['Matter.js'] = setTimeout(() => {
              onLibraryError('Matter.js', '加载超时');
            }, 10000);
          });
          
          return this.loadPromise;
        },
        
        isLoaded() {
          const p5Loaded = typeof p5 !== 'undefined';
          const matterLoaded = typeof Matter !== 'undefined';
          const allLoaded = this.librariesLoaded && p5Loaded && matterLoaded;
          
          console.log('库文件状态检查:', {
            p5Loaded,
            matterLoaded,
            librariesLoaded: this.librariesLoaded,
            allLoaded
          });
          
          return allLoaded;
        },
        
        getLoadTime() {
          return Date.now() - this.loadStartTime;
        }
      };
      
      // 立即开始加载
      window.SoftCatLibraryLoader.loadLibraries().catch(error => {
        console.error('库文件加载失败:', error);
      });
    }
  });
}

// 等待库文件加载完成
async function waitForLibrariesLoaded(tabId) {
  console.log('等待库文件加载完成...');
  
  const maxWaitTime = 15000; // 最大等待时间 15秒
  const checkInterval = 200;  // 检查间隔 200ms
  let waitTime = 0;
  
  return new Promise((resolve, reject) => {
    const checkLibraries = async () => {
      try {
        const [result] = await chrome.scripting.executeScript({
          target: { tabId },
          func: () => {
            if (window.SoftCatLibraryLoader) {
              return {
                loaded: window.SoftCatLibraryLoader.isLoaded(),
                p5Available: typeof p5 !== 'undefined',
                matterAvailable: typeof Matter !== 'undefined',
                loadTime: window.SoftCatLibraryLoader.getLoadTime()
              };
            }
            return { 
              loaded: false, 
              p5Available: false, 
              matterAvailable: false,
              loadTime: 0
            };
          }
        });
        
        const status = result.result;
        console.log(`库文件状态检查 (${waitTime}ms):`, status);
        
        if (status.loaded) {
          console.log(`✅ 库文件加载完成！总耗时: ${status.loadTime}ms`);
          resolve();
          return;
        }
        
        waitTime += checkInterval;
        if (waitTime >= maxWaitTime) {
          console.error('❌ 库文件加载超时');
          reject(new Error(`库文件加载超时 (${maxWaitTime}ms) - p5.js: ${status.p5Available}, Matter.js: ${status.matterAvailable}`));
          return;
        }
        
        setTimeout(checkLibraries, checkInterval);
        
      } catch (error) {
        console.error('检查库文件状态失败:', error);
        reject(error);
      }
    };
    
    checkLibraries();
  });
}

// 处理标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && softcatEnabled) {
    // 页面刷新后重新注入
    setTimeout(() => {
      injectSoftCat(tabId).catch(console.error);
    }, 1000);
  }
});

// 处理标签页激活
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  // 可以在这里添加标签页切换时的逻辑
});