# 软体猫桌宠 (Soft Cat Desktop Pet)

一个基于 Pixi.js 和 Matter.js 的软体物理桌宠，模拟一只趴在洗衣机上的软体猫。

## 🎮 功能特性

- **软体物理** - 使用 Matter.js 实现可变形网格
- **实时渲染** - Pixi.js 实现流畅的 2D 渲染
- **交互控制** - 鼠标拖拽洗衣机移动整个系统
- **可视化调试** - V键切换物理网格显示
- **形状重置** - R键重置猫的形状
- **洗衣机震动** - 模拟洗衣机运行时的轻微震动
- **透明背景** - 支持PNG透明背景，适合作为桌宠
- **真实贴图** - 使用真实的猫和洗衣机图片

## 🏗️ 代码架构分析

### 核心组件

#### 1. 渲染引擎
- **Pixi.js** - 2D 图形渲染
- **Matter.js** - 2D 物理引擎

#### 2. 物理世界
- **洗衣机** - 静态刚体，作为猫的支撑平台
- **软体猫** - 8×6 粒子网格，可变形
- **尾巴** - 9段链条结构
- **约束系统** - 固定约束、软体约束、链条约束

#### 3. 交互系统
- **拖拽检测** - 洗衣机区域检测
- **位置同步** - 物理体与视觉精灵同步
- **约束管理** - 拖拽时临时移除/重新添加约束

## 📊 关键变量分析

### 洗衣机相关
```javascript
// 基础尺寸 (可统一管理)
const MACHINE_BASE_WIDTH = 144;
const MACHINE_BASE_HEIGHT = 200;
const MACHINE_SCALE = 1.5;  // 物理体缩放
const SPRITE_SCALE = 2;     // 视觉缩放

// 当前位置
let machineTopY = window.innerHeight * 0.65;
let machine = Bodies.rectangle(
  window.innerWidth*0.5, 
  machineTopY+40, 
  MACHINE_BASE_WIDTH * MACHINE_SCALE, 
  MACHINE_BASE_HEIGHT * MACHINE_SCALE
);
```

### 软体猫相关
```javascript
// 网格参数 (可统一管理)
const CAT_COLS = 8;
const CAT_ROWS = 6;
const CAT_SPACING = 32;
const CAT_PARTICLE_RADIUS = 12;

// 位置计算
const originX = machine.position.x - (CAT_COLS-1)*CAT_SPACING/2;
const originY = machineTopY + catPinOffset - CAT_ROWS * CAT_SPACING;
```

### 约束系统
```javascript
// 固定约束参数 (可统一管理)
const PIN_STIFFNESS = 0.1;
const PIN_DAMPING = 0.95;
const CAT_PIN_OFFSET = -100;  // 相对于洗衣机上边缘

// 软体约束参数
const SOFT_BODY_STIFFNESS = 0.8;
const SOFT_BODY_DAMPING = 0.8;
```

### 尾巴相关
```javascript
// 尾巴参数 (可统一管理)
const TAIL_SEGMENTS = 9;
const TAIL_LENGTH = 24;
const TAIL_RADIUS = 8;
const TAIL_STIFFNESS = 0.8;
const TAIL_DAMPING = 0.1;
```

## 🔧 可优化的问题

### 1. 变量分散，缺乏统一管理
**问题**: 相关参数分散在代码各处，难以维护
**建议**: 创建配置对象统一管理

```javascript
const CONFIG = {
  machine: {
    baseWidth: 144,
    baseHeight: 200,
    physicsScale: 1.5,
    spriteScale: 2,
    topOffset: 40
  },
  cat: {
    cols: 8,
    rows: 6,
    spacing: 32,
    particleRadius: 12,
    pinOffset: -100
  },
  constraints: {
    pin: { stiffness: 0.1, damping: 0.95 },
    softBody: { stiffness: 0.8, damping: 0.8 },
    tail: { stiffness: 0.8, damping: 0.1 }
  }
};
```

### 2. 位置计算逻辑复杂
**问题**: 洗衣机位置、猫的位置、约束位置计算分散
**建议**: 创建位置计算函数

```javascript
function getMachineTopEdge() {
  return machine.position.y - (MACHINE_BASE_HEIGHT * MACHINE_SCALE) / 2;
}

function getCatOriginPosition() {
  return {
    x: machine.position.x - (CAT_COLS-1)*CAT_SPACING/2,
    y: getMachineTopEdge() + CAT_PIN_OFFSET - CAT_ROWS * CAT_SPACING
  };
}
```

### 3. 拖拽检测区域硬编码
**问题**: 拖拽检测区域与洗衣机尺寸不同步
**建议**: 动态计算检测区域

```javascript
function getMachineBounds() {
  const halfWidth = (MACHINE_BASE_WIDTH * MACHINE_SCALE) / 2;
  const halfHeight = (MACHINE_BASE_HEIGHT * MACHINE_SCALE) / 2;
  return {
    left: machine.position.x - halfWidth,
    right: machine.position.x + halfWidth,
    top: machine.position.y - halfHeight,
    bottom: machine.position.y + halfHeight
  };
}
```

### 4. 约束管理逻辑重复
**问题**: 创建约束和重新添加约束的逻辑重复
**建议**: 创建约束管理函数

```javascript
function createPinConstraints() {
  pinConstraints = [];
  // 前面3个约束点
  for (let i = 0; i < 3; i++) {
    const index = (CAT_ROWS-1)*CAT_COLS + i;
    pinConstraints.push(createPinConstraint(index));
  }
  // 后面3个约束点
  for (let i = 0; i < 3; i++) {
    const index = (CAT_ROWS-1)*CAT_COLS + (CAT_COLS-1-i);
    pinConstraints.push(createPinConstraint(index));
  }
}

function updatePinConstraints() {
  pinConstraints.forEach(pin => {
    pin.pointB.x = pin.bodyA.position.x;
    pin.pointB.y = getMachineTopEdge() + CAT_PIN_OFFSET;
  });
}
```

## 🎯 建议的代码重构

### 1. 配置集中化
将所有魔法数字提取到配置对象中

### 2. 函数模块化
将复杂逻辑拆分为独立函数

### 3. 位置计算统一
创建统一的位置计算系统

### 4. 约束管理优化
简化约束的创建、更新、移除逻辑

### 5. 事件处理优化
将拖拽逻辑封装为独立模块

## 🚀 未来扩展

- **更多桌宠** - 支持多种动物
- **自定义皮肤** - 可更换猫的贴图
- **物理参数调节** - 实时调整物理参数
- **动画系统** - 添加更多动画效果
- **音效系统** - 添加环境音效

## 📝 使用说明

1. **拖拽洗衣机** - 移动整个系统
2. **按 V 键** - 切换物理网格显示
3. **按 R 键** - 重置猫的形状
4. **拖拽软体猫** - 在洗衣机边缘移动

## 🚀 快速开始

1. 确保有 `cat.png` 和 `washing_machine.png` 文件
2. 在浏览器中打开 `index.html`
3. 享受你的软体猫桌宠！

## 📁 文件结构

```
softcat/
├── index.html              # 主文件
├── cat.png                 # 猫的贴图
├── washing_machine.png     # 洗衣机贴图
└── README.md              # 说明文档
```

## 🛠️ 技术栈

- **Pixi.js 7** - 2D 渲染引擎
- **Matter.js 0.19** - 2D 物理引擎
- **HTML5 Canvas** - 渲染目标
- **ES6+ JavaScript** - 编程语言
