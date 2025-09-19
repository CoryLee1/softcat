// extension/content/content.js - 修复版本
// 改进初始化流程和状态管理

console.log('🐱 [CONTENT] 软体猫内容脚本已加载');

class SoftCatContentManager {
  constructor() {
    this.isLibrariesLoaded = false;
    this.isSoftCatReady = false;
    this.maxRetries = 10;
    this.retryDelay = 1000;
    this.checkInterval = 500;
    
    this.init();
  }

  // 初始化
  init() {
    console.log('🔄 [CONTENT] 内容脚本管理器初始化');
    
    // 等待页面加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupMessageListener());
    } else {
      this.setupMessageListener();
    }
    
    // 检查库文件加载状态
    this.checkLibrariesPeriodically();
  }

  // 设置消息监听器
  setupMessageListener() {
    console.log('📡 [CONTENT] 设置消息监听器');
    
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('📨 [CONTENT] 收到消息:', request);
      
      // 异步处理消息
      this.handleMessage(request).then(response => {
        console.log('📤 [CONTENT] 发送响应:', response);
        sendResponse(response);
      }).catch(error => {
        console.error('❌ [CONTENT] 消息处理错误:', error);
        sendResponse({ 
          success: false, 
          error: error.message,
          action: request.action 
        });
      });
      
      return true; // 保持消息通道开放
    });
  }

  // 处理消息
  async handleMessage(request) {
    switch (request.action) {
      case 'startSoftCat':
        return await this.startSoftCat();
        
      case 'stopSoftCat':
        return await this.stopSoftCat();
        
      case 'toggleDebug':
        return await this.toggleDebug();
        
      case 'resetCat':
        return await this.resetCat();
        
      case 'getStatus':
        return await this.getStatus();
        
      case 'settingsUpdated':
        return await this.updateSettings(request.data);
        
      default:
        throw new Error(`未知操作: ${request.action}`);
    }
  }

  // 定期检查库文件
  checkLibrariesPeriodically() {
    const checkLibraries = () => {
      const p5Loaded = typeof p5 !== 'undefined';
      const matterLoaded = typeof Matter !== 'undefined';
      
      if (p5Loaded && matterLoaded && !this.isLibrariesLoaded) {
        this.isLibrariesLoaded = true;
        console.log('✅ [CONTENT] 库文件已加载完成');
        
        // 检查软体猫是否已准备就绪
        this.checkSoftCatReady();
      } else if (!this.isLibrariesLoaded) {
        setTimeout(checkLibraries, this.checkInterval);
      }
    };
    
    checkLibraries();
  }

  // 检查软体猫是否准备就绪
  checkSoftCatReady() {
    let attempts = 0;
    
    const checkReady = () => {
      attempts++;
      
      if (window.SoftCat && typeof window.SoftCat.start === 'function') {
        this.isSoftCatReady = true;
        console.log('✅ [CONTENT] 软体猫API已准备就绪');
        return;
      }
      
      if (attempts < this.maxRetries) {
        console.log(`🔄 [CONTENT] 等待软体猫准备就绪... (${attempts}/${this.maxRetries})`);
        setTimeout(checkReady, this.retryDelay);
      } else {
        console.warn('⚠️ [CONTENT] 软体猫准备超时');
      }
    };
    
    checkReady();
  }

  // 启动软体猫
  async startSoftCat() {
    console.log('🚀 [CONTENT] 尝试启动软体猫...');
    
    try {
      // 检查库文件
      if (!this.checkLibrariesLoaded()) {
        throw new Error('库文件未加载完成');
      }
      
      // 等待软体猫API准备就绪
      await this.waitForSoftCatAPI();
      
      // 启动软体猫
      const success = window.SoftCat.start();
      
      if (success) {
        return {
          success: true,
          message: '软体猫启动成功',
          status: window.SoftCat.getStatus()
        };
      } else {
        throw new Error('软体猫启动失败');
      }
      
    } catch (error) {
      console.error('❌ [CONTENT] 启动软体猫失败:', error);
      return {
        success: false,
        error: error.message,
        librariesLoaded: this.isLibrariesLoaded,
        softCatReady: this.isSoftCatReady
      };
    }
  }

  // 停止软体猫
  async stopSoftCat() {
    console.log('⏹️ [CONTENT] 尝试停止软体猫...');
    
    try {
      if (window.SoftCat && typeof window.SoftCat.stop === 'function') {
        window.SoftCat.stop();
        return {
          success: true,
          message: '软体猫已停止'
        };
      } else {
        // 如果API不存在，直接清理DOM
        this.cleanupSoftCat();
        return {
          success: true,
          message: '软体猫已清理'
        };
      }
      
    } catch (error) {
      console.error('❌ [CONTENT] 停止软体猫失败:', error);
      
      // 强制清理
      this.cleanupSoftCat();
      
      return {
        success: true,
        message: '软体猫已强制清理',
        error: error.message
      };
    }
  }

  // 切换调试模式
  async toggleDebug() {
    try {
      if (!this.isSoftCatAPIAvailable()) {
        throw new Error('软体猫未运行');
      }
      
      const debugMode = window.SoftCat.toggleDebug();
      
      return {
        success: true,
        message: `调试模式已${debugMode ? '开启' : '关闭'}`,
        debugMode: debugMode
      };
      
    } catch (error) {
      console.error('❌ [CONTENT] 切换调试模式失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 重置软体猫
  async resetCat() {
    try {
      if (!this.isSoftCatAPIAvailable()) {
        throw new Error('软体猫未运行');
      }
      
      window.SoftCat.reset();
      
      return {
        success: true,
        message: '软体猫已重置'
      };
      
    } catch (error) {
      console.error('❌ [CONTENT] 重置软体猫失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 获取状态
  async getStatus() {
    try {
      const baseStatus = {
        librariesLoaded: this.isLibrariesLoaded,
        softCatReady: this.isSoftCatReady,
        apiAvailable: this.isSoftCatAPIAvailable()
      };
      
      if (this.isSoftCatAPIAvailable()) {
        const softCatStatus = window.SoftCat.getStatus();
        return {
          success: true,
          ...baseStatus,
          ...softCatStatus
        };
      } else {
        return {
          success: true,
          ...baseStatus,
          loaded: false,
          running: false
        };
      }
      
    } catch (error) {
      console.error('❌ [CONTENT] 获取状态失败:', error);
      return {
        success: false,
        error: error.message,
        librariesLoaded: this.isLibrariesLoaded,
        softCatReady: this.isSoftCatReady
      };
    }
  }

  // 更新设置
  async updateSettings(settings) {
    console.log('⚙️ [CONTENT] 更新设置:', settings);
    
    try {
      // 这里可以根据新设置重新配置软体猫
      // 暂时返回成功
      return {
        success: true,
        message: '设置已更新'
      };
      
    } catch (error) {
      console.error('❌ [CONTENT] 更新设置失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 辅助方法
  checkLibrariesLoaded() {
    const p5Loaded = typeof p5 !== 'undefined';
    const matterLoaded = typeof Matter !== 'undefined';
    
    console.log(`📚 [CONTENT] 库文件状态 - p5.js: ${p5Loaded}, Matter.js: ${matterLoaded}`);
    
    return p5Loaded && matterLoaded;
  }

  isSoftCatAPIAvailable() {
    return window.SoftCat && 
           typeof window.SoftCat.start === 'function' &&
           typeof window.SoftCat.stop === 'function' &&
           typeof window.SoftCat.getStatus === 'function';
  }

  async waitForSoftCatAPI(timeout = 10000) {
    const startTime = Date.now();
    
    while (!this.isSoftCatAPIAvailable()) {
      if (Date.now() - startTime > timeout) {
        throw new Error('等待软体猫API超时');
      }
      
      console.log('⏳ [CONTENT] 等待软体猫API...');
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('✅ [CONTENT] 软体猫API已准备就绪');
  }

  cleanupSoftCat() {
    console.log('🧹 [CONTENT] 清理软体猫资源...');
    
    try {
      // 移除容器
      const container = document.getElementById('softcat-container');
      if (container) {
        container.remove();
        console.log('✅ [CONTENT] 软体猫容器已移除');
      }
      
      // 移除画布
      const canvas = document.getElementById('softcat-canvas');
      if (canvas) {
        canvas.remove();
        console.log('✅ [CONTENT] 软体猫画布已移除');
      }
      
      // 清理全局状态
      if (window.SoftCatLoaded) {
        window.SoftCatLoaded = false;
      }
      
      if (window.SoftCat) {
        delete window.SoftCat;
      }
      
      this.isSoftCatReady = false;
      
      console.log('✅ [CONTENT] 软体猫资源清理完成');
      
    } catch (error) {
      console.error('❌ [CONTENT] 清理软体猫资源失败:', error);
    }
  }
}

// 创建内容脚本管理器实例
const contentManager = new SoftCatContentManager();

// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
  console.log('🔄 [CONTENT] 页面卸载，清理资源...');
  
  if (contentManager) {
    contentManager.cleanupSoftCat();
  }
});

// 错误处理
window.addEventListener('error', (e) => {
  console.error('❌ [CONTENT] 内容脚本错误:', e.error);
  
  // 如果是软体猫相关错误，尝试清理
  if (e.error && e.error.message && e.error.message.includes('SoftCat')) {
    contentManager.cleanupSoftCat();
  }
});

// 暴露给调试用
window.SoftCatContentManager = contentManager;