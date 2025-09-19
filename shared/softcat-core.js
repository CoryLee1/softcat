// shared/softcat-core-p5.js - p5.js版本
// 使用p5.js替代PIXI.js，改进库文件检测和初始化逻辑

(function() {
  'use strict';

  // 检查是否已经加载过软体猫
  if (window.SoftCatLoaded) {
    console.log('软体猫已经加载过了');
    return;
  }

  console.log('🐱 [SOFTCAT] 开始初始化软体猫...');

  // 软体猫初始化器
  const SoftCatInitializer = {
    maxWaitTime: 15000, // 最大等待时间 15秒
    checkInterval: 200, // 检查间隔 200ms
    
    async waitForLibraries() {
      console.log('⏳ [SOFTCAT] 等待库文件加载...');
      
      return new Promise((resolve, reject) => {
        let waitTime = 0;
        
        const checkLibraries = () => {
          const p5Loaded = typeof p5 !== 'undefined';
          const matterLoaded = typeof Matter !== 'undefined';
          
          console.log(`🔍 [SOFTCAT] 库文件检查 - p5.js: ${p5Loaded}, Matter.js: ${matterLoaded}`);
          
          if (p5Loaded && matterLoaded) {
            console.log('🎉 [SOFTCAT] 所有库文件已加载，开始初始化软体猫');
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
    },
    
    async init() {
      try {
        // 等待库文件加载
        await this.waitForLibraries();
        
        // 标记为已加载
        window.SoftCatLoaded = true;
        console.log('✅ [SOFTCAT] 软体猫已标记为加载状态');
        
        // 初始化软体猫
        await this.initSoftCat();
        
        console.log('🎉 [SOFTCAT] 软体猫初始化完成！');
        
      } catch (error) {
        console.error('❌ [SOFTCAT] 软体猫初始化失败:', error);
        this.showError(error.message);
      }
    },
    
    async initSoftCat() {
      console.log('🎯 [SOFTCAT] 开始初始化软体猫系统...');
      
      // 创建软体猫容器
      this.createContainer();
      
      // 初始化软体猫系统
      await this.startSoftCat();
    },
    
    createContainer() {
      // 检查是否已存在容器
      let container = document.getElementById('softcat-container');
      if (container) {
        return container;
      }

      // 创建容器
      container = document.createElement('div');
      container.id = 'softcat-container';
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 999999;
        overflow: hidden;
      `;

      // 创建画布
      const canvas = document.createElement('canvas');
      canvas.id = 'softcat-canvas';
      canvas.style.cssText = `
        width: 100%;
        height: 100%;
        pointer-events: none;
      `;

      container.appendChild(canvas);
      document.body.appendChild(container);

      console.log('✅ [SOFTCAT] 软体猫容器已创建');
      return container;
    },
    
    async startSoftCat() {
      const { Engine, Runner, Render, Composite, Composites, Bodies, Body, Mouse, MouseConstraint, Constraint, World } = Matter;

      // 配置对象
      const CONFIG = {
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

      // 全局变量
      let engine, runner, render;
      let machine, washingMachineSprite;
      let softBody, pinConstraints = [];
      let isDraggingMachine = false;
      let dragOffset = { x: 0, y: 0 };
      let initialMachinePos = { x: 0, y: 0 };
      let initialSoftBodyPositions = [];
      let initialTailPositions = [];
      let showVisualization = false; // 默认关闭调试模式
      let p5Instance = null;
      
      // 图片资源
      let washingMachineImg, catImg, catBodyImg;

      // 加载图片资源
      function loadImages(p) {
        console.log('🖼️ [SOFTCAT] 开始加载图片资源...');
        
        // 获取扩展URL
        const extensionUrl = chrome.runtime.getURL('');
        console.log('🔗 [SOFTCAT] 扩展URL:', extensionUrl);
        
        const washingMachineUrl = extensionUrl + 'assets/images/washing_machine.png';
        const catUrl = extensionUrl + 'assets/images/cat.png';
        const catBodyUrl = extensionUrl + 'assets/images/cat_body.png';
        
        console.log('🖼️ [SOFTCAT] 洗衣机图片URL:', washingMachineUrl);
        console.log('🖼️ [SOFTCAT] 猫图片URL:', catUrl);
        console.log('🖼️ [SOFTCAT] 猫身体图片URL:', catBodyUrl);
        
        washingMachineImg = p.loadImage(washingMachineUrl, 
          (img) => {
            console.log('✅ [SOFTCAT] 洗衣机图片加载成功:', img.width, 'x', img.height);
            console.log('🖼️ [SOFTCAT] 洗衣机图片对象:', washingMachineImg);
          },
          (err) => {
            console.error('❌ [SOFTCAT] 洗衣机图片加载失败:', err);
            console.error('❌ [SOFTCAT] 洗衣机图片URL:', washingMachineUrl);
          }
        );
        catImg = p.loadImage(catUrl,
          (img) => {
            console.log('✅ [SOFTCAT] 猫图片加载成功:', img.width, 'x', img.height);
            console.log('🖼️ [SOFTCAT] 猫图片对象:', catImg);
          },
          (err) => {
            console.error('❌ [SOFTCAT] 猫图片加载失败:', err);
            console.error('❌ [SOFTCAT] 猫图片URL:', catUrl);
          }
        );
        catBodyImg = p.loadImage(catBodyUrl,
          (img) => {
            console.log('✅ [SOFTCAT] 猫身体图片加载成功:', img.width, 'x', img.height);
            console.log('🖼️ [SOFTCAT] 猫身体图片对象:', catBodyImg);
          },
          (err) => {
            console.error('❌ [SOFTCAT] 猫身体图片加载失败:', err);
            console.error('❌ [SOFTCAT] 猫身体图片URL:', catBodyUrl);
          }
        );
        
        console.log('✅ [SOFTCAT] 图片资源加载完成');
      }

      // 初始化p5.js
      function initP5() {
        console.log('🎨 [SOFTCAT] 开始初始化p5.js...');
        console.log('🎨 [SOFTCAT] p5对象是否存在:', typeof p5);
        
        const canvas = document.getElementById('softcat-canvas');
        console.log('🎨 [SOFTCAT] 获取画布元素:', canvas);
        
        if (!canvas) {
          console.error('❌ [SOFTCAT] 找不到画布元素！');
          return;
        }
        
        if (typeof p5 === 'undefined') {
          console.error('❌ [SOFTCAT] p5.js库未加载！');
          return;
        }
        
        console.log('🎨 [SOFTCAT] 创建p5实例...');
        try {
          p5Instance = new p5((p) => {
          p.setup = () => {
            console.log('🎨 [SOFTCAT] p5.js setup 开始');
            console.log('🎨 [SOFTCAT] 窗口尺寸:', window.innerWidth, 'x', window.innerHeight);
            
            p.createCanvas(window.innerWidth, window.innerHeight);
            p.background(0, 0, 0, 0); // 透明背景
            
            console.log('🎨 [SOFTCAT] 画布尺寸:', p.width, 'x', p.height);
            console.log('🎨 [SOFTCAT] 画布实际尺寸:', canvas.width, 'x', canvas.height);
            console.log('🎨 [SOFTCAT] 画布位置:', canvas.offsetLeft, canvas.offsetTop);
            console.log('🎨 [SOFTCAT] 画布样式:', canvas.style.cssText);
            console.log('🎨 [SOFTCAT] 画布父元素:', canvas.parentElement);
            console.log('🎨 [SOFTCAT] 画布可见性:', canvas.offsetWidth, 'x', canvas.offsetHeight);
            
          // 强制设置画布样式确保可见
          canvas.style.position = 'fixed';
          canvas.style.top = '0';
          canvas.style.left = '0';
          canvas.style.zIndex = '2147483647'; // 最大z-index值
          canvas.style.pointerEvents = 'none';
          canvas.style.backgroundColor = 'rgba(255, 0, 0, 0.3)'; // 更明显的红色背景
          canvas.style.width = '100vw';
          canvas.style.height = '100vh';
            
            console.log('🎨 [SOFTCAT] 画布强制样式设置完成');
            console.log('🎨 [SOFTCAT] 画布最终样式:', canvas.style.cssText);
            
            // 加载图片资源
            loadImages(p);
            
            console.log('✅ [SOFTCAT] p5.js应用已初始化');
          };
          
          p.draw = () => {
            // 每10帧输出一次调试信息
            if (p.frameCount % 10 === 0) {
              console.log('🎨 [SOFTCAT] draw函数执行中, 帧数:', p.frameCount, '画布尺寸:', p.width, 'x', p.height);
            }
            
            p.background(255, 0, 0, 50); // 半透明红色背景，确保画布可见
            
            // 绘制洗衣机
            if (machine) {
              console.log('🏠 [SOFTCAT] 绘制洗衣机, 位置:', machine.position.x, machine.position.y);
              drawWashingMachine(p);
            } else {
              console.log('⚠️ [SOFTCAT] 洗衣机对象不存在');
            }
            
            // 绘制软体猫
            if (softBody && softBody.bodies) {
              console.log('🐱 [SOFTCAT] 绘制软体猫, 粒子数量:', softBody.bodies.length);
              drawSoftCat(p);
            } else {
              console.log('⚠️ [SOFTCAT] 软体猫对象不存在或没有粒子');
            }
            
            // 洗衣机震动效果
            if (machine && softBody) {
              const t = p.millis() * 0.001;
              const bottomRowStart = (CONFIG.cat.rows - 1) * CONFIG.cat.cols;
              const centerStart = Math.floor((CONFIG.cat.cols - 4) / 2);
              
              for (let i = 0; i < 4; i++) {
                const index = bottomRowStart + centerStart + i;
                Body.applyForce(softBody.bodies[index], softBody.bodies[index].position, { 
                  x: Math.sin(t * 3 + i) * 0.00005,
                  y: Math.cos(t * 2 + i) * 0.00002
                });
              }
            }
            
            // 测试绘制 - 放在最后确保不被覆盖
            console.log('🎨 [SOFTCAT] 开始绘制测试内容...');
            p.noStroke();
            
            // 绘制超大号彩色圆圈，确保在屏幕中央
            p.fill(255, 255, 0, 255); // 黄色，完全不透明
            p.ellipse(200, 200, 200, 200);
            
            p.fill(0, 255, 0, 255); // 绿色，完全不透明
            p.ellipse(400, 200, 200, 200);
            
            p.fill(0, 0, 255, 255); // 蓝色，完全不透明
            p.ellipse(600, 200, 200, 200);
            
            // 绘制文字测试 - 更大更明显
            p.fill(255, 255, 255);
            p.textSize(64);
            p.textAlign(p.LEFT);
            p.text('SOFTCAT TEST', 100, 400);
            
            // 绘制边框测试 - 覆盖整个屏幕
            p.stroke(255, 255, 255);
            p.strokeWeight(10);
            p.noFill();
            p.rect(10, 10, p.width - 20, p.height - 20);
            
            // 绘制对角线测试
            p.stroke(255, 0, 255);
            p.strokeWeight(5);
            p.line(0, 0, p.width, p.height);
            p.line(p.width, 0, 0, p.height);
            
            console.log('🎨 [SOFTCAT] 测试内容绘制完成');
          };
        }, canvas);
        console.log('✅ [SOFTCAT] p5实例创建成功:', p5Instance);
        
        // 延迟检查画布是否真的在DOM中
        setTimeout(() => {
          const canvasInDOM = document.getElementById('softcat-canvas');
          console.log('🔍 [SOFTCAT] 延迟检查画布:', canvasInDOM);
          if (canvasInDOM) {
            console.log('🔍 [SOFTCAT] 画布在DOM中，位置:', canvasInDOM.getBoundingClientRect());
            console.log('🔍 [SOFTCAT] 画布计算样式:', window.getComputedStyle(canvasInDOM));
          } else {
            console.error('❌ [SOFTCAT] 画布不在DOM中！');
          }
        }, 1000);
        
        } catch (error) {
          console.error('❌ [SOFTCAT] p5实例创建失败:', error);
        }
      }

      // 绘制洗衣机
      function drawWashingMachine(p) {
        p.push();
        p.translate(machine.position.x, machine.position.y);
        p.rotate(machine.angle);
        
        // 使用图片绘制洗衣机
        if (washingMachineImg && washingMachineImg.width > 0) {
          const scale = CONFIG.machine.physicsScale;
          p.imageMode(p.CENTER);
          p.image(washingMachineImg, 0, 0, 
            CONFIG.machine.baseWidth * scale, 
            CONFIG.machine.baseHeight * scale);
        } else {
          // 备用绘制（如果图片未加载）
          p.fill(200, 200, 200);
          p.stroke(150, 150, 150);
          p.strokeWeight(2);
          p.rectMode(p.CENTER);
          p.rect(0, 0, CONFIG.machine.baseWidth * CONFIG.machine.physicsScale, CONFIG.machine.baseHeight * CONFIG.machine.physicsScale, 10);
          
          // 洗衣机门
          p.fill(100, 100, 100);
          p.ellipse(0, -CONFIG.machine.baseHeight * CONFIG.machine.physicsScale * 0.2, 60, 60);
        }
        
        p.pop();
      }

      // 绘制软体猫
      function drawSoftCat(p) {
        if (!softBody || !softBody.bodies) return;
        
        p.push();
        
        // 使用图片绘制软体猫粒子
        if (catImg && catImg.width > 0) {
          p.imageMode(p.CENTER);
          for (let body of softBody.bodies) {
            p.image(catImg, body.position.x, body.position.y, 
              CONFIG.cat.particleRadius * 2, 
              CONFIG.cat.particleRadius * 2);
          }
        } else {
          // 备用绘制（如果图片未加载）
          p.fill(255, 107, 107, 200);
          p.stroke(255, 107, 107);
          p.strokeWeight(1);
          
          for (let body of softBody.bodies) {
            p.ellipse(body.position.x, body.position.y, CONFIG.cat.particleRadius * 2);
          }
        }
        
        // 绘制约束线（调试模式）
        if (showVisualization) {
          p.stroke(255, 255, 0, 100);
          p.strokeWeight(1);
          p.noFill();
          
          for (let constraint of softBody.constraints) {
            if (constraint.bodyA && constraint.bodyB) {
              p.line(
                constraint.bodyA.position.x, constraint.bodyA.position.y,
                constraint.bodyB.position.x, constraint.bodyB.position.y
              );
            }
          }
        }
        
        p.pop();
      }

      // 初始化物理引擎
      function initMatter() {
        engine = Engine.create({ 
          constraintIterations: CONFIG.physics.constraintIterations,
          positionIterations: CONFIG.physics.positionIterations,
          velocityIterations: CONFIG.physics.velocityIterations,
          enableSleeping: false,
          gravity: CONFIG.physics.gravity
        });
        
        runner = Runner.create({
          delta: 1000 / 60,
          isFixed: true
        });
        
        Runner.run(runner, engine);
        console.log('✅ [SOFTCAT] 物理引擎已初始化');
        console.log('🔧 [SOFTCAT] 引擎状态:', engine.world.bodies.length, '个刚体');
      }

      // 创建调试渲染器
      function initMatterRenderer() {
        render = Render.create({
          canvas: document.createElement('canvas'),
          engine: engine,
          options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: true,
            background: 'transparent',
            showAngleIndicator: false,
            showVelocity: false,
            showCollisions: false,
            showAxes: false,
            showPositions: false,
            showBroadphase: false,
            showBounds: false,
            showSeparations: false,
            showSleeping: false,
            showStats: false,
            showPerformance: false,
            showDebug: false
          }
        });
        
        document.body.appendChild(render.canvas);
        render.canvas.style.position = 'fixed';
        render.canvas.style.top = '0';
        render.canvas.style.left = '0';
        render.canvas.style.zIndex = '1000000';
        render.canvas.style.pointerEvents = 'none';
        render.canvas.style.display = 'none'; // 默认隐藏
        
        Render.run(render);
        console.log('✅ [SOFTCAT] 调试渲染器已初始化');
      }

      // 位置计算函数
      function getMachineTopY() {
        return window.innerHeight * CONFIG.machine.topYRatio;
      }

      function getMachineTopEdge() {
        return machine.position.y - (CONFIG.machine.baseHeight * CONFIG.machine.physicsScale) / 2;
      }

      function getMachineBounds() {
        const halfWidth = (CONFIG.machine.baseWidth * CONFIG.machine.physicsScale) / 2;
        const halfHeight = (CONFIG.machine.baseHeight * CONFIG.machine.physicsScale) / 2;
        return {
          left: machine.position.x - halfWidth,
          right: machine.position.x + halfWidth,
          top: machine.position.y - halfHeight,
          bottom: machine.position.y + halfHeight
        };
      }

      function getCatOriginPosition() {
        return {
          x: machine.position.x - (CONFIG.cat.cols - 1) * CONFIG.cat.spacing / 2,
          y: getMachineTopEdge() + CONFIG.cat.pinOffset - CONFIG.cat.rows * CONFIG.cat.spacing
        };
      }

      // 创建洗衣机
      function createMachine() {
        const machineTopY = getMachineTopY();
        machine = Bodies.rectangle(
          window.innerWidth * 0.5, 
          machineTopY + CONFIG.machine.topOffset, 
          CONFIG.machine.baseWidth * CONFIG.machine.physicsScale, 
          CONFIG.machine.baseHeight * CONFIG.machine.physicsScale, 
          { 
            isStatic: true, 
            render: { fillStyle: '#888888', strokeStyle: '#aaaaaa', lineWidth: 2 }
          }
        );
        World.add(engine.world, machine);
      }

      // 创建软体
      function createSoftBody() {
        const originPos = getCatOriginPosition();
        
        softBody = Composites.softBody(
          originPos.x, originPos.y, CONFIG.cat.cols, CONFIG.cat.rows, 0, 0,
          true,
          CONFIG.cat.particleRadius,
          { 
            frictionAir: 0.3,
            restitution: 0.1,
            inertia: Infinity,
            friction: 0.8,
            density: 0.001,
            render: { fillStyle: '#00ff00', strokeStyle: '#00ff00', lineWidth: 1 }
          },
          { 
            stiffness: CONFIG.constraints.softBody.stiffness,
            damping: CONFIG.constraints.softBody.damping,
            render: { strokeStyle: '#ffff00', lineWidth: 1 }
          }
        );
        
        // 确保软体粒子在正确位置
        softBody.bodies.forEach((body, index) => {
          const row = Math.floor(index / CONFIG.cat.cols);
          const col = index % CONFIG.cat.cols;
          const x = originPos.x + col * CONFIG.cat.spacing;
          const y = originPos.y + row * CONFIG.cat.spacing;
          Body.setPosition(body, { x, y });
          Body.setVelocity(body, { x: 0, y: 0 });
          Body.setAngularVelocity(body, 0);
        });
        
        World.add(engine.world, softBody);
        console.log('🐱 [SOFTCAT] 软体猫创建完成, 粒子数量:', softBody.bodies.length);
        console.log('🐱 [SOFTCAT] 软体猫位置:', originPos.x, originPos.y);
      }

      // 创建约束
      function createPinConstraints() {
        pinConstraints = [];
        const bottomRowStart = (CONFIG.cat.rows - 1) * CONFIG.cat.cols;
        const centerStart = Math.floor((CONFIG.cat.cols - 4) / 2);
        
        for (let i = 0; i < 4; i++) {
          const index = bottomRowStart + centerStart + i;
          const particle = softBody.bodies[index];
          const constraint = Constraint.create({
            bodyA: particle,
            pointB: { 
              x: particle.position.x, 
              y: getMachineTopEdge() + CONFIG.cat.pinOffset
            },
            length: 0,
            stiffness: CONFIG.constraints.pin.stiffness,
            damping: CONFIG.constraints.pin.damping,
            render: { strokeStyle: '#ff00ff', lineWidth: 2 }
          });
          pinConstraints.push(constraint);
        }
        
        pinConstraints.forEach(pin => World.add(engine.world, pin));
      }

      // 创建尾巴
      function createTail() {
        const tailBase = softBody.bodies[(CONFIG.cat.rows - 1) * CONFIG.cat.cols + (CONFIG.cat.cols - 1)];
        let prev = tailBase;
        
        for (let i = 0; i < CONFIG.tail.segments; i++) {
          const seg = Bodies.circle(
            tailBase.position.x + (i + 1) * CONFIG.tail.length, 
            tailBase.position.y,
            CONFIG.tail.radius, 
            { 
              frictionAir: 0.1,
              friction: 0.5,
              restitution: 0.1,
              density: 0.0003,
              render: { fillStyle: '#ff8800', strokeStyle: '#ff8800', lineWidth: 1 }
            }
          );
          
          const link = Constraint.create({ 
            bodyA: prev, 
            bodyB: seg, 
            length: CONFIG.tail.length, 
            stiffness: CONFIG.constraints.tail.stiffness,
            damping: CONFIG.constraints.tail.damping,
            render: { strokeStyle: '#ff8800', lineWidth: 1 }
          });
          
          World.add(engine.world, [seg, link]);
          prev = seg;
        }
      }

      // 设置事件监听
      function setupEventListeners() {
        const canvas = document.getElementById('softcat-canvas');
        
        canvas.addEventListener('mousedown', (e) => {
          const rect = canvas.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          
          const machineBounds = getMachineBounds();
          
          if (mouseX >= machineBounds.left && mouseX <= machineBounds.right &&
              mouseY >= machineBounds.top && mouseY <= machineBounds.bottom) {
            startDragging(mouseX, mouseY);
            e.preventDefault();
          }
        });

        canvas.addEventListener('mousemove', (e) => {
          if (isDraggingMachine) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            updateDragging(mouseX, mouseY);
          }
        });

        canvas.addEventListener('mouseup', () => {
          if (isDraggingMachine) {
            stopDragging();
          }
        });

        // 键盘控制
        document.addEventListener('keydown', (e) => {
          if (e.key.toLowerCase() === 'v') {
            showVisualization = !showVisualization;
            if (render && render.canvas) {
              render.canvas.style.display = showVisualization ? 'block' : 'none';
            }
            console.log('🔍 [SOFTCAT] 物理可视化:', showVisualization ? '显示' : '隐藏');
          } else if (e.key.toLowerCase() === 'r') {
            resetCatShape();
            console.log('🔄 [SOFTCAT] 猫的形状已重置');
          }
        });
      }

      // 拖拽函数
      function startDragging(mouseX, mouseY) {
        isDraggingMachine = true;
        dragOffset.x = mouseX - machine.position.x;
        dragOffset.y = mouseY - machine.position.y;
        
        initialMachinePos = { x: machine.position.x, y: machine.position.y };
        initialSoftBodyPositions = softBody.bodies.map(body => ({ x: body.position.x, y: body.position.y }));
        
        pinConstraints.forEach(pin => World.remove(engine.world, pin));
      }

      function updateDragging(mouseX, mouseY) {
        const newX = mouseX - dragOffset.x;
        const newY = mouseY - dragOffset.y;
        
        const deltaX = newX - initialMachinePos.x;
        const deltaY = newY - initialMachinePos.y;
        
        Body.setPosition(machine, { x: newX, y: newY });
        
        softBody.bodies.forEach((body, index) => {
          const initialPos = initialSoftBodyPositions[index];
          Body.setPosition(body, {
            x: initialPos.x + deltaX,
            y: initialPos.y + deltaY
          });
        });
      }

      function stopDragging() {
        isDraggingMachine = false;
        
        pinConstraints.forEach(pin => {
          pin.pointB.x = pin.bodyA.position.x;
          pin.pointB.y = getMachineTopEdge() + CONFIG.cat.pinOffset;
          World.add(engine.world, pin);
        });
      }

      function resetCatShape() {
        const originPos = getCatOriginPosition();
        
        softBody.bodies.forEach((body, index) => {
          const row = Math.floor(index / CONFIG.cat.cols);
          const col = index % CONFIG.cat.cols;
          const newX = originPos.x + col * CONFIG.cat.spacing;
          const newY = originPos.y + row * CONFIG.cat.spacing;
          
          Body.setPosition(body, { x: newX, y: newY });
          Body.setVelocity(body, { x: 0, y: 0 });
          Body.setAngularVelocity(body, 0);
        });
      }

      // 设置鼠标约束
      function setupMouseConstraint() {
        const canvas = document.getElementById('softcat-canvas');
        const mouse = Mouse.create(canvas);
        const mcon = MouseConstraint.create(engine, { 
          mouse, 
          constraint: { 
            stiffness: 0.2,
            damping: 0.5,
            render: { visible: false } 
          } 
        });
        World.add(engine.world, mcon);
      }

      // 主初始化函数
      function initializeEverything() {
        console.log('🎯 [SOFTCAT] 开始初始化软体猫系统...');
        
        // 初始化渲染和物理引擎
        initP5();
        initMatter();
        initMatterRenderer();
        
        // 创建物理对象
        createMachine();
        createSoftBody();
        createTail();
        
        // 延迟创建约束，让软体稳定后再添加
        setTimeout(() => {
          createPinConstraints();
          console.log('✅ [SOFTCAT] 约束已添加，猫应该稳定了');
        }, 500);
        
        // 设置交互
        setupEventListeners();
        setupMouseConstraint();
        
        console.log('🎉 [SOFTCAT] 软体猫系统初始化完成！');
      }

      // 先初始化所有系统
      initializeEverything();
      
      // 然后创建软体猫API
      window.SoftCat = {
        start: () => {
          if (!runner) {
            Runner.run(runner, engine);
            console.log('✅ [SOFTCAT] 软体猫已启动');
          }
        },
        
        stop: () => {
          if (runner) {
            Runner.stop(runner);
            console.log('⏹️ [SOFTCAT] 软体猫已停止');
          }
          
          // 移除容器
          const container = document.getElementById('softcat-container');
          if (container) {
            container.remove();
          }
          
          // 清理p5实例
          if (p5Instance) {
            p5Instance.remove();
            p5Instance = null;
          }
          
          // 清理全局状态
          window.SoftCatLoaded = false;
          delete window.SoftCat;
        },
        
        toggleDebug: () => {
          showVisualization = !showVisualization;
          if (render && render.canvas) {
            render.canvas.style.display = showVisualization ? 'block' : 'none';
          }
          console.log('🔍 [SOFTCAT] 调试模式:', showVisualization ? '开启' : '关闭');
          return showVisualization;
        },
        
        resetCat: () => {
          resetCatShape();
          console.log('🔄 [SOFTCAT] 猫的形状已重置');
        },
        
        isRunning: () => {
          return !!runner && !runner.enabled;
        },
        
        getStatus: () => {
          return {
            loaded: true,
            running: !!runner && !runner.enabled,
            debugMode: showVisualization
          };
        }
      };
    },
    
    showError(message) {
      console.error('❌ [SOFTCAT] 软体猫错误:', message);
      
      // 创建错误提示
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 0, 0, 0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        font-family: sans-serif;
        font-size: 14px;
        z-index: 1000000;
      `;
      errorDiv.textContent = `软体猫初始化失败: ${message}`;
      document.body.appendChild(errorDiv);
      
      // 3秒后自动移除
      setTimeout(() => {
        errorDiv.remove();
      }, 3000);
    }
  };
  
  // 启动初始化
  SoftCatInitializer.init().catch(error => {
    console.error('❌ [SOFTCAT] 软体猫初始化器失败:', error);
  });
  
})();
