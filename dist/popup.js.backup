// extension/popup/popup.js - 修复版本
// 改进用户界面和错误处理

document.addEventListener('DOMContentLoaded', async function() {
  console.log('弹窗已加载');
  
  // 获取DOM元素
  const toggleBtn = document.getElementById('toggleSoftCat');
  const statusDiv = document.getElementById('status');
  const debugBtn = document.getElementById('toggleDebug');
  const resetBtn = document.getElementById('resetCat');
  const settingsBtn = document.getElementById('settings');
  
  // 初始化界面
  await updateUI();
  
  // 绑定事件监听器
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleSoftCat);
  }
  
  if (debugBtn) {
    debugBtn.addEventListener('click', toggleDebug);
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', resetCat);
  }
  
  if (settingsBtn) {
    settingsBtn.addEventListener('click', openSettings);
  }
  
  // 定期更新状态
  setInterval(updateUI, 2000);
});

// 切换软体猫状态
async function toggleSoftCat() {
  const toggleBtn = document.getElementById('toggleSoftCat');
  const statusDiv = document.getElementById('status');
  
  try {
    // 禁用按钮防止重复点击
    toggleBtn.disabled = true;
    toggleBtn.textContent = '处理中...';
    
    // 向后台脚本发送消息
    const response = await sendMessageToBackground({ action: 'toggleSoftCat' });
    
    if (response.success) {
      showStatus(response.message, 'success');
      await updateUI();
    } else {
      showStatus(`操作失败: ${response.error}`, 'error');
    }
    
  } catch (error) {
    console.error('切换软体猫失败:', error);
    showStatus('操作失败，请重试', 'error');
  } finally {
    // 重新启用按钮
    setTimeout(() => {
      toggleBtn.disabled = false;
      updateButtonText();
    }, 1000);
  }
}

// 切换调试模式
async function toggleDebug() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.tabs.sendMessage(tab.id, { action: 'toggleDebug' });
    showStatus('调试模式已切换', 'info');
  } catch (error) {
    console.error('切换调试模式失败:', error);
    showStatus('切换调试模式失败', 'error');
  }
}

// 重置软体猫
async function resetCat() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.tabs.sendMessage(tab.id, { action: 'resetCat' });
    showStatus('软体猫已重置', 'success');
  } catch (error) {
    console.error('重置软体猫失败:', error);
    showStatus('重置失败', 'error');
  }
}

// 打开设置页面
function openSettings() {
  chrome.runtime.openOptionsPage();
}

// 更新UI状态
async function updateUI() {
  try {
    const response = await sendMessageToBackground({ action: 'getSoftCatStatus' });
    updateButtonText(response.enabled);
    updateStatus(response.enabled);
  } catch (error) {
    console.error('更新UI失败:', error);
    showStatus('无法获取状态', 'error');
  }
}

// 更新按钮文本
function updateButtonText(enabled = false) {
  const toggleBtn = document.getElementById('toggleSoftCat');
  if (toggleBtn && !toggleBtn.disabled) {
    toggleBtn.textContent = enabled ? '关闭软体猫' : '开启软体猫';
    toggleBtn.className = enabled ? 'btn btn-danger' : 'btn btn-primary';
  }
}

// 更新状态显示
function updateStatus(enabled) {
  const statusDiv = document.getElementById('status');
  if (statusDiv) {
    statusDiv.textContent = enabled ? '✅ 软体猫运行中' : '⭕ 软体猫已停止';
    statusDiv.className = enabled ? 'status success' : 'status inactive';
  }
}

// 显示状态消息
function showStatus(message, type = 'info') {
  const statusDiv = document.getElementById('status');
  if (statusDiv) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    
    // 3秒后恢复原状态
    setTimeout(updateUI, 3000);
  }
}

// 向后台脚本发送消息
function sendMessageToBackground(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response || {});
      }
    });
  });
}

// 错误处理
window.addEventListener('error', (e) => {
  console.error('弹窗脚本错误:', e.error);
  showStatus('发生未知错误', 'error');
});

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'statusUpdate') {
    showStatus(request.message, request.type || 'info');
    sendResponse({ received: true });
  }
  return true;
});