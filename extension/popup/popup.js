// 软体猫桌宠弹窗脚本
class PopupController {
  constructor() {
    this.elements = {
      statusIndicator: document.getElementById('statusIndicator'),
      toggleCat: document.getElementById('toggleCat'),
      openOptions: document.getElementById('openOptions'),
      catStatus: document.getElementById('catStatus')
    };
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateStatus();
  }

  setupEventListeners() {
    // 切换软体猫按钮
    this.elements.toggleCat.addEventListener('click', () => {
      this.toggleCat();
    });

    // 打开设置页面
    this.elements.openOptions.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
  }

  async updateStatus() {
    try {
      // 获取当前标签页
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // 向内容脚本查询软体猫状态
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getCatStatus' });
      
      if (response) {
        this.updateStatusUI(response.isInjected);
      } else {
        this.updateStatusUI(false);
      }
    } catch (error) {
      console.error('获取软体猫状态失败:', error);
      this.updateStatusUI(false);
    }
  }

  updateStatusUI(isInjected) {
    const statusDot = this.elements.statusIndicator.querySelector('.status-dot');
    const statusText = this.elements.statusIndicator.querySelector('.status-text');
    const catStatus = this.elements.catStatus;
    const toggleBtn = this.elements.toggleCat;
    const btnText = toggleBtn.querySelector('.btn-text');

    if (isInjected) {
      statusDot.className = 'status-dot active';
      statusText.textContent = '软体猫已激活';
      catStatus.textContent = '活跃';
      btnText.textContent = '隐藏软体猫';
    } else {
      statusDot.className = 'status-dot inactive';
      statusText.textContent = '软体猫未激活';
      catStatus.textContent = '未激活';
      btnText.textContent = '显示软体猫';
    }
  }

  async toggleCat() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // 向内容脚本发送切换命令
      await chrome.tabs.sendMessage(tab.id, { action: 'toggleCat' });
      
      // 延迟更新状态，等待内容脚本处理
      setTimeout(() => {
        this.updateStatus();
      }, 100);
      
    } catch (error) {
      console.error('切换软体猫失败:', error);
      this.showError('切换失败，请刷新页面后重试');
    }
  }

  showError(message) {
    const statusText = this.elements.statusIndicator.querySelector('.status-text');
    statusText.textContent = message;
    statusText.style.color = '#ff4444';
    
    setTimeout(() => {
      this.updateStatus();
    }, 2000);
  }
}

// 初始化弹窗控制器
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});
