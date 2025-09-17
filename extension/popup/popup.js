// Popup 脚本 - 软体猫桌宠扩展弹窗
console.log('软体猫桌宠弹窗已加载');

class SoftCatPopup {
  constructor() {
    this.currentTab = null;
    this.catStatus = { enabled: false, visible: false };
    this.init();
  }

  async init() {
    try {
      // 检查扩展环境是否就绪
      if (!chrome.runtime || !chrome.runtime.sendMessage) {
        console.error('Chrome 扩展 API 不可用');
        this.showError('扩展环境未就绪');
        return;
      }
      
      // 获取当前标签页
      const tabValid = await this.getCurrentTab();
      if (!tabValid) {
        return; // 如果标签页不支持，直接返回
      }
      
      // 绑定事件
      this.bindEvents();
      
      // 更新状态
      await this.updateStatus();
    } catch (error) {
      console.error('初始化失败:', error);
      this.showError('初始化失败: ' + error.message);
    }
  }

  // 获取当前标签页
  async getCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      this.currentTab = tab;
      
      // 检查是否在特殊页面
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('moz-extension://')) {
        console.warn('当前页面不支持软体猫注入:', tab.url);
        this.showError('当前页面不支持软体猫功能');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('获取当前标签页失败:', error);
      this.showError('无法获取当前标签页');
      return false;
    }
  }

  // 绑定事件
  bindEvents() {
    // 切换软体猫按钮
    document.getElementById('toggleCat').addEventListener('click', () => {
      this.toggleCat();
    });

    // 打开设置按钮
    document.getElementById('openOptions').addEventListener('click', () => {
      this.openOptions();
    });

    // 监听来自content script的消息
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'statusUpdate') {
        this.updateUI(request.data);
      }
    });
  }

  // 切换软体猫
  async toggleCat() {
    if (!this.currentTab) {
      this.showError('无法获取当前标签页');
      return;
    }
    
    // 检查当前页面是否支持软体猫
    if (this.currentTab.url.startsWith('chrome://') || 
        this.currentTab.url.startsWith('chrome-extension://') || 
        this.currentTab.url.startsWith('moz-extension://')) {
      this.showError('当前页面不支持软体猫功能');
      return;
    }

    try {
      const button = document.getElementById('toggleCat');
      const statusText = document.getElementById('catStatus');
      
      // 显示加载状态
      button.disabled = true;
      button.querySelector('.btn-text').textContent = '切换中...';
      statusText.textContent = '切换中...';

      // 通过 background script 发送消息
      const response = await this.sendMessageToBackground({
        action: 'toggleCat',
        tabId: this.currentTab.id
      });

      if (response && response.success) {
        // 更新状态
        await this.updateStatus();
        this.showSuccess('软体猫状态已切换');
      } else {
        this.showError('切换失败，请重试');
      }
    } catch (error) {
      console.error('切换软体猫失败:', error);
      this.showError('切换失败：' + error.message);
    } finally {
      // 恢复按钮状态
      const button = document.getElementById('toggleCat');
      button.disabled = false;
      button.querySelector('.btn-text').textContent = '切换软体猫';
    }
  }

  // 打开设置页面
  openOptions() {
    chrome.runtime.openOptionsPage();
  }

  // 安全的消息发送方法
  async sendMessageToBackground(message) {
    try {
      if (!chrome.runtime || !chrome.runtime.sendMessage) {
        throw new Error('Chrome 扩展 API 不可用');
      }
      
      return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });
    } catch (error) {
      console.error('发送消息失败:', error);
      throw error;
    }
  }

  // 更新状态
  async updateStatus() {
    if (!this.currentTab) return;
    
    // 检查当前页面是否支持软体猫
    if (this.currentTab.url.startsWith('chrome://') || 
        this.currentTab.url.startsWith('chrome-extension://') || 
        this.currentTab.url.startsWith('moz-extension://')) {
      this.catStatus = { enabled: false, visible: false };
      this.updateUI();
      return;
    }

    try {
      // 通过 background script 获取软体猫状态
      const response = await this.sendMessageToBackground({
        action: 'getCatStatus',
        tabId: this.currentTab.id
      });

      if (response && response.status) {
        this.catStatus = response.status;
        this.updateUI();
      } else {
        this.catStatus = { enabled: false, visible: false };
        this.updateUI();
      }
    } catch (error) {
      console.error('获取状态失败:', error);
      this.catStatus = { enabled: false, visible: false };
      this.updateUI();
    }
  }

  // 更新UI
  updateUI(status = null) {
    if (status) {
      this.catStatus = status;
    }

    const statusIndicator = document.getElementById('statusIndicator');
    const statusDot = statusIndicator.querySelector('.status-dot');
    const statusText = statusIndicator.querySelector('.status-text');
    const catStatus = document.getElementById('catStatus');
    const toggleButton = document.getElementById('toggleCat');
    const buttonText = toggleButton.querySelector('.btn-text');

    // 检查是否在特殊页面
    const isSpecialPage = this.currentTab && (
      this.currentTab.url.startsWith('chrome://') || 
      this.currentTab.url.startsWith('chrome-extension://') || 
      this.currentTab.url.startsWith('moz-extension://')
    );

    if (isSpecialPage) {
      statusDot.style.backgroundColor = '#6c757d';
      statusText.textContent = '当前页面不支持';
      catStatus.textContent = '不支持';
      buttonText.textContent = '切换到其他页面';
      toggleButton.disabled = true;
      return;
    }

    // 更新状态指示器
    if (this.catStatus.enabled && this.catStatus.visible) {
      statusDot.style.backgroundColor = '#28a745';
      statusText.textContent = '软体猫已激活';
      catStatus.textContent = '运行中';
      buttonText.textContent = '隐藏软体猫';
    } else if (this.catStatus.enabled) {
      statusDot.style.backgroundColor = '#ffc107';
      statusText.textContent = '软体猫已启用';
      catStatus.textContent = '已启用';
      buttonText.textContent = '显示软体猫';
    } else {
      statusDot.style.backgroundColor = '#dc3545';
      statusText.textContent = '软体猫未启用';
      catStatus.textContent = '未启用';
      buttonText.textContent = '启用软体猫';
    }

    // 更新按钮状态
    toggleButton.disabled = false;
  }

  // 显示成功消息
  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  // 显示错误消息
  showError(message) {
    this.showNotification(message, 'error');
  }

  // 显示通知
  showNotification(message, type = 'info') {
    // 移除现有通知
    const existingNotification = document.querySelector('.popup-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `popup-notification popup-notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      right: 10px;
      padding: 0.75rem;
      border-radius: 6px;
      color: white;
      font-weight: 600;
      font-size: 0.9rem;
      text-align: center;
      z-index: 1000;
      animation: slideDown 0.3s ease;
    `;

    // 根据类型设置背景色
    const colors = {
      success: '#28a745',
      error: '#dc3545',
      info: '#007bff'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    // 添加到页面
    document.body.appendChild(notification);

    // 3秒后移除
    setTimeout(() => {
      notification.style.animation = 'slideUp 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(-100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// 初始化弹窗 - 确保在 DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  // 添加延迟确保扩展环境完全初始化
  setTimeout(() => {
    new SoftCatPopup();
  }, 100);
});
