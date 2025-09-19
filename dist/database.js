/**
 * 软体猫本地数据库管理器
 * 使用 IndexedDB 存储标签页的详细信息和元数据
 */

class SoftCatDatabase {
  constructor() {
    this.dbName = 'SoftCatDatabase';
    this.dbVersion = 1;
    this.db = null;
  }

  // 初始化数据库
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('❌ [DATABASE] 数据库打开失败:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ [DATABASE] 数据库连接成功');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        console.log('🔄 [DATABASE] 数据库升级中...');

        // 创建标签页存储表
        if (!db.objectStoreNames.contains('tabs')) {
          const tabsStore = db.createObjectStore('tabs', { keyPath: 'id' });
          tabsStore.createIndex('url', 'url', { unique: false });
          tabsStore.createIndex('createdAt', 'createdAt', { unique: false });
          tabsStore.createIndex('tags', 'tags', { unique: false, multiEntry: true });
          console.log('✅ [DATABASE] 创建标签页存储表');
        }

        // 创建收集记录表
        if (!db.objectStoreNames.contains('collections')) {
          const collectionsStore = db.createObjectStore('collections', { keyPath: 'id', autoIncrement: true });
          collectionsStore.createIndex('createdAt', 'createdAt', { unique: false });
          collectionsStore.createIndex('tabCount', 'tabCount', { unique: false });
          console.log('✅ [DATABASE] 创建收集记录表');
        }
      };
    });
  }

  // 保存标签页详细信息
  async saveTabDetails(tabData) {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['tabs'], 'readwrite');
      const store = transaction.objectStore('tabs');

      // 生成唯一的标签页ID
      const tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 构建完整的标签页数据
      const fullTabData = {
        id: tabId,
        url: tabData.url,
        title: tabData.title || '无标题',
        site: {
          name: this.extractSiteName(tabData.url),
          favicon: tabData.favIconUrl || this.getDefaultFavicon(tabData.url)
        },
        meta: {
          ogImage: null, // 将在后续步骤中提取
          description: null // 将在后续步骤中提取
        },
        image: {
          type: 'screenshot', // 默认使用截图
          url: null, // 将在后续步骤中生成
          palette: ['#4facfe', '#00f2fe'] // 默认调色板
        },
        summary: this.generateSummary(tabData.title, tabData.url),
        tags: this.generateTags(tabData.url, tabData.title),
        createdAt: Date.now(),
        style: {
          shadow: true,
          numbered: 1
        },
        // 原始标签页数据
        originalData: tabData
      };

      const request = store.put(fullTabData);

      request.onsuccess = () => {
        console.log('✅ [DATABASE] 标签页数据已保存:', tabId);
        resolve(fullTabData);
      };

      request.onerror = () => {
        console.error('❌ [DATABASE] 保存标签页数据失败:', request.error);
        reject(request.error);
      };
    });
  }

  // 保存收集记录
  async saveCollection(tabIds, collectionName = '一键收Tab') {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['collections'], 'readwrite');
      const store = transaction.objectStore('collections');

      const collectionData = {
        name: collectionName,
        tabIds: tabIds,
        tabCount: tabIds.length,
        createdAt: Date.now()
      };

      const request = store.add(collectionData);

      request.onsuccess = () => {
        console.log('✅ [DATABASE] 收集记录已保存:', request.result);
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('❌ [DATABASE] 保存收集记录失败:', request.error);
        reject(request.error);
      };
    });
  }

  // 获取所有标签页
  async getAllTabs() {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['tabs'], 'readonly');
      const store = transaction.objectStore('tabs');
      const request = store.getAll();

      request.onsuccess = () => {
        console.log('✅ [DATABASE] 获取到', request.result.length, '个标签页');
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('❌ [DATABASE] 获取标签页失败:', request.error);
        reject(request.error);
      };
    });
  }

  // 获取最新的收集记录
  async getLatestCollection() {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['collections'], 'readonly');
      const store = transaction.objectStore('collections');
      const index = store.index('createdAt');
      const request = index.openCursor(null, 'prev'); // 从最新开始

      let latestCollection = null;
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          latestCollection = cursor.value;
          cursor.continue();
        } else {
          resolve(latestCollection);
        }
      };

      request.onerror = () => {
        console.error('❌ [DATABASE] 获取收集记录失败:', request.error);
        reject(request.error);
      };
    });
  }

  // 根据收集记录获取标签页
  async getTabsByCollection(collectionId) {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['collections', 'tabs'], 'readonly');
      const collectionsStore = transaction.objectStore('collections');
      const tabsStore = transaction.objectStore('tabs');

      const getCollectionRequest = collectionsStore.get(collectionId);
      getCollectionRequest.onsuccess = () => {
        const collection = getCollectionRequest.result;
        if (!collection) {
          resolve([]);
          return;
        }

        const tabIds = collection.tabIds;
        const tabs = [];
        let completed = 0;

        if (tabIds.length === 0) {
          resolve([]);
          return;
        }

        tabIds.forEach(tabId => {
          const getTabRequest = tabsStore.get(tabId);
          getTabRequest.onsuccess = () => {
            if (getTabRequest.result) {
              tabs.push(getTabRequest.result);
            }
            completed++;
            if (completed === tabIds.length) {
              resolve(tabs);
            }
          };
          getTabRequest.onerror = () => {
            completed++;
            if (completed === tabIds.length) {
              resolve(tabs);
            }
          };
        });
      };

      getCollectionRequest.onerror = () => {
        console.error('❌ [DATABASE] 获取收集记录失败:', getCollectionRequest.error);
        reject(getCollectionRequest.error);
      };
    });
  }

  // 提取网站名称
  extractSiteName(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      
      // 移除 www. 前缀
      const cleanHostname = hostname.replace(/^www\./, '');
      
      // 提取主域名
      const parts = cleanHostname.split('.');
      if (parts.length >= 2) {
        return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      }
      
      return cleanHostname;
    } catch (error) {
      return '未知网站';
    }
  }

  // 获取默认图标
  getDefaultFavicon(url) {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
    } catch (error) {
      return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M7 7h10M7 11h10M7 15h4"/></svg>';
    }
  }

  // 生成摘要
  generateSummary(title, url) {
    if (title && title !== '无标题') {
      return title.length > 20 ? title.substring(0, 20) + '...' : title;
    }
    
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace(/^www\./, '');
      return hostname.length > 20 ? hostname.substring(0, 20) + '...' : hostname;
    } catch (error) {
      return '网页链接';
    }
  }

  // 生成标签
  generateTags(url, title) {
    const tags = [];
    
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      // 根据域名添加标签
      if (hostname.includes('github.com')) tags.push('开发', '代码');
      else if (hostname.includes('youtube.com')) tags.push('视频', '娱乐');
      else if (hostname.includes('twitter.com') || hostname.includes('x.com')) tags.push('社交', '微博');
      else if (hostname.includes('stackoverflow.com')) tags.push('开发', '问答');
      else if (hostname.includes('google.com')) tags.push('搜索', '工具');
      else if (hostname.includes('zhihu.com')) tags.push('问答', '知识');
      else if (hostname.includes('bilibili.com')) tags.push('视频', '娱乐');
      else if (hostname.includes('taobao.com') || hostname.includes('tmall.com')) tags.push('购物', '电商');
      else if (hostname.includes('jd.com')) tags.push('购物', '电商');
      else if (hostname.includes('weibo.com')) tags.push('社交', '微博');
      else if (hostname.includes('douban.com')) tags.push('文化', '评论');
      else if (hostname.includes('reddit.com')) tags.push('社交', '论坛');
      else if (hostname.includes('medium.com')) tags.push('文章', '博客');
      else if (hostname.includes('wikipedia.org')) tags.push('百科', '知识');
      else if (hostname.includes('news')) tags.push('新闻', '资讯');
      else if (hostname.includes('blog')) tags.push('博客', '文章');
      else if (hostname.includes('shop')) tags.push('购物', '商店');
      else if (hostname.includes('app')) tags.push('应用', '工具');
      else tags.push('网页');
      
      // 根据标题添加标签
      if (title) {
        const titleLower = title.toLowerCase();
        if (titleLower.includes('教程') || titleLower.includes('tutorial')) tags.push('教程');
        if (titleLower.includes('新闻') || titleLower.includes('news')) tags.push('新闻');
        if (titleLower.includes('技术') || titleLower.includes('tech')) tags.push('技术');
        if (titleLower.includes('设计') || titleLower.includes('design')) tags.push('设计');
        if (titleLower.includes('音乐') || titleLower.includes('music')) tags.push('音乐');
        if (titleLower.includes('游戏') || titleLower.includes('game')) tags.push('游戏');
      }
      
    } catch (error) {
      tags.push('网页');
    }
    
    // 去重并限制数量
    return [...new Set(tags)].slice(0, 3);
  }

  // 清空数据库
  async clearDatabase() {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['tabs', 'collections'], 'readwrite');
      const tabsStore = transaction.objectStore('tabs');
      const collectionsStore = transaction.objectStore('collections');

      const clearTabs = tabsStore.clear();
      const clearCollections = collectionsStore.clear();

      let completed = 0;
      const checkComplete = () => {
        completed++;
        if (completed === 2) {
          console.log('✅ [DATABASE] 数据库已清空');
          resolve();
        }
      };

      clearTabs.onsuccess = checkComplete;
      clearTabs.onerror = () => {
        console.error('❌ [DATABASE] 清空标签页失败:', clearTabs.error);
        checkComplete();
      };

      clearCollections.onsuccess = checkComplete;
      clearCollections.onerror = () => {
        console.error('❌ [DATABASE] 清空收集记录失败:', clearCollections.error);
        checkComplete();
      };
    });
  }
}

// 导出数据库管理器
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SoftCatDatabase;
} else {
  window.SoftCatDatabase = SoftCatDatabase;
}
