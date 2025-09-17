// 软体猫内容脚本 - 注入到网页中
console.log('🐱 软体猫桌宠内容脚本已加载');

class SoftCatInjector {
  constructor() {
    this.catContainer = null;
    this.isInjected = false;
    this.settings = {};
    this.init();
  }

  async init() {
    // 加载设置
    await this.loadSettings();
    
    // 等待页面完全加载
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.injectCat());
    } else {
      this.injectCat();
    }
  }

  // 加载设置
  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get({
        catEnabled: true,
        physicsEnabled: true,
        debugMode: false,
        catSize: 1.0,
        catPosition: { x: 50, y: 65 },
        physicsQuality: 'medium',
        animationSpeed: 1.0
      });
      this.settings = result;
    } catch (error) {
      console.error('加载设置失败:', error);
    }
  }

  async injectCat() {
    if (this.isInjected || !this.settings.catEnabled) return;

    try {
      // 检查是否已经注入
      if (document.getElementById('softcat-container')) {
        console.log('软体猫已存在，跳过注入');
        return;
      }

      // 检查必要的库
      if (!this.checkLibraries()) {
        console.error('PIXI.js 或 Matter.js 库未加载');
        return;
      }

      // 创建软体猫容器
      this.createCatContainer();
      
      // 初始化软体猫
      this.initializeSoftCat();
      this.isInjected = true;
      console.log('✅ 软体猫桌宠注入成功');
      
    } catch (error) {
      console.error('❌ 软体猫注入失败:', error);
    }
  }

  // 检查必要的库是否已加载
  checkLibraries() {
    return typeof PIXI !== 'undefined' && typeof Matter !== 'undefined';
  }

  createCatContainer() {
    this.catContainer = document.createElement('div');
    this.catContainer.id = 'softcat-container';
    this.catContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 2147483647;
      overflow: hidden;
    `;

    document.body.appendChild(this.catContainer);
  }

  // 初始化软体猫
  initializeSoftCat() {
    // 软体猫核心脚本会自动初始化
    // 这里可以添加额外的初始化逻辑
    console.log('软体猫核心已初始化');
  }

  // 移除软体猫
  removeCat() {
    if (this.catContainer) {
      this.catContainer.remove();
      this.catContainer = null;
      this.isInjected = false;
      
      // 停止软体猫
      if (window.SoftCat && window.SoftCat.stop) {
        window.SoftCat.stop();
      }
    }
  }

  // 更新设置
  async updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    await chrome.storage.sync.set(this.settings);
    
    // 如果软体猫已注入，重新初始化
    if (this.isInjected) {
      this.removeCat();
      setTimeout(() => this.injectCat(), 100);
    }
  }
}

// 监听来自popup和background的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'toggleCat':
      if (window.softCatInjector) {
        if (window.softCatInjector.isInjected) {
          window.softCatInjector.removeCat();
        } else {
          window.softCatInjector.injectCat();
        }
      }
      sendResponse({ success: true });
      break;
      
    case 'getCatStatus':
      sendResponse({ 
        isInjected: window.softCatInjector?.isInjected || false,
        enabled: window.softCatInjector?.settings?.catEnabled || false
      });
      break;
      
    case 'settingsUpdated':
      if (window.softCatInjector && request.data) {
        window.softCatInjector.updateSettings(request.data);
      }
      break;
      
    case 'injectCat':
      if (window.softCatInjector) {
        window.softCatInjector.injectCat();
      }
      sendResponse({ success: true });
      break;
  }
});

// 初始化软体猫注入器
window.softCatInjector = new SoftCatInjector();

