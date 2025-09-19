// extension/background/background.js - 修复版本
// 改进状态管理和错误处理

console.log('🔧 [BACKGROUND] 软体猫后台脚本已加载');
console.log('🚀 [BACKGROUND] 后台脚本正在运行，时间:', new Date().toISOString());

// 暂时移除数据库导入，使用chrome.storage.local
// importScripts('./database.js');

class SoftCatBackgroundManager {
  constructor() {
    this.tabStates = new Map(); // 存储每个标签页的状态
    this.globalEnabled = false;
    // this.database = new SoftCatDatabase(); // 暂时移除数据库
    
    this.init();
  }

  // 初始化
  init() {
    console.log('🔄 [BACKGROUND] 后台管理器初始化');
    
    // 监听扩展安装
    chrome.runtime.onInstalled.addListener(this.handleInstalled.bind(this));
    
    // 监听消息
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    
    // 监听标签页事件
    chrome.tabs.onUpdated.addListener(this.handleTabUpdated.bind(this));
    chrome.tabs.onActivated.addListener(this.handleTabActivated.bind(this));
    chrome.tabs.onRemoved.addListener(this.handleTabRemoved.bind(this));
    
    // 从存储中恢复状态
    this.restoreState();
  }

  // 处理扩展安装
  handleInstalled(details) {
    console.log('🎉 [BACKGROUND] 软体猫扩展已安装/更新:', details.reason);
    
    if (details.reason === 'install') {
      // 首次安装，设置默认状态
      this.saveState();
    }
  }

  // 处理消息
  handleMessage(request, sender, sendResponse) {
    console.log('📨 [BACKGROUND] 收到消息:', request, '来自:', sender);
    
    // 异步处理消息
    this.processMessage(request, sender).then(response => {
      console.log('📤 [BACKGROUND] 发送响应:', response);
      sendResponse(response);
    }).catch(error => {
      console.error('❌ [BACKGROUND] 消息处理错误:', error);
      sendResponse({
        success: false,
        error: error.message,
        action: request.action
      });
    });
    
    return true; // 保持消息通道开放
  }

  // 处理消息的核心逻辑
  async processMessage(request, sender) {
    console.log('📨 [BACKGROUND] 处理消息:', request.action, '来自:', sender);
    
    switch (request.action) {
      case 'toggleSoftCat':
        return await this.toggleSoftCat(sender.tab);
        
      case 'getSoftCatStatus':
        return await this.getSoftCatStatus(sender.tab);
        
      case 'collectAllTabs':
        console.log('📋 [BACKGROUND] 收到一键收Tab请求');
        return await this.collectAllTabs();
        
      case 'openLaundryRoom':
        console.log('🏠 [BACKGROUND] 收到打开洗衣房请求');
        return await this.openLaundryRoom();
        
      case 'getDatabaseTabs':
        return await this.getDatabaseTabs();
        
      case 'getLatestCollection':
        return await this.getLatestCollection();
        
      case 'test':
        return { status: 'background script working', timestamp: Date.now() };
        
      default:
        console.error('❌ [BACKGROUND] 未知操作:', request.action);
        throw new Error(`未知操作: ${request.action}`);
    }
  }

  // 切换软体猫状态
  async toggleSoftCat(tab) {
    console.log('🔄 [BACKGROUND] 切换软体猫状态，标签页:', tab?.id);
    
    try {
      // 获取当前活动标签页（如果没有提供）
      if (!tab) {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        tab = activeTab;
      }
      
      if (!tab) {
        throw new Error('无法获取当前标签页');
      }
      
      // 检查标签页是否支持内容脚本
      if (!this.isValidTab(tab)) {
        throw new Error('当前页面不支持软体猫（chrome://、moz-extension:// 等系统页面）');
      }
      
      // 获取当前标签页状态
      const currentStatus = await this.getTabStatus(tab.id);
      const isCurrentlyRunning = currentStatus.running;
      
      console.log(`🎯 [BACKGROUND] 标签页 ${tab.id} 当前状态:`, currentStatus);
      
      let response;
      
      if (isCurrentlyRunning) {
        // 停止软体猫
        response = await this.stopSoftCatInTab(tab.id);
      } else {
        // 启动软体猫
        response = await this.startSoftCatInTab(tab.id);
      }
      
      // 更新全局状态
      this.updateGlobalState();
      
      // 保存状态
      this.saveState();
      
      return response;
      
    } catch (error) {
      console.error('❌ [BACKGROUND] 切换软体猫失败:', error);
      return {
        success: false,
        error: error.message,
        details: {
          tabId: tab?.id,
          tabUrl: tab?.url
        }
      };
    }
  }

  // 在标签页中启动软体猫
  async startSoftCatInTab(tabId) {
    console.log(`🚀 [BACKGROUND] 在标签页 ${tabId} 中启动软体猫`);
    
    try {
      // 发送启动消息
      const response = await this.sendMessageToTab(tabId, { action: 'startSoftCat' });
      
      if (response.success) {
        // 更新标签页状态
        this.setTabState(tabId, {
          enabled: true,
          running: true,
          lastStarted: Date.now()
        });
        
        return {
          success: true,
          enabled: true,
          message: '软体猫已启动',
          tabId: tabId
        };
      } else {
        throw new Error(response.error || '启动失败');
      }
      
    } catch (error) {
      console.error(`❌ [BACKGROUND] 在标签页 ${tabId} 启动软体猫失败:`, error);
      
      // 更新状态为失败
      this.setTabState(tabId, {
        enabled: false,
        running: false,
        lastError: error.message
      });
      
      return {
        success: false,
        enabled: false,
        error: error.message,
        tabId: tabId
      };
    }
  }

  // 在标签页中停止软体猫
  async stopSoftCatInTab(tabId) {
    console.log(`⏹️ [BACKGROUND] 在标签页 ${tabId} 中停止软体猫`);
    
    try {
      // 发送停止消息
      const response = await this.sendMessageToTab(tabId, { action: 'stopSoftCat' });
      
      if (response.success) {
        // 更新标签页状态
        this.setTabState(tabId, {
          enabled: false,
          running: false,
          lastStopped: Date.now()
        });
        
        return {
          success: true,
          enabled: false,
          message: '软体猫已停止',
          tabId: tabId
        };
      } else {
        throw new Error(response.error || '停止失败');
      }
      
    } catch (error) {
      console.error(`❌ [BACKGROUND] 在标签页 ${tabId} 停止软体猫失败:`, error);
      
      // 即使停止失败，也标记为未运行
      this.setTabState(tabId, {
        enabled: false,
        running: false,
        lastError: error.message
      });
      
      return {
        success: true, // 停止操作总是返回成功
        enabled: false,
        message: '软体猫已停止（可能存在错误）',
        error: error.message,
        tabId: tabId
      };
    }
  }

  // 获取软体猫状态
  async getSoftCatStatus(tab) {
    try {
      // 获取当前活动标签页（如果没有提供）
      if (!tab) {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        tab = activeTab;
      }
      
      if (!tab) {
        return {
          success: false,
          error: '无法获取当前标签页'
        };
      }
      
      const tabStatus = await this.getTabStatus(tab.id);
      
      return {
        success: true,
        enabled: tabStatus.running,
        tabId: tab.id,
        tabUrl: tab.url,
        globalEnabled: this.globalEnabled,
        ...tabStatus
      };
      
    } catch (error) {
      console.error('❌ [BACKGROUND] 获取状态失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 获取标签页状态
  async getTabStatus(tabId) {
    try {
      // 尝试从内容脚本获取实时状态
      const response = await this.sendMessageToTab(tabId, { action: 'getStatus' }, 2000);
      
      if (response.success) {
        // 更新缓存状态
        this.setTabState(tabId, {
          running: response.running,
          loaded: response.loaded,
          lastChecked: Date.now()
        });
        
        return response;
      } else {
        throw new Error(response.error || '获取状态失败');
      }
      
    } catch (error) {
      console.warn(`⚠️ [BACKGROUND] 无法获取标签页 ${tabId} 的实时状态:`, error.message);
      
      // 返回缓存状态
      const cachedState = this.tabStates.get(tabId) || {
        running: false,
        loaded: false,
        enabled: false
      };
      
      return {
        success: true,
        ...cachedState,
        fromCache: true
      };
    }
  }

  // 处理标签页更新
  handleTabUpdated(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      console.log(`🔄 [BACKGROUND] 标签页 ${tabId} 加载完成`);
      
      // 延迟检查是否需要重新启动软体猫
      setTimeout(async () => {
        const tabState = this.tabStates.get(tabId);
        
        if (tabState && tabState.enabled && this.isValidTab(tab)) {
          console.log(`🔄 [BACKGROUND] 在刷新的标签页 ${tabId} 中重新启动软体猫`);
          
          try {
            await this.startSoftCatInTab(tabId);
          } catch (error) {
            console.error(`❌ [BACKGROUND] 重新启动软体猫失败:`, error);
          }
        }
      }, 1000);
    }
  }

  // 处理标签页激活
  handleTabActivated(activeInfo) {
    console.log(`🎯 [BACKGROUND] 标签页 ${activeInfo.tabId} 被激活`);
    
    // 这里可以添加标签页切换时的逻辑
    // 比如更新扩展图标状态等
  }

  // 处理标签页移除
  handleTabRemoved(tabId, removeInfo) {
    console.log(`🗑️ [BACKGROUND] 标签页 ${tabId} 被移除`);
    
    // 清理标签页状态
    if (this.tabStates.has(tabId)) {
      this.tabStates.delete(tabId);
      this.updateGlobalState();
      this.saveState();
    }
  }

  // 辅助方法
  isValidTab(tab) {
    if (!tab || !tab.url) return false;
    
    const invalidPrefixes = [
      'chrome://',
      'chrome-extension://',
      'moz-extension://',
      'edge://',
      'about:',
      'data:',
      'file://'
    ];
    
    return !invalidPrefixes.some(prefix => tab.url.startsWith(prefix));
  }

  async sendMessageToTab(tabId, message, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('消息发送超时'));
      }, timeout);
      
      chrome.tabs.sendMessage(tabId, message, (response) => {
        clearTimeout(timer);
        
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response || { success: false, error: '无响应' });
        }
      });
    });
  }

  setTabState(tabId, state) {
    const currentState = this.tabStates.get(tabId) || {};
    const newState = { ...currentState, ...state, lastUpdated: Date.now() };
    
    this.tabStates.set(tabId, newState);
    console.log(`📊 [BACKGROUND] 标签页 ${tabId} 状态已更新:`, newState);
  }

  updateGlobalState() {
    // 检查是否有任何标签页在运行软体猫
    const hasRunningTabs = Array.from(this.tabStates.values()).some(state => state.running);
    this.globalEnabled = hasRunningTabs;
    
    console.log(`🌐 [BACKGROUND] 全局状态已更新: ${this.globalEnabled ? '启用' : '禁用'}`);
  }

  // 状态持久化
  async saveState() {
    try {
      const stateData = {
        globalEnabled: this.globalEnabled,
        tabStates: Object.fromEntries(this.tabStates),
        lastSaved: Date.now()
      };
      
      await chrome.storage.local.set({ softcatState: stateData });
      console.log('💾 [BACKGROUND] 状态已保存');
      
    } catch (error) {
      console.error('❌ [BACKGROUND] 保存状态失败:', error);
    }
  }

  async restoreState() {
    try {
      const result = await chrome.storage.local.get('softcatState');
      
      if (result.softcatState) {
        const stateData = result.softcatState;
        this.globalEnabled = stateData.globalEnabled || false;
        this.tabStates = new Map(Object.entries(stateData.tabStates || {}));
        
        console.log('📂 [BACKGROUND] 状态已恢复:', {
          globalEnabled: this.globalEnabled,
          tabCount: this.tabStates.size
        });
      }
      
    } catch (error) {
      console.error('❌ [BACKGROUND] 恢复状态失败:', error);
    }
  }

  // 一键收Tab功能 - 收集并关闭其他标签页，打开洗衣房
  async collectAllTabs() {
    try {
      console.log('📋 [BACKGROUND] 开始一键收Tab...');
      
      // 获取所有标签页
      const tabs = await chrome.tabs.query({});
      console.log(`📊 [BACKGROUND] 找到 ${tabs.length} 个标签页`);
      
      const tabData = tabs.map(tab => ({
        id: tab.id,
        url: tab.url,
        title: tab.title,
        favIconUrl: tab.favIconUrl,
        windowId: tab.windowId,
        active: tab.active,
        pinned: tab.pinned,
        audible: tab.audible,
        mutedInfo: tab.mutedInfo,
        lastAccessed: tab.lastAccessed || Date.now()
      }));
      
      // 保存到chrome.storage.local
      const collectionData = {
        id: Date.now().toString(),
        name: '一键收Tab',
        tabs: tabData,
        createdAt: new Date().toISOString(),
        count: tabData.length
      };
      
      await chrome.storage.local.set({
        'latestCollection': collectionData
      });
      
      console.log(`💾 [BACKGROUND] 已保存到chrome.storage.local`);
      
      // 关闭除当前标签页外的所有标签页
      const currentTab = tabs.find(tab => tab.active);
      const tabsToClose = tabs.filter(tab => tab.id !== currentTab.id);
      
      if (tabsToClose.length > 0) {
        const tabIds = tabsToClose.map(tab => tab.id);
        await chrome.tabs.remove(tabIds);
        console.log(`🗑️ [BACKGROUND] 已关闭 ${tabsToClose.length} 个标签页`);
      }
      
      // 打开洗衣房页面
      const laundryRoomUrl = chrome.runtime.getURL('laundry-room.html');
      await chrome.tabs.create({
        url: laundryRoomUrl,
        active: true
      });
      
      console.log('🏠 [BACKGROUND] 已打开洗衣房页面');
      
      return {
        success: true,
        tabs: tabData,
        count: tabData.length,
        closedCount: tabsToClose.length,
        savedCount: tabData.length,
        collectionId: collectionData.id,
        timestamp: Date.now()
      };
      
    } catch (error) {
      console.error('❌ [BACKGROUND] 一键收Tab失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 打开洗衣房
  async openLaundryRoom() {
    try {
      console.log('🏠 [BACKGROUND] 打开洗衣房...');
      
      // 创建洗衣房页面
      const laundryRoomUrl = chrome.runtime.getURL('laundry-room.html');
      console.log('🔗 [BACKGROUND] 洗衣房URL:', laundryRoomUrl);
      
      const tab = await chrome.tabs.create({
        url: laundryRoomUrl,
        active: true
      });
      
      console.log('✅ [BACKGROUND] 洗衣房已打开，标签页ID:', tab.id);
      
      return {
        success: true,
        tabId: tab.id,
        url: laundryRoomUrl
      };
      
    } catch (error) {
      console.error('❌ [BACKGROUND] 打开洗衣房失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 获取存储的标签页
  async getDatabaseTabs() {
    try {
      const result = await chrome.storage.local.get(['latestCollection']);
      const collection = result.latestCollection;
      
      if (collection && collection.tabs) {
        return {
          success: true,
          tabs: collection.tabs,
          count: collection.tabs.length
        };
      } else {
        return {
          success: true,
          tabs: [],
          count: 0
        };
      }
    } catch (error) {
      console.error('❌ [BACKGROUND] 获取存储标签页失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 获取最新收集记录
  async getLatestCollection() {
    try {
      const result = await chrome.storage.local.get(['latestCollection']);
      const collection = result.latestCollection;
      
      if (collection) {
        return {
          success: true,
          collection: collection,
          tabs: collection.tabs || [],
          count: collection.tabs ? collection.tabs.length : 0
        };
      } else {
        return {
          success: true,
          collection: null,
          tabs: [],
          count: 0
        };
      }
    } catch (error) {
      console.error('❌ [BACKGROUND] 获取最新收集记录失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 调试方法
  getDebugInfo() {
    return {
      globalEnabled: this.globalEnabled,
      tabStates: Object.fromEntries(this.tabStates),
      timestamp: Date.now()
    };
  }
}

// 创建后台管理器实例
const backgroundManager = new SoftCatBackgroundManager();

// 暴露给调试用
if (typeof globalThis !== 'undefined') {
  globalThis.SoftCatBackgroundManager = backgroundManager;
}

// 错误处理
self.addEventListener('error', (event) => {
  console.error('❌ [BACKGROUND] 后台脚本错误:', event.error);
});

console.log('✅ [BACKGROUND] 软体猫后台脚本初始化完成');