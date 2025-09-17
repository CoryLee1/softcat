// Single-file content script: bundles p5.js + matter-js + core logic
import p5 from 'p5';
import * as Matter from 'matter-js';

console.log('🐱 软体猫内容脚本开始加载...');

// expose globals for core that expects window variables
;(window as any).p5 = p5;
;(window as any).Matter = Matter;

console.log('🐱 库文件已暴露到全局:', { p5: !!p5, Matter: !!Matter });
console.log('🐱 p5 构造函数:', typeof p5);

// Mount shadow-root container to isolate styles and overlay on page
function ensureCanvasHost(): HTMLElement {
	const existing = document.getElementById('softcat-root');
	if (existing) {
		console.log('🐱 使用现有容器');
		return existing;
	}
	const host = document.createElement('div');
	host.id = 'softcat-root';
	host.style.position = 'fixed';
	host.style.left = '0';
	host.style.top = '0';
	host.style.width = '100vw';
	host.style.height = '100vh';
	host.style.pointerEvents = 'none';
	host.style.zIndex = '2147483647';
	// 移除调试边框和背景，保持完全透明
	// host.style.border = '3px solid blue';
	// host.style.backgroundColor = 'rgba(0,0,255,0.1)';
	document.documentElement.appendChild(host);
	console.log('🐱 容器已创建并添加到页面:', host);
	return host;
}

// Minimal bootstrap if core exists as a function on window after bundling
function startCoreIfPresent() {
	console.log('🐱 尝试启动软体猫核心...');
	const maybeInit = (window as any).SoftCatInit;
	console.log('🐱 SoftCatInit 函数存在:', typeof maybeInit);
	if (typeof maybeInit === 'function') {
		console.log('🐱 调用 SoftCatInit...');
		maybeInit({ container: ensureCanvasHost() });
	} else {
		console.log('🐱 SoftCatInit 函数不存在，等待加载...');
		// 等待一下再试
		setTimeout(() => {
			const retryInit = (window as any).SoftCatInit;
			if (typeof retryInit === 'function') {
				console.log('🐱 重试调用 SoftCatInit...');
				retryInit({ container: ensureCanvasHost() });
			} else {
				console.log('🐱 重试后 SoftCatInit 仍不存在');
			}
		}, 1000);
	}
}

// Import core logic. We will create a shim file that attaches SoftCatInit to window.
import '../core/softcat-core-entry';

console.log('🐱 核心逻辑已导入，SoftCatInit 存在:', typeof (window as any).SoftCatInit);

startCoreIfPresent();

// Listen to messages from popup/background
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
	console.log('🐱 内容脚本收到消息:', request);
	if (request.action === 'startSoftCat') {
		console.log('🐱 手动启动软体猫...');
		startCoreIfPresent();
		sendResponse({ success: true });
		return true;
	}
	if (request.action === 'stopSoftCat') {
		console.log('🐱 停止软体猫...');
		if ((window as any).SoftCat && (window as any).SoftCat.stop) {
			(window as any).SoftCat.stop();
			sendResponse({ success: true });
		} else {
			sendResponse({ success: false });
		}
		return true;
	}
});