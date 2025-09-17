// shared/softcat-core.js - 修复版本
// 使用p5.js替代PIXI.js，改进库文件检测和初始化逻辑

(function() {
  'use strict';

  // 检查是否已经加载过软体猫
  if (window.SoftCatLoaded) {
    console.log('软体猫已经加载过了');
    return;
  }

  console.log('开始初始化软体猫...');

  // 软体猫初始化器
  const SoftCatInitializer = {
    maxWaitTime: 15000, // 最大等待时间 15秒
    checkInterval: 200, // 检查间隔 200ms
    
    async waitForLibraries() {
      console.log('等待库文件加载...');
      
      return new Promise((resolve, reject) => {
        let waitTime = 0;
        
        const checkLibraries = () => {
          const p5Loaded = typeof p5 !== 'undefined';
          const matterLoaded = typeof Matter !== 'undefined';
          
          console.log(`库文件检查 - p5.js: ${p5Loaded}, Matter.js: ${matterLoaded}`);
          
          if (p5Loaded && matterLoaded) {
            console.log('所有库文件已加载，开始初始化软体猫');
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
        
        // 初始化软体猫
        await this.initSoftCat();
        
        console.log('软体猫初始化完成！');
        
      } catch (error) {
        console.error('软体猫初始化失败:', error);
        this.showError(error.message);
      }
    },
    
    async initSoftCat() {
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

      // 创建p5.js画布容器
      const canvasContainer = document.createElement('div');
      canvasContainer.id = 'softcat-canvas-container';
      canvasContainer.style.cssText = `
        width: 100%;
        height: 100%;
        pointer-events: auto;
      `;

      container.appendChild(canvasContainer);
      document.body.appendChild(container);

      console.log('软体猫容器已创建');
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
      let p5Instance, engine, runner, render;
      let machine, washingMachineSprite;
      let softBody, pinConstraints = [];
      let isDraggingMachine = false;
      let dragOffset = { x: 0, y: 0 };
      let initialMachinePos = { x: 0, y: 0 };
      let initialSoftBodyPositions = [];
      let initialTailPositions = [];
      let showVisualization = false; // 默认关闭调试模式

      // 初始化p5.js
      function initP5() {
        const canvasContainer = document.getElementById('softcat-canvas-container');
        
        p5Instance = new p5((p) => {
          p.setup = () => {
            const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
            canvas.parent('softcat-canvas-container');
            p.background(0, 0, 0, 0); // 透明背景
            console.log('p5.js画布已初始化');
          };
          
          p.draw = () => {
            p.background(0, 0, 0, 0); // 透明背景
            
            // 绘制洗衣机
            if (machine) {
              p.push();
              p.translate(machine.position.x, machine.position.y);
              p.rotate(machine.angle);
              p.fill(200, 200, 200);
              p.stroke(170, 170, 170);
              p.strokeWeight(2);
              p.rectMode(p.CENTER);
              p.rect(0, 0, CONFIG.machine.baseWidth * CONFIG.machine.physicsScale, CONFIG.machine.baseHeight * CONFIG.machine.physicsScale, 10);
              
              // 洗衣机门
              p.fill(100, 100, 100);
              p.ellipse(0, -CONFIG.machine.baseHeight * CONFIG.machine.physicsScale / 4, 60, 60);
              p.pop();
            }
            
            // 绘制软体猫
            if (softBody && softBody.bodies) {
              p.push();
              p.fill(255, 107, 107, 200);
              p.stroke(255, 107, 107);
              p.strokeWeight(1);
              
              // 绘制软体网格
              for (let y = 0; y < CONFIG.cat.rows - 1; y++) {
                for (let x = 0; x < CONFIG.cat.cols - 1; x++) {
                  const idx1 = y * CONFIG.cat.cols + x;
                  const idx2 = y * CONFIG.cat.cols + (x + 1);
                  const idx3 = (y + 1) * CONFIG.cat.cols + x;
                  const idx4 = (y + 1) * CONFIG.cat.cols + (x + 1);
                  
                  if (softBody.bodies[idx1] && softBody.bodies[idx2] && softBody.bodies[idx3] && softBody.bodies[idx4]) {
                    p.beginShape();
                    p.vertex(softBody.bodies[idx1].position.x, softBody.bodies[idx1].position.y);
                    p.vertex(softBody.bodies[idx2].position.x, softBody.bodies[idx2].position.y);
                    p.vertex(softBody.bodies[idx4].position.x, softBody.bodies[idx4].position.y);
                    p.vertex(softBody.bodies[idx3].position.x, softBody.bodies[idx3].position.y);
                    p.endShape(p.CLOSE);
                  }
                }
              }
              p.pop();
            }
            
            // 绘制尾巴
            if (softBody && softBody.bodies) {
              p.push();
              p.fill(255, 136, 0, 200);
              p.stroke(255, 136, 0);
              p.strokeWeight(2);
              
              const tailBase = softBody.bodies[(CONFIG.cat.rows - 1) * CONFIG.cat.cols + (CONFIG.cat.cols - 1)];
              if (tailBase) {
                p.ellipse(tailBase.position.x, tailBase.position.y, CONFIG.tail.radius * 2);
              }
              p.pop();
            }
          };
          
          p.mousePressed = () => {
            if (machine) {
              const machineBounds = getMachineBounds();
              if (p.mouseX >= machineBounds.left && p.mouseX <= machineBounds.right &&
                  p.mouseY >= machineBounds.top && p.mouseY <= machineBounds.bottom) {
                startDragging(p.mouseX, p.mouseY);
              }
            }
          };
          
          p.mouseDragged = () => {
            if (isDraggingMachine) {
              updateDragging(p.mouseX, p.mouseY);
            }
          };
          
          p.mouseReleased = () => {
            if (isDraggingMachine) {
              stopDragging();
            }
          };
        }, canvasContainer);
        
        console.log('p5.js应用已初始化');
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
        console.log('物理引擎已初始化');
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
        console.log('调试渲染器已初始化');
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
        // 键盘控制
        document.addEventListener('keydown', (e) => {
          if (e.key.toLowerCase() === 'v') {
            showVisualization = !showVisualization;
            if (render && render.canvas) {
              render.canvas.style.display = showVisualization ? 'block' : 'none';
            }
            console.log('物理可视化:', showVisualization ? '显示' : '隐藏');
          } else if (e.key.toLowerCase() === 'r') {
            resetCatShape();
            console.log('猫的形状已重置');
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
        const canvas = p5Instance.canvas;
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
        console.log('开始初始化软体猫系统...');
        
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
          console.log('约束已添加，猫应该稳定了');
        }, 500);
        
        // 设置交互
        setupEventListeners();
        setupMouseConstraint();
        
        console.log('软体猫系统初始化完成！');
      }

      // 启动软体猫
      initializeEverything();

      // 创建软体猫API
      window.SoftCat = {
        start: () => {
          if (!runner) {
            Runner.run(runner, engine);
            console.log('软体猫已启动');
          }
        },
        
        stop: () => {
          if (runner) {
            Runner.stop(runner);
            console.log('软体猫已停止');
          }
          
          if (p5Instance) {
            p5Instance.remove();
          }
          
          // 移除容器
          const container = document.getElementById('softcat-container');
          if (container) {
            container.remove();
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
          console.log('调试模式:', showVisualization ? '开启' : '关闭');
        },
        
        resetCat: resetCatShape,
        
        isRunning: () => !!runner && runner.enabled,
        
        getStatus: () => ({
          loaded: window.SoftCatLoaded,
          running: !!runner && runner.enabled,
          debugMode: showVisualization,
          p5Version: p5.VERSION,
          matterVersion: Matter.version
        })
      };
    },
    
    showError(message) {
      const errorDiv = document.createElement('div');
      errorDiv.id = 'softcat-error';
      errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff6b6b;
        color: white;
        padding: 15px;
        border-radius: 8px;
        font-family: Arial, sans-serif;
        z-index: 999999;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;
      
      errorDiv.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 8px;">🐱 软体猫加载失败</div>
        <div style="font-size: 14px;">${message}</div>
        <button onclick="this.parentElement.remove()" 
                style="margin-top: 10px; background: rgba(255,255,255,0.2); color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
          关闭
        </button>
      `;
      
      document.body.appendChild(errorDiv);
      
      // 10秒后自动移除
      setTimeout(() => {
        if (errorDiv.parentElement) {
          errorDiv.remove();
        }
      }, 10000);
    }
  };

  // 启动初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      SoftCatInitializer.init();
    });
  } else {
    SoftCatInitializer.init();
  }

  // 监听来自扩展的消息
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'stopSoftCat') {
        if (window.SoftCat && window.SoftCat.stop) {
          window.SoftCat.stop();
          sendResponse({ success: true, message: '软体猫已停止' });
        } else {
          sendResponse({ success: false, message: '软体猫未运行' });
        }
      } else if (request.action === 'getSoftCatStatus') {
        if (window.SoftCat && window.SoftCat.getStatus) {
          sendResponse(window.SoftCat.getStatus());
        } else {
          sendResponse({ loaded: false, running: false });
        }
      }
      return true;
    });
  }

})();