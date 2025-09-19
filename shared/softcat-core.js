// shared/softcat-core.js - 修复版本
// 解决可见性、初始化时机和状态管理问题

(function() {
  'use strict';

  // 防止重复加载
  if (window.SoftCatLoaded) {
    console.log('🐱 [SOFTCAT] 软体猫已经加载过了');
    return;
  }

  console.log('🐱 [SOFTCAT] 开始初始化软体猫...');

  // 软体猫管理器
  class SoftCatManager {
    constructor() {
      this.maxWaitTime = 15000;
      this.checkInterval = 200;
      this.isInitialized = false;
      this.isRunning = false;
      this.p5Instance = null;
      this.engine = null;
      this.runner = null;
      this.render = null;
      
      // 游戏对象
      this.machine = null;
      this.softBody = null;
      this.pinConstraints = [];
      this.tailSegments = [];
      
      // 状态标志
      this.machineReady = false;
      this.softBodyReady = false;
      this.imagesLoaded = false;
      this.showVisualization = false;
      
      // 点击选项
      this.showClickOptions = false;
      this.clickOptions = [
        { id: 'collect-tabs', text: '一键收Tab', icon: '📋', action: 'collectTabs' },
        { id: 'laundry-room', text: '洗衣房', icon: '🏠', action: 'laundryRoom' },
        { id: 'search-history', text: '查询记录', icon: '🔍', action: 'searchHistory' }
      ];
      
      // 拖拽状态
      this.isDraggingMachine = false;
      this.dragOffset = { x: 0, y: 0 };
      this.initialMachinePos = { x: 0, y: 0 };
      this.initialSoftBodyPositions = [];
      
      // 图片资源
      this.images = {
        washingMachine: null,
        cat: null,
        catBody: null
      };
      
      // 配置
      this.CONFIG = {
        machine: {
          baseWidth: 144,
          baseHeight: 200,
          physicsScale: 1.5,
          spriteScale: 2,
          topOffset: 40,
          topYRatio: 0.65
        },
        cat: {
          cols: 8,
          rows: 6,
          spacing: 32,
          particleRadius: 12,
          pinOffset: -30
        },
        constraints: {
          pin: { stiffness: 0.3, damping: 0.9 },
          softBody: { stiffness: 0.9, damping: 0.8 },
          tail: { stiffness: 0.8, damping: 0.1 }
        },
        tail: {
          segments: 9,
          length: 24,
          radius: 8
        },
        physics: {
          constraintIterations: 25,
          positionIterations: 25,
          velocityIterations: 15,
          gravity: { x: 0, y: 0.1 }
        }
      };
    }

    // 主初始化方法
    async init() {
      try {
        console.log('🔄 [SOFTCAT] 开始初始化流程...');
        
        // 等待库文件加载
        await this.waitForLibraries();
        
        // 创建容器和画布
        this.createContainer();

      // 初始化p5.js
        await this.initP5();
        
        // 等待图片加载
        await this.loadImages();
        
        // 初始化物理引擎
        this.initMatter();
        
        // 创建游戏对象
        await this.createGameObjects();
        
        // 设置交互
        this.setupInteractions();
        
        // 标记初始化完成
        this.isInitialized = true;
        window.SoftCatLoaded = true;
        
        // 暴露API
        this.exposeSoftCatAPI();
        
        console.log('✅ [SOFTCAT] 软体猫初始化完成！');
        
        // 显示快捷键提示
        setTimeout(() => {
          this.showKeyboardShortcuts();
        }, 2000);
        
      } catch (error) {
        console.error('❌ [SOFTCAT] 初始化失败:', error);
        this.showError(error.message);
        throw error;
      }
    }

    // 等待库文件加载
    waitForLibraries() {
      console.log('⏳ [SOFTCAT] 等待库文件加载...');
      
      return new Promise((resolve, reject) => {
        let waitTime = 0;
        
        const checkLibraries = () => {
          const p5Loaded = typeof p5 !== 'undefined';
          const matterLoaded = typeof Matter !== 'undefined';
          
          if (p5Loaded && matterLoaded) {
            console.log('✅ [SOFTCAT] 所有库文件已加载');
            resolve();
            return;
          }
          
          waitTime += this.checkInterval;
          if (waitTime >= this.maxWaitTime) {
            reject(new Error('库文件加载超时'));
            return;
          }
          
          setTimeout(checkLibraries, this.checkInterval);
        };
        
        checkLibraries();
      });
    }

    // 创建容器
    createContainer() {
      // 检查是否已存在
      let container = document.getElementById('softcat-container');
      if (container) {
        container.remove();
      }

      // 创建新容器
      container = document.createElement('div');
      container.id = 'softcat-container';
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 2147483647;
        overflow: hidden;
      `;

      document.body.appendChild(container);
      console.log('✅ [SOFTCAT] 容器已创建');
      return container;
    }

      // 初始化p5.js
    initP5() {
      return new Promise((resolve, reject) => {
        console.log('🎨 [SOFTCAT] 初始化p5.js...');
        
        const container = document.getElementById('softcat-container');
        if (!container) {
          reject(new Error('找不到容器元素'));
          return;
        }

        try {
          this.p5Instance = new p5((p) => {
          p.setup = () => {
              console.log('🎨 [SOFTCAT] p5.js setup开始');
              
              // 创建画布
            const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
              canvas.parent('softcat-container');
              
              // 设置画布属性
              const canvasElement = canvas.canvas;
              canvasElement.id = 'softcat-canvas';
              canvasElement.style.pointerEvents = 'none'; // 允许页面穿透
              
              console.log('✅ [SOFTCAT] p5.js画布已创建');
              resolve();
          };
          
          p.draw = () => {
              // 清除画布（保持透明）
              p.clear();
              
              // 只有在初始化完成后才绘制
              if (!this.isInitialized) {
                return;
              }
              
              // 绘制洗衣机
              if (this.machineReady && this.machine) {
                this.drawWashingMachine(p);
            }
            
            // 绘制软体猫
              if (this.softBodyReady && this.softBody && this.softBody.bodies) {
                this.drawSoftCat(p);
            }
            
            // 绘制尾巴
              if (this.tailSegments.length > 0) {
                this.drawTail(p);
              }
              
              // 应用洗衣机震动效果
              this.applyWashingMachineEffect();
              
              // 绘制点击选项
              this.drawClickOptions(p);
            };

            // 处理窗口大小变化
            p.windowResized = () => {
              p.resizeCanvas(window.innerWidth, window.innerHeight);
            };
          });
          
        } catch (error) {
          reject(error);
        }
      });
    }

    // 加载图片资源
    loadImages() {
      return new Promise((resolve, reject) => {
        console.log('🖼️ [SOFTCAT] 开始加载图片资源...');
        
        if (!this.p5Instance) {
          reject(new Error('p5实例不存在'));
          return;
        }

        const extensionUrl = chrome.runtime.getURL('');
        const imageUrls = {
          washingMachine: extensionUrl + 'assets/images/washing_machine.png',
          cat: extensionUrl + 'assets/images/cat.png',
          catBody: extensionUrl + 'assets/images/cat_body.png'
        };

        let loadedCount = 0;
        const totalImages = Object.keys(imageUrls).length;

        const checkComplete = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            this.imagesLoaded = true;
            console.log('✅ [SOFTCAT] 所有图片加载完成');
            resolve();
          }
        };

        // 使用p5的loadImage函数
        Object.entries(imageUrls).forEach(([key, url]) => {
          // 先尝试预加载检查
          const img = new Image();
          img.onload = () => {
            // 图片存在，使用p5加载
            this.images[key] = this.p5Instance.loadImage(url, 
              () => {
                console.log(`✅ [SOFTCAT] ${key}图片加载成功`);
                checkComplete();
              },
              () => {
                console.warn(`⚠️ [SOFTCAT] ${key}图片加载失败，使用备用绘制`);
                checkComplete();
              }
            );
          };
          img.onerror = () => {
            console.warn(`⚠️ [SOFTCAT] ${key}图片不存在，使用备用绘制`);
            checkComplete();
          };
          img.src = url;
        });

        // 设置超时
        setTimeout(() => {
          if (!this.imagesLoaded) {
            console.warn('⚠️ [SOFTCAT] 图片加载超时，使用备用绘制');
            this.imagesLoaded = true;
            resolve();
          }
        }, 5000);
      });
      }

      // 初始化物理引擎
    initMatter() {
      console.log('🔧 [SOFTCAT] 初始化物理引擎...');
      
      const { Engine, Runner, Render } = Matter;
      
      this.engine = Engine.create({
        constraintIterations: this.CONFIG.physics.constraintIterations,
        positionIterations: this.CONFIG.physics.positionIterations,
        velocityIterations: this.CONFIG.physics.velocityIterations,
        enableSleeping: false
      });
      
      this.engine.world.gravity.x = this.CONFIG.physics.gravity.x;
      this.engine.world.gravity.y = this.CONFIG.physics.gravity.y;
      
      this.runner = Runner.create({
          delta: 1000 / 60,
          isFixed: true
        });
        
      // 🔥 关键修复：立即启动物理引擎
      Runner.run(this.runner, this.engine);
      console.log('✅ [SOFTCAT] 物理引擎已启动');
      
      // 创建调试渲染器（默认隐藏）
      this.render = Render.create({
          canvas: document.createElement('canvas'),
        engine: this.engine,
          options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: true,
            background: 'transparent',
            showAngleIndicator: false,
            showVelocity: false,
          showCollisions: false
        }
      });
      
      // 添加调试画布到页面（隐藏）
      this.render.canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2147483646;
        pointer-events: none;
        display: none;
      `;
      document.body.appendChild(this.render.canvas);
      
      Render.run(this.render);
      
      console.log('✅ [SOFTCAT] 物理引擎已初始化');
    }

    // 创建游戏对象
    async createGameObjects() {
      console.log('🎯 [SOFTCAT] 创建游戏对象...');
      
      await this.createMachine();
      await this.createSoftBody();
      await this.createTail();
      
      // 延迟添加约束，让软体稳定
      setTimeout(() => {
        this.createPinConstraints();
        console.log('✅ [SOFTCAT] 所有游戏对象创建完成');
      }, 500);
      }

      // 创建洗衣机
    createMachine() {
      const { Bodies, World } = Matter;
      
      const machineTopY = window.innerHeight * this.CONFIG.machine.topYRatio;
      this.machine = Bodies.rectangle(
          window.innerWidth * 0.5, 
        machineTopY + this.CONFIG.machine.topOffset,
        this.CONFIG.machine.baseWidth * this.CONFIG.machine.physicsScale,
        this.CONFIG.machine.baseHeight * this.CONFIG.machine.physicsScale,
          { 
            isStatic: true, 
          render: { fillStyle: '#888888' }
        }
      );
      
      World.add(this.engine.world, this.machine);
      this.machineReady = true;
      console.log('🏠 [SOFTCAT] 洗衣机已创建');
    }

    // 创建软体猫
    createSoftBody() {
      const { Composites, World, Body } = Matter;
      
      const originPos = this.getCatOriginPosition();
      
      this.softBody = Composites.softBody(
        originPos.x, originPos.y, 
        this.CONFIG.cat.cols, this.CONFIG.cat.rows, 
        0, 0, true, this.CONFIG.cat.particleRadius,
          { 
            frictionAir: 0.3,
            restitution: 0.1,
            inertia: Infinity,
            friction: 0.8,
            density: 0.001,
          render: { fillStyle: '#ff6b6b' }
        },
        { 
          stiffness: this.CONFIG.constraints.softBody.stiffness,
          damping: this.CONFIG.constraints.softBody.damping,
          render: { strokeStyle: '#ffff00' }
        }
      );
      
      // 设置正确的粒子位置
      this.softBody.bodies.forEach((body, index) => {
        const row = Math.floor(index / this.CONFIG.cat.cols);
        const col = index % this.CONFIG.cat.cols;
        const x = originPos.x + col * this.CONFIG.cat.spacing;
        const y = originPos.y + row * this.CONFIG.cat.spacing;
          Body.setPosition(body, { x, y });
          Body.setVelocity(body, { x: 0, y: 0 });
          Body.setAngularVelocity(body, 0);
        });
        
      World.add(this.engine.world, this.softBody);
      this.softBodyReady = true;
      console.log('🐱 [SOFTCAT] 软体猫已创建，粒子数:', this.softBody.bodies.length);
    }

    // 创建尾巴
    createTail() {
      const { Bodies, World, Constraint } = Matter;
      
      const tailBase = this.softBody.bodies[(this.CONFIG.cat.rows - 1) * this.CONFIG.cat.cols + (this.CONFIG.cat.cols - 1)];
        let prev = tailBase;
        
      this.tailSegments = [];
      
      for (let i = 0; i < this.CONFIG.tail.segments; i++) {
          const seg = Bodies.circle(
          tailBase.position.x + (i + 1) * this.CONFIG.tail.length,
            tailBase.position.y,
          this.CONFIG.tail.radius,
            { 
              frictionAir: 0.1,
              friction: 0.5,
              restitution: 0.1,
              density: 0.0003,
            render: { fillStyle: '#ff8800' }
            }
          );
          
          const link = Constraint.create({ 
            bodyA: prev, 
            bodyB: seg, 
          length: this.CONFIG.tail.length, 
          stiffness: this.CONFIG.constraints.tail.stiffness,
          damping: this.CONFIG.constraints.tail.damping
        });
        
        World.add(this.engine.world, [seg, link]);
        this.tailSegments.push({ segment: seg, link: link });
          prev = seg;
      }
      
      console.log('🦊 [SOFTCAT] 尾巴已创建，段数:', this.tailSegments.length);
      }

      // 创建约束
    createPinConstraints() {
      const { Constraint, World } = Matter;
      
      this.pinConstraints = [];
      const bottomRowStart = (this.CONFIG.cat.rows - 1) * this.CONFIG.cat.cols;
      const centerStart = Math.floor((this.CONFIG.cat.cols - 4) / 2);
        
        for (let i = 0; i < 4; i++) {
          const index = bottomRowStart + centerStart + i;
        const particle = this.softBody.bodies[index];
          const constraint = Constraint.create({
            bodyA: particle,
            pointB: { 
              x: particle.position.x, 
            y: this.getMachineTopEdge() + this.CONFIG.cat.pinOffset
            },
            length: 0,
          stiffness: this.CONFIG.constraints.pin.stiffness,
          damping: this.CONFIG.constraints.pin.damping
        });
        this.pinConstraints.push(constraint);
      }
      
      this.pinConstraints.forEach(pin => World.add(this.engine.world, pin));
      console.log('🔗 [SOFTCAT] 约束已创建，数量:', this.pinConstraints.length);
    }

    // 设置交互
    setupInteractions() {
      console.log('🎮 [SOFTCAT] 设置选择性交互...');
      
      // 初始化交互区域
      this.interactionZones = [];
      
      // 全局鼠标事件监听
      document.addEventListener('mousemove', this.handleGlobalMouseMove.bind(this));
      document.addEventListener('mousedown', this.handleGlobalMouseDown.bind(this));
      document.addEventListener('mouseup', this.handleGlobalMouseUp.bind(this));
      
      // 全局点击事件监听（用于关闭选项菜单）
      document.addEventListener('click', this.handleGlobalClick.bind(this));
      
      // 键盘事件
      document.addEventListener('keydown', this.handleKeyDown.bind(this));
      
      console.log('✅ [SOFTCAT] 选择性交互已设置');
    }

    // 绘制方法
    drawWashingMachine(p) {
      if (!this.machine) return;
      
      p.push();
      p.translate(this.machine.position.x, this.machine.position.y);
      p.rotate(this.machine.angle);
      
      if (this.images.washingMachine && this.images.washingMachine.width > 0) {
        const scale = this.CONFIG.machine.physicsScale * 1.3; // 放大1.3倍
        p.imageMode(p.CENTER);
        p.image(this.images.washingMachine, 0, 0, 
          this.CONFIG.machine.baseWidth * scale, 
          this.CONFIG.machine.baseHeight * scale);
      } else {
        // 备用绘制
        p.fill(200, 200, 200);
        p.stroke(150, 150, 150);
        p.strokeWeight(2);
        p.rectMode(p.CENTER);
        p.rect(0, 0, 
          this.CONFIG.machine.baseWidth * this.CONFIG.machine.physicsScale, 
          this.CONFIG.machine.baseHeight * this.CONFIG.machine.physicsScale, 10);
        
        // 洗衣机门
        p.fill(100, 100, 100);
        p.ellipse(0, -this.CONFIG.machine.baseHeight * this.CONFIG.machine.physicsScale * 0.2, 60, 60);
      }
      
      p.pop();
    }

    drawSoftCat(p) {
      if (!this.softBody || !this.softBody.bodies) return;
      
      p.push();
      
      // 计算软体猫的边界框
      const bodies = this.softBody.bodies;
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      
      for (let body of bodies) {
        minX = Math.min(minX, body.position.x);
        maxX = Math.max(maxX, body.position.x);
        minY = Math.min(minY, body.position.y);
        maxY = Math.max(maxY, body.position.y);
      }
      
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      const width = maxX - minX;
      const height = maxY - minY;
      
      // 绘制单个猫图像覆盖整个软体
      if (this.images.cat && this.images.cat.width > 0) {
        p.imageMode(p.CENTER);
        p.image(this.images.cat, centerX, centerY, width, height);
      } else {
        // 备用绘制 - 绘制软体轮廓
        p.fill(255, 107, 107, 150);
        p.stroke(255, 107, 107);
        p.strokeWeight(2);
        p.noFill();
        
        // 绘制软体边界
        p.beginShape();
        for (let body of bodies) {
          p.vertex(body.position.x, body.position.y);
        }
        p.endShape(p.CLOSE);
        
        // 绘制粒子点（调试用）
        p.fill(255, 107, 107, 200);
        p.noStroke();
        for (let body of bodies) {
          p.ellipse(body.position.x, body.position.y, this.CONFIG.cat.particleRadius * 2);
        }
      }
      
      // 绘制约束线（调试模式）
      if (this.showVisualization) {
        p.stroke(255, 255, 0, 100);
        p.strokeWeight(1);
        p.noFill();
        
        for (let constraint of this.softBody.constraints) {
          if (constraint.bodyA && constraint.bodyB) {
            p.line(
              constraint.bodyA.position.x, constraint.bodyA.position.y,
              constraint.bodyB.position.x, constraint.bodyB.position.y
            );
          }
        }
      }
      
      // 调试：显示交互区域
      if (this.showVisualization) {
        this.updateInteractionZones();
        p.stroke(0, 255, 0, 150);
        p.strokeWeight(2);
        p.noFill();
        
        for (let zone of this.interactionZones) {
          p.rect(zone.x, zone.y, zone.width, zone.height);
          
          p.fill(0, 255, 0);
          p.textSize(12);
          p.text(zone.type, zone.x + 5, zone.y + 15);
          p.noFill();
        }
      }
      
      p.pop();
    }

    drawTail(p) {
      p.push();
      p.fill(255, 140, 0, 200);
      p.stroke(255, 140, 0);
      p.strokeWeight(1);
      
      for (let tailPart of this.tailSegments) {
        const seg = tailPart.segment;
        p.ellipse(seg.position.x, seg.position.y, this.CONFIG.tail.radius * 2);
      }
      
      p.pop();
    }

    // 辅助方法
    getCatOriginPosition() {
      return {
        x: this.machine.position.x - (this.CONFIG.cat.cols - 1) * this.CONFIG.cat.spacing / 2,
        y: this.getMachineTopEdge() + this.CONFIG.cat.pinOffset - this.CONFIG.cat.rows * this.CONFIG.cat.spacing
      };
    }

    getMachineTopEdge() {
      return this.machine.position.y - (this.CONFIG.machine.baseHeight * this.CONFIG.machine.physicsScale) / 2;
    }

    // 更新交互区域
    updateInteractionZones() {
      this.interactionZones = [];
      
      // 洗衣机交互区域
      if (this.machine) {
        const padding = 10;
        const halfWidth = (this.CONFIG.machine.baseWidth * this.CONFIG.machine.physicsScale) / 2;
        const halfHeight = (this.CONFIG.machine.baseHeight * this.CONFIG.machine.physicsScale) / 2;
        
        this.interactionZones.push({
          type: 'machine',
          x: this.machine.position.x - halfWidth - padding,
          y: this.machine.position.y - halfHeight - padding,
          width: (halfWidth + padding) * 2,
          height: (halfHeight + padding) * 2
        });
      }
      
      // 软体猫交互区域
      if (this.softBody && this.softBody.bodies) {
        const bodies = this.softBody.bodies;
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        
        for (let body of bodies) {
          minX = Math.min(minX, body.position.x);
          maxX = Math.max(maxX, body.position.x);
          minY = Math.min(minY, body.position.y);
          maxY = Math.max(maxY, body.position.y);
        }
        
        const padding = 30;
        this.interactionZones.push({
          type: 'softcat',
          x: minX - padding,
          y: minY - padding,
          width: (maxX - minX) + padding * 2,
          height: (maxY - minY) + padding * 2
        });
      }
    }

    // 更新基础交互区域（不覆盖选项菜单区域）
    updateBasicInteractionZones() {
      // 保存选项菜单区域
      const optionsZone = this.interactionZones.find(zone => zone.type === 'options');
      
      // 清空并重新添加基础区域
      this.interactionZones = this.interactionZones.filter(zone => zone.type !== 'machine' && zone.type !== 'softcat');
      
      // 洗衣机交互区域
      if (this.machine) {
        const padding = 10;
        const halfWidth = (this.CONFIG.machine.baseWidth * this.CONFIG.machine.physicsScale) / 2;
        const halfHeight = (this.CONFIG.machine.baseHeight * this.CONFIG.machine.physicsScale) / 2;
        
        this.interactionZones.push({
          type: 'machine',
          x: this.machine.position.x - halfWidth - padding,
          y: this.machine.position.y - halfHeight - padding,
          width: (halfWidth + padding) * 2,
          height: (halfHeight + padding) * 2
        });
      }
      
      // 软体猫交互区域
      if (this.softBody && this.softBody.bodies) {
        const bodies = this.softBody.bodies;
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        
        for (let body of bodies) {
          minX = Math.min(minX, body.position.x);
          maxX = Math.max(maxX, body.position.x);
          minY = Math.min(minY, body.position.y);
          maxY = Math.max(maxY, body.position.y);
        }
        
        const padding = 30;
        this.interactionZones.push({
          type: 'softcat',
          x: minX - padding,
          y: minY - padding,
          width: (maxX - minX) + padding * 2,
          height: (maxY - minY) + padding * 2
        });
      }
      
      // 恢复选项菜单区域
      if (optionsZone) {
        this.interactionZones.push(optionsZone);
      }
    }

    // 更新选项菜单交互区域
    updateOptionsInteractionZone(x, y, width, height) {
      // 移除旧的选项菜单交互区域
      this.interactionZones = this.interactionZones.filter(zone => zone.type !== 'options');
      
      // 添加新的选项菜单交互区域，增加一些padding让点击更容易
      const padding = 5;
      this.interactionZones.push({
        type: 'options',
        x: x - padding,
        y: y - padding,
        width: width + padding * 2,
        height: height + padding * 2
      });
    }

    // 检查点是否在交互区域
    isPointInInteractionZone(x, y) {
      // 只更新基础交互区域（洗衣机和软体猫），不覆盖选项菜单区域
      this.updateBasicInteractionZones();
      
      for (let zone of this.interactionZones) {
        if (x >= zone.x && x <= zone.x + zone.width &&
            y >= zone.y && y <= zone.y + zone.height) {
          return zone;
        }
      }
      return null;
    }

    // 切换点击选项显示状态
    toggleClickOptions(mouseX, mouseY) {
      if (this.showClickOptions) {
        // 如果已经显示，则隐藏
        this.showClickOptions = false;
        console.log('🎯 [SOFTCAT] 隐藏选项菜单');
      } else {
        // 如果未显示，则显示
        this.showClickOptions = true;
        this.clickOptionsX = mouseX;
        this.clickOptionsY = mouseY;
        console.log('🎯 [SOFTCAT] 显示选项菜单');
      }
    }

    // 绘制点击选项
    drawClickOptions(p) {
      if (!this.showClickOptions || !this.clickOptionsX || !this.clickOptionsY) return;
      
      p.push();
      
      const optionsWidth = 200;
      const optionHeight = 40;
      const spacing = 8;
      const totalHeight = this.clickOptions.length * (optionHeight + spacing) - spacing;
      
      // 计算位置（避免超出屏幕边界）
      let x = this.clickOptionsX + 20;
      let y = this.clickOptionsY - totalHeight / 2;
      
      if (x + optionsWidth > p.width) x = this.clickOptionsX - optionsWidth - 20;
      if (y < 0) y = 10;
      if (y + totalHeight > p.height) y = p.height - totalHeight - 10;
      
      // 存储实际位置，供点击检测使用
      this.actualOptionsX = x;
      this.actualOptionsY = y;
      this.actualOptionsWidth = optionsWidth;
      this.actualOptionsHeight = totalHeight;
      
      // 更新选项菜单的交互区域
      this.updateOptionsInteractionZone(x, y, optionsWidth, totalHeight);
      
      // 绘制背景
      p.fill(255, 255, 255, 250);
      p.stroke(200, 200, 200);
      p.strokeWeight(2);
      p.rect(x, y, optionsWidth, totalHeight, 8);
      
      // 绘制选项
      this.clickOptions.forEach((option, index) => {
        const optionY = y + index * (optionHeight + spacing);
        
        // 悬停效果 - 使用实际鼠标位置
        const rect = document.getElementById('softcat-canvas')?.getBoundingClientRect();
        let realMouseX = 0, realMouseY = 0;
        
        if (rect && this.lastMouseEvent) {
          realMouseX = this.lastMouseEvent.clientX - rect.left;
          realMouseY = this.lastMouseEvent.clientY - rect.top;
        }
        
        const mouseInOption = realMouseX >= x && realMouseX <= x + optionsWidth &&
                             realMouseY >= optionY && realMouseY <= optionY + optionHeight;
        
        if (mouseInOption) {
          p.fill(230, 240, 255, 250);
        } else {
          p.fill(255, 255, 255, 250);
        }
        
        p.noStroke();
        p.rect(x, optionY, optionsWidth, optionHeight, 6);
        
        // 绘制图标和文字
        p.fill(100, 100, 100);
        p.textSize(18);
        p.textAlign(p.LEFT, p.CENTER);
        p.text(option.icon, x + 15, optionY + optionHeight / 2);
        
        p.fill(60, 60, 60);
        p.textSize(14);
        p.text(option.text, x + 45, optionY + optionHeight / 2);
      });
      
      p.pop();
    }

    // 处理点击选项点击
    handleClickOptionClick(mouseX, mouseY) {
      if (!this.showClickOptions || !this.actualOptionsX) return false;
      
      const optionHeight = 40;
      const spacing = 8;
      
      console.log('🎯 [SOFTCAT] 检测选项点击:', {
        mouseX, mouseY, 
        actualX: this.actualOptionsX, 
        actualY: this.actualOptionsY,
        actualWidth: this.actualOptionsWidth,
        actualHeight: this.actualOptionsHeight
      });
      
      // 使用缓存的实际位置
      const x = this.actualOptionsX;
      const y = this.actualOptionsY;
      const optionsWidth = this.actualOptionsWidth;
      
      for (let i = 0; i < this.clickOptions.length; i++) {
        const optionY = y + i * (optionHeight + spacing);
        
        console.log(`检查选项 ${i}:`, {
          optionBounds: { x, y: optionY, width: optionsWidth, height: optionHeight },
          mousePos: { mouseX, mouseY }
        });
        
        if (mouseX >= x && mouseX <= x + optionsWidth &&
            mouseY >= optionY && mouseY <= optionY + optionHeight) {
          
          console.log('✅ [SOFTCAT] 点击了选项:', this.clickOptions[i].text);
          this.executeClickOption(this.clickOptions[i].action);
          return true;
        }
      }
      
      return false;
    }

    // 执行点击选项动作
    executeClickOption(action) {
      console.log('🎯 [SOFTCAT] 执行点击选项:', action);
      
      // 执行动作后隐藏选项菜单
      this.showClickOptions = false;
      
      switch (action) {
        case 'collectTabs':
          this.collectAllTabs();
          break;
        case 'laundryRoom':
          this.openLaundryRoom();
          break;
        case 'searchHistory':
          this.openSearchHistory();
          break;
        default:
          console.warn('未知的点击选项动作:', action);
      }
    }

    // 一键收Tab功能
    collectAllTabs() {
      console.log('📋 [SOFTCAT] 执行一键收Tab功能');
      
      // 检查chrome.runtime是否可用
      if (!chrome.runtime) {
        console.error('❌ [SOFTCAT] chrome.runtime 不可用');
        this.showNotification('扩展环境不可用', 'error');
        return;
      }
      
      // 发送消息给background script收集所有tab
      chrome.runtime.sendMessage({ action: 'collectAllTabs' }, (response) => {
        console.log('📨 [SOFTCAT] 收到background响应:', response);
        
        if (chrome.runtime.lastError) {
          console.error('❌ [SOFTCAT] chrome.runtime错误:', chrome.runtime.lastError);
          this.showNotification('通信失败: ' + chrome.runtime.lastError.message, 'error');
          return;
        }
        
        if (response && response.success) {
          console.log('✅ [SOFTCAT] 一键收Tab成功:', response);
          this.showNotification(`已收集 ${response.count} 个标签页，关闭了 ${response.closedCount} 个，正在打开洗衣房...`);
        } else {
          console.error('❌ [SOFTCAT] 一键收Tab失败:', response?.error);
          this.showNotification('一键收Tab失败: ' + (response?.error || '未知错误'), 'error');
        }
      });
    }

    // 打开洗衣房
    openLaundryRoom() {
      console.log('🏠 [SOFTCAT] 打开洗衣房');
      
      // 检查chrome.runtime是否可用
      if (!chrome.runtime) {
        console.error('❌ [SOFTCAT] chrome.runtime 不可用');
        this.showNotification('扩展环境不可用', 'error');
        return;
      }
      
      // 发送消息给background script打开洗衣房页面
      chrome.runtime.sendMessage({ action: 'openLaundryRoom' }, (response) => {
        console.log('📨 [SOFTCAT] 收到background响应:', response);
        
        if (chrome.runtime.lastError) {
          console.error('❌ [SOFTCAT] chrome.runtime错误:', chrome.runtime.lastError);
          this.showNotification('通信失败: ' + chrome.runtime.lastError.message, 'error');
          return;
        }
        
        if (response && response.success) {
          console.log('✅ [SOFTCAT] 洗衣房已打开');
          this.showNotification('洗衣房已打开');
        } else {
          console.error('❌ [SOFTCAT] 洗衣房打开失败:', response?.error);
          this.showNotification('洗衣房打开失败: ' + (response?.error || '未知错误'), 'error');
        }
      });
    }

    // 打开查询记录（placeholder）
    openSearchHistory() {
      console.log('🔍 [SOFTCAT] 打开查询记录（功能开发中）');
      this.showNotification('查询记录功能开发中...', 'info');
    }

    // 显示快捷键提示
    showKeyboardShortcuts() {
      console.log('⌨️ [SOFTCAT] 快捷键提示:');
      console.log('  Ctrl+1: 一键收Tab');
      console.log('  Ctrl+2: 打开洗衣房');
      console.log('  Ctrl+3: 打开查询记录');
      console.log('  V: 切换调试模式');
      console.log('  R: 重置软体猫形状');
      
      this.showNotification('快捷键: Ctrl+1收Tab, Ctrl+2洗衣房, Ctrl+3查询', 'info');
    }

    // 显示通知
    showNotification(message, type = 'success') {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff6b6b' : type === 'info' ? '#4facfe' : '#51cf66'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 14px;
        font-weight: 500;
        z-index: 2147483647;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        max-width: 300px;
        text-align: center;
      `;
      notification.textContent = message;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 3000);
    }

    // 应用洗衣机震动效果
    applyWashingMachineEffect() {
      if (!this.machine || !this.softBody || !this.isRunning) return;
      
      const { Body } = Matter;
      const t = Date.now() * 0.001;
      const bottomRowStart = (this.CONFIG.cat.rows - 1) * this.CONFIG.cat.cols;
      const centerStart = Math.floor((this.CONFIG.cat.cols - 4) / 2);
      
      for (let i = 0; i < 4; i++) {
        const index = bottomRowStart + centerStart + i;
        if (this.softBody.bodies[index]) {
          Body.applyForce(this.softBody.bodies[index], this.softBody.bodies[index].position, { 
            x: Math.sin(t * 3 + i) * 0.00005,
            y: Math.cos(t * 2 + i) * 0.00002
          });
        }
      }
    }

    // 全局鼠标移动处理
    handleGlobalMouseMove(e) {
      const canvas = document.getElementById('softcat-canvas');
      if (!canvas) return;
      
      // 保存鼠标事件
      this.lastMouseEvent = e;
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const zone = this.isPointInInteractionZone(mouseX, mouseY);
      
      // 动态切换指针事件和光标
      if (zone) {
        canvas.style.pointerEvents = 'auto';
        
        // 根据交互区域类型设置不同的光标
        if (zone.type === 'options') {
          canvas.style.cursor = 'pointer';
        } else if (zone.type === 'machine') {
          canvas.style.cursor = this.isDraggingMachine ? 'grabbing' : 'grab';
        } else if (zone.type === 'softcat') {
          canvas.style.cursor = 'pointer';
        } else {
          canvas.style.cursor = 'default';
        }
      } else {
        canvas.style.pointerEvents = 'none';
        canvas.style.cursor = 'default';
      }
      
      // 处理拖拽
      if (this.isDraggingMachine) {
        this.updateDragging(mouseX, mouseY);
        e.preventDefault();
      }
    }

    // 全局鼠标按下
    handleGlobalMouseDown(e) {
      const canvas = document.getElementById('softcat-canvas');
      if (!canvas) return;
      
      // 保存鼠标事件，供绘制时使用
      this.lastMouseEvent = e;
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const zone = this.isPointInInteractionZone(mouseX, mouseY);
      
      console.log('🎯 [SOFTCAT] 鼠标按下:', {
        mouseX, mouseY, 
        zone: zone?.type, 
        showClickOptions: this.showClickOptions,
        pointerEvents: canvas.style.pointerEvents
      });
      
      if (zone) {
        // 如果是选项菜单区域，处理选项点击
        if (zone.type === 'options') {
          console.log('🎯 [SOFTCAT] 检测到选项菜单区域点击');
          // 给一个小延迟，确保绘制完成
          setTimeout(() => {
            if (this.handleClickOptionClick(mouseX, mouseY)) {
              console.log('✅ [SOFTCAT] 选项点击处理成功');
            } else {
              console.log('⚠️ [SOFTCAT] 选项点击处理失败');
            }
          }, 10);
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        // 如果是软体猫区域，切换选项显示状态
        else if (zone.type === 'softcat') {
          // 如果选项菜单已显示，先检查是否点击了选项
          if (this.showClickOptions) {
            setTimeout(() => {
              if (!this.handleClickOptionClick(mouseX, mouseY)) {
                // 如果没有点击选项，则切换菜单状态
                this.toggleClickOptions(mouseX, mouseY);
              }
            }, 10);
          } else {
            // 如果选项菜单未显示，直接显示
            this.toggleClickOptions(mouseX, mouseY);
          }
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        // 如果是洗衣机区域，开始拖拽
        else if (zone.type === 'machine') {
          // 如果选项菜单显示，先关闭
          if (this.showClickOptions) {
            this.showClickOptions = false;
          }
          this.startDragging(mouseX, mouseY);
          canvas.style.cursor = 'grabbing';
          e.preventDefault();
          e.stopPropagation();
        }
      } else {
        // 点击画布外部，关闭选项菜单
        if (this.showClickOptions) {
          this.showClickOptions = false;
          console.log('🎯 [SOFTCAT] 点击外部，隐藏选项菜单');
        }
      }
    }

    // 全局鼠标释放
    handleGlobalMouseUp(e) {
      if (this.isDraggingMachine) {
        this.stopDragging();
        
        const canvas = document.getElementById('softcat-canvas');
        if (canvas) {
          canvas.style.cursor = 'grab';
        }
        
        e.preventDefault();
      }
    }

    // 全局点击处理
    handleGlobalClick(e) {
      // 如果点击的不是画布，关闭选项菜单
      const canvas = document.getElementById('softcat-canvas');
      if (canvas && !canvas.contains(e.target) && this.showClickOptions) {
        this.showClickOptions = false;
        console.log('🎯 [SOFTCAT] 点击画布外部，隐藏选项菜单');
      }
    }

    handleKeyDown(e) {
      // 检查是否按下了Ctrl键
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            console.log('⌨️ [SOFTCAT] 快捷键: Ctrl+1 - 一键收Tab');
            this.collectAllTabs();
            break;
          case '2':
            e.preventDefault();
            console.log('⌨️ [SOFTCAT] 快捷键: Ctrl+2 - 打开洗衣房');
            this.openLaundryRoom();
            break;
          case '3':
            e.preventDefault();
            console.log('⌨️ [SOFTCAT] 快捷键: Ctrl+3 - 打开查询记录');
            this.openSearchHistory();
            break;
        }
      } else {
        // 原有的单键快捷键
        if (e.key.toLowerCase() === 'v') {
          this.toggleDebugMode();
        } else if (e.key.toLowerCase() === 'r') {
          this.resetCatShape();
        }
      }
    }

    // 拖拽相关方法
    isPointInMachine(x, y) {
      if (!this.machine) return false;
      
      const halfWidth = (this.CONFIG.machine.baseWidth * this.CONFIG.machine.physicsScale) / 2;
      const halfHeight = (this.CONFIG.machine.baseHeight * this.CONFIG.machine.physicsScale) / 2;
      
      return x >= this.machine.position.x - halfWidth &&
             x <= this.machine.position.x + halfWidth &&
             y >= this.machine.position.y - halfHeight &&
             y <= this.machine.position.y + halfHeight;
    }

    // 检查点击是否在软体猫上
    isPointInSoftCat(x, y) {
      if (!this.softBody || !this.softBody.bodies) return false;
      
      // 检查是否点击在软体猫的边界框内
      const bodies = this.softBody.bodies;
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      
      for (let body of bodies) {
        minX = Math.min(minX, body.position.x);
        maxX = Math.max(maxX, body.position.x);
        minY = Math.min(minY, body.position.y);
        maxY = Math.max(maxY, body.position.y);
      }
      
      return x >= minX && x <= maxX && y >= minY && y <= maxY;
    }

    startDragging(mouseX, mouseY) {
      const { World } = Matter;
      
      this.isDraggingMachine = true;
      this.dragOffset.x = mouseX - this.machine.position.x;
      this.dragOffset.y = mouseY - this.machine.position.y;
      
      this.initialMachinePos = { x: this.machine.position.x, y: this.machine.position.y };
      this.initialSoftBodyPositions = this.softBody.bodies.map(body => ({ 
        x: body.position.x, 
        y: body.position.y 
      }));
      
      // 临时移除约束
      this.pinConstraints.forEach(pin => World.remove(this.engine.world, pin));
    }

    updateDragging(mouseX, mouseY) {
      const { Body } = Matter;
      
      const newX = mouseX - this.dragOffset.x;
      const newY = mouseY - this.dragOffset.y;
      
      const deltaX = newX - this.initialMachinePos.x;
      const deltaY = newY - this.initialMachinePos.y;
      
      Body.setPosition(this.machine, { x: newX, y: newY });
      
      this.softBody.bodies.forEach((body, index) => {
        const initialPos = this.initialSoftBodyPositions[index];
          Body.setPosition(body, {
            x: initialPos.x + deltaX,
            y: initialPos.y + deltaY
          });
        });
      }

    stopDragging() {
      const { World } = Matter;
        
      this.isDraggingMachine = false;
      
      // 重新添加约束
      this.pinConstraints.forEach(pin => {
          pin.pointB.x = pin.bodyA.position.x;
        pin.pointB.y = this.getMachineTopEdge() + this.CONFIG.cat.pinOffset;
        World.add(this.engine.world, pin);
        });
      }

      // 设置鼠标约束
    setupMouseConstraint() {
      const { Mouse, MouseConstraint, World } = Matter;
      
      const canvas = document.getElementById('softcat-canvas');
        const mouse = Mouse.create(canvas);
      const mouseConstraint = MouseConstraint.create(this.engine, { 
          mouse, 
          constraint: { 
            stiffness: 0.2,
            damping: 0.5,
            render: { visible: false } 
          } 
        });
      World.add(this.engine.world, mouseConstraint);
    }

    // 公共API方法
    start() {
      if (!this.isInitialized) {
        console.warn('⚠️ [SOFTCAT] 软体猫未初始化，无法启动');
        return false;
      }
      
      if (this.isRunning) {
        console.log('🐱 [SOFTCAT] 软体猫已在运行');
        return true;
      }
      
      const { Runner } = Matter;
      
      Runner.run(this.runner, this.engine);
      this.isRunning = true;
      
      console.log('✅ [SOFTCAT] 软体猫已启动');
      return true;
    }

    stop() {
      if (!this.isRunning) {
        console.log('🐱 [SOFTCAT] 软体猫未在运行');
        return;
      }
      
      const { Runner } = Matter;
      
      Runner.stop(this.runner);
      this.isRunning = false;
      
      console.log('⏹️ [SOFTCAT] 软体猫已停止');
    }

    destroy() {
      console.log('🗑️ [SOFTCAT] 销毁软体猫...');
      
      // 停止运行
      this.stop();
      
      // 清理p5实例
      if (this.p5Instance) {
        this.p5Instance.remove();
        this.p5Instance = null;
          }
          
          // 移除容器
          const container = document.getElementById('softcat-container');
          if (container) {
            container.remove();
          }
      
      // 移除调试画布
      if (this.render && this.render.canvas) {
        this.render.canvas.remove();
          }
          
          // 清理全局状态
      this.isInitialized = false;
      this.isRunning = false;
          window.SoftCatLoaded = false;
          delete window.SoftCat;
      
      console.log('✅ [SOFTCAT] 软体猫已销毁');
    }

    toggleDebugMode() {
      this.showVisualization = !this.showVisualization;
      
      if (this.render && this.render.canvas) {
        this.render.canvas.style.display = this.showVisualization ? 'block' : 'none';
      }
      
      console.log('🔍 [SOFTCAT] 调试模式:', this.showVisualization ? '开启' : '关闭');
      return this.showVisualization;
    }

    resetCatShape() {
      if (!this.softBody) return;
      
      const { Body } = Matter;
      const originPos = this.getCatOriginPosition();
      
      this.softBody.bodies.forEach((body, index) => {
        const row = Math.floor(index / this.CONFIG.cat.cols);
        const col = index % this.CONFIG.cat.cols;
        const newX = originPos.x + col * this.CONFIG.cat.spacing;
        const newY = originPos.y + row * this.CONFIG.cat.spacing;
        
        Body.setPosition(body, { x: newX, y: newY });
        Body.setVelocity(body, { x: 0, y: 0 });
        Body.setAngularVelocity(body, 0);
      });
      
      console.log('🔄 [SOFTCAT] 猫的形状已重置');
    }

    getStatus() {
      return {
        loaded: this.isInitialized,
        running: this.isRunning,
        debugMode: this.showVisualization,
        machineReady: this.machineReady,
        softBodyReady: this.softBodyReady,
        imagesLoaded: this.imagesLoaded
      };
    }

    // 暴露SoftCat API
    exposeSoftCatAPI() {
      window.SoftCat = {
        start: () => this.start(),
        stop: () => this.stop(),
        destroy: () => this.destroy(),
        toggleDebug: () => this.toggleDebugMode(),
        reset: () => this.resetCatShape(),
        isRunning: () => this.isRunning,
        getStatus: () => this.getStatus()
      };
      
      console.log('🎯 [SOFTCAT] SoftCat API已暴露');
    }

    // 显示错误
    showError(message) {
      console.error('❌ [SOFTCAT] 错误:', message);
      
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 14px;
        font-weight: 500;
        z-index: 2147483647;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        text-align: center;
      `;
      errorDiv.textContent = `软体猫错误: ${message}`;
      document.body.appendChild(errorDiv);
      
      setTimeout(() => {
        if (errorDiv.parentNode) {
          errorDiv.remove();
        }
      }, 5000);
    }
  }

  // 创建并初始化软体猫管理器
  const softCatManager = new SoftCatManager();
  
  // 开始初始化 - 修复函数调用错误
  softCatManager.init().catch(error => {
    console.error('❌ [SOFTCAT] 软体猫管理器初始化失败:', error);
  });

})();