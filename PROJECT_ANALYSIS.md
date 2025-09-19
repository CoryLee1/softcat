# 软体猫桌宠扩展 - 项目结构分析

## 📁 项目结构

```
softcat/
├── extension/                    # 扩展核心文件
│   ├── background/
│   │   └── background.js         # 后台脚本 - 消息路由
│   ├── content/
│   │   └── content.js           # 内容脚本 - 软体猫控制
│   ├── popup/
│   │   ├── popup.html           # 弹窗界面
│   │   ├── popup.css            # 弹窗样式
│   │   └── popup.js             # 弹窗逻辑
│   ├── options/
│   │   ├── options.html         # 选项页面
│   │   ├── options.css          # 选项样式
│   │   └── options.js           # 选项逻辑
│   ├── manifest/
│   │   └── manifest.json        # 扩展清单
│   ├── assets/
│   │   └── images/              # 图片资源
│   │       ├── cat.png
│   │       ├── cat_body.png
│   │       └── washing_machine.png
│   └── lib/                     # 第三方库
│       ├── p5.min.js            # p5.js 2D图形库
│       └── matter.min.js        # Matter.js 物理引擎
├── shared/
│   └── softcat-core.js          # 软体猫核心逻辑
├── dist/                        # 构建输出目录
├── webpack.config.js            # Webpack配置
└── package.json                 # 项目配置
```

## 🔄 脚本协作流程

### 1. 扩展加载流程
```
用户安装扩展 → Chrome加载manifest.json → 静态注入content_scripts
```

**manifest.json 配置的注入顺序：**
1. `lib/p5.min.js` - p5.js图形库
2. `lib/matter.min.js` - Matter.js物理引擎  
3. `shared/softcat-core.js` - 软体猫核心逻辑
4. `content.js` - 内容脚本控制器

### 2. 软体猫启动流程
```
用户点击弹窗按钮 → popup.js → background.js → content.js → window.SoftCat.start()
```

**详细步骤：**
1. **popup.js**: 用户点击"开启软体猫"按钮
2. **background.js**: 接收消息，调用`toggleSoftCat()`
3. **background.js**: 发送`{action: 'startSoftCat'}`消息给content script
4. **content.js**: 接收消息，调用`startSoftCat()`
5. **content.js**: 检查`window.SoftCat`对象是否存在
6. **softcat-core.js**: 执行`window.SoftCat.start()`启动物理引擎

### 3. 软体猫核心初始化流程
```
softcat-core.js加载 → initializeEverything() → 创建window.SoftCat API
```

**initializeEverything() 执行顺序：**
1. `initP5()` - 初始化p5.js画布
2. `initMatter()` - 初始化Matter.js物理引擎
3. `initMatterRenderer()` - 初始化渲染器
4. `createMachine()` - 创建洗衣机物理对象
5. `createSoftBody()` - 创建软体猫粒子系统
6. `createTail()` - 创建尾巴
7. `setupEventListeners()` - 设置交互事件
8. `setupMouseConstraint()` - 设置鼠标约束

## 🎯 当前问题分析

### 问题1: 软体猫不可见
**现象**: 用户只能看到半透明红色背景，看不到测试绘制内容（彩色圆圈、文字、边框等）

**可能原因**:
1. **p5.js绘制被覆盖**: `drawWashingMachine()`和`drawSoftCat()`函数可能覆盖了测试绘制
2. **画布层级问题**: z-index设置可能不够高
3. **绘制时机问题**: 测试绘制可能在错误时机执行

### 问题2: 按钮功能异常
**现象**: 按钮只能开启一次软体猫，无法重复切换

**可能原因**:
1. **window.SoftCat对象暴露时机**: 对象可能在错误时机定义
2. **状态管理问题**: `softcatRunning`状态可能没有正确更新
3. **消息通信问题**: background.js和content.js之间的消息传递可能有问题

### 问题3: 库加载检测
**现象**: 控制台显示"SoftCat 对象未找到或启动函数不存在"

**可能原因**:
1. **静态注入顺序**: 库文件加载顺序可能有问题
2. **初始化时机**: `window.SoftCat`对象可能在content.js执行时还未定义
3. **作用域问题**: 对象定义在错误的作用域中

## 🔧 技术栈

- **Chrome Extension**: Manifest V3
- **图形渲染**: p5.js (替代PIXI.js)
- **物理引擎**: Matter.js
- **构建工具**: Webpack
- **注入方式**: 静态content_scripts注入

## 📋 下一步调试建议

1. **检查p5.js绘制**: 确认draw函数中的测试绘制是否被后续代码覆盖
2. **验证window.SoftCat**: 确认对象在content.js执行时是否已定义
3. **调试消息流**: 跟踪从popup到background到content的完整消息流
4. **检查画布状态**: 确认画布是否正确创建和显示
5. **库加载验证**: 确认p5.js和Matter.js是否正确加载

## 🚀 当前版本状态

- **构建状态**: ✅ 成功
- **扩展加载**: ✅ 正常
- **消息通信**: ✅ 正常
- **库文件加载**: ✅ 正常
- **软体猫可见性**: ❌ 问题
- **按钮切换功能**: ❌ 问题
