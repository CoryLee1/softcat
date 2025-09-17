// Options 页面脚本
class SoftCatOptions {
  constructor() {
    this.settings = {};
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.bindEvents();
    this.updateUI();
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
      console.log('设置已加载:', this.settings);
    } catch (error) {
      console.error('加载设置失败:', error);
    }
  }

  // 保存设置
  async saveSettings() {
    try {
      await chrome.storage.sync.set(this.settings);
      console.log('设置已保存:', this.settings);
      
      // 显示保存成功提示
      this.showNotification('设置已保存！', 'success');
      
      // 通知所有标签页更新设置
      this.notifyTabs('settingsUpdated', this.settings);
    } catch (error) {
      console.error('保存设置失败:', error);
      this.showNotification('保存失败，请重试', 'error');
    }
  }

  // 重置设置
  async resetSettings() {
    if (confirm('确定要重置所有设置吗？')) {
      try {
        await chrome.storage.sync.clear();
        await this.loadSettings();
        this.updateUI();
        this.showNotification('设置已重置！', 'success');
      } catch (error) {
        console.error('重置设置失败:', error);
        this.showNotification('重置失败，请重试', 'error');
      }
    }
  }

  // 测试软体猫
  async testCat() {
    try {
      // 获取当前活动标签页
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab) {
        // 注入软体猫到当前标签页
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['shared/softcat-core.js']
        });
        
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content/content.js']
        });
        
        this.showNotification('软体猫已注入到当前页面！', 'success');
      }
    } catch (error) {
      console.error('测试软体猫失败:', error);
      this.showNotification('测试失败，请确保页面允许脚本注入', 'error');
    }
  }

  // 绑定事件
  bindEvents() {
    // 复选框事件
    document.getElementById('catEnabled').addEventListener('change', (e) => {
      this.settings.catEnabled = e.target.checked;
    });

    document.getElementById('physicsEnabled').addEventListener('change', (e) => {
      this.settings.physicsEnabled = e.target.checked;
    });

    document.getElementById('debugMode').addEventListener('change', (e) => {
      this.settings.debugMode = e.target.checked;
    });

    // 滑块事件
    document.getElementById('catSize').addEventListener('input', (e) => {
      this.settings.catSize = parseFloat(e.target.value);
      document.getElementById('catSizeValue').textContent = `${e.target.value}x`;
    });

    document.getElementById('positionX').addEventListener('input', (e) => {
      this.settings.catPosition.x = parseInt(e.target.value);
      document.getElementById('positionXValue').textContent = `${e.target.value}%`;
    });

    document.getElementById('positionY').addEventListener('input', (e) => {
      this.settings.catPosition.y = parseInt(e.target.value);
      document.getElementById('positionYValue').textContent = `${e.target.value}%`;
    });

    document.getElementById('animationSpeed').addEventListener('input', (e) => {
      this.settings.animationSpeed = parseFloat(e.target.value);
      document.getElementById('animationSpeedValue').textContent = `${e.target.value}x`;
    });

    // 选择框事件
    document.getElementById('physicsQuality').addEventListener('change', (e) => {
      this.settings.physicsQuality = e.target.value;
    });

    // 按钮事件
    document.getElementById('saveSettings').addEventListener('click', () => {
      this.saveSettings();
    });

    document.getElementById('resetSettings').addEventListener('click', () => {
      this.resetSettings();
    });

    document.getElementById('testCat').addEventListener('click', () => {
      this.testCat();
    });
  }

  // 更新UI
  updateUI() {
    // 更新复选框
    document.getElementById('catEnabled').checked = this.settings.catEnabled;
    document.getElementById('physicsEnabled').checked = this.settings.physicsEnabled;
    document.getElementById('debugMode').checked = this.settings.debugMode;

    // 更新滑块
    document.getElementById('catSize').value = this.settings.catSize;
    document.getElementById('catSizeValue').textContent = `${this.settings.catSize}x`;

    document.getElementById('positionX').value = this.settings.catPosition.x;
    document.getElementById('positionXValue').textContent = `${this.settings.catPosition.x}%`;

    document.getElementById('positionY').value = this.settings.catPosition.y;
    document.getElementById('positionYValue').textContent = `${this.settings.catPosition.y}%`;

    document.getElementById('animationSpeed').value = this.settings.animationSpeed;
    document.getElementById('animationSpeedValue').textContent = `${this.settings.animationSpeed}x`;

    // 更新选择框
    document.getElementById('physicsQuality').value = this.settings.physicsQuality;
  }

  // 通知标签页
  async notifyTabs(action, data) {
    try {
      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
        try {
          await chrome.tabs.sendMessage(tab.id, { action, data });
        } catch (error) {
          // 忽略无法发送消息的标签页
        }
      }
    } catch (error) {
      console.error('通知标签页失败:', error);
    }
  }

  // 显示通知
  showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 6px;
      color: white;
      font-weight: 600;
      z-index: 1000;
      animation: slideIn 0.3s ease;
      max-width: 300px;
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
      notification.style.animation = 'slideOut 0.3s ease';
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
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// 初始化选项页面
document.addEventListener('DOMContentLoaded', () => {
  new SoftCatOptions();
});
