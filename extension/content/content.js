// 软体猫内容脚本 - 注入到网页中
console.log('🐱 软体猫桌宠已加载');

class SoftCatInjector {
  constructor() {
    this.catContainer = null;
    this.isInjected = false;
    this.init();
  }

  init() {
    // 等待页面完全加载
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.injectCat());
    } else {
      this.injectCat();
    }
  }

  async injectCat() {
    if (this.isInjected) return;

    try {
      // 检查是否已经注入
      if (document.getElementById('softcat-container')) {
        console.log('软体猫已存在，跳过注入');
        return;
      }

      // 创建软体猫容器
      this.createCatContainer();
      
      // 加载软体猫脚本
      await this.loadSoftCatScript();
      
      this.isInjected = true;
      console.log('✅ 软体猫桌宠注入成功');
    } catch (error) {
      console.error('❌ 软体猫注入失败:', error);
    }
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

  async loadSoftCatScript() {
    // 动态加载软体猫脚本
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('shared/softcat-core.js');
    script.onload = () => {
      // 初始化软体猫
      if (window.SoftCatCore) {
        new window.SoftCatCore(this.catContainer);
      }
    };
    script.onerror = () => {
      console.error('软体猫核心脚本加载失败');
    };
    
    document.head.appendChild(script);
  }

  // 移除软体猫
  removeCat() {
    if (this.catContainer) {
      this.catContainer.remove();
      this.catContainer = null;
      this.isInjected = false;
    }
  }
}

// 监听来自popup的消息
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
      break;
    case 'getCatStatus':
      sendResponse({ 
        isInjected: window.softCatInjector?.isInjected || false 
      });
      break;
  }
});

// 初始化软体猫注入器
window.softCatInjector = new SoftCatInjector();
