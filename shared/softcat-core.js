// 软体猫核心模块 - 基于现有的 index.html 代码
// 这个文件包含了软体猫的完整实现，可以在任何页面中注入使用

(function() {
  'use strict';

  // 检查是否已经加载过软体猫
  if (window.SoftCatLoaded) {
    console.log('软体猫已经加载过了');
    return;
  }
  window.SoftCatLoaded = true;

  // 等待页面加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSoftCat);
  } else {
    initSoftCat();
  }

  function initSoftCat() {
    // 检查必要的库是否已加载
    if (typeof PIXI === 'undefined' || typeof Matter === 'undefined') {
      console.error('软体猫需要 PIXI.js 和 Matter.js 库，但库文件未正确加载');
      showLibraryError();
      return;
    }
    
    console.log('库文件已加载，初始化软体猫');
    startSoftCat();
  }
  
  
  // 显示库加载错误
  function showLibraryError() {
    const container = document.getElementById('softcat-container');
    if (container) {
      container.innerHTML = `
        <div style="
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
        ">
          <h3>🐱 软体猫加载失败</h3>
          <p>无法加载必要的库文件，请检查网络连接或刷新页面重试。</p>
        </div>
      `;
    }
  }
  
  // 启动软体猫
  function startSoftCat() {

    // 创建软体猫容器
    createSoftCatContainer();
    
    // 初始化软体猫
    initializeSoftCat();
  }

  function createSoftCatContainer() {
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
      pointer-events: auto;
    `;

    container.appendChild(canvas);
    document.body.appendChild(container);

    return container;
  }

  function initializeSoftCat() {
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
    let engine, world, render, runner;
    let machine, catParticles, tailSegments;
    let pinConstraints = [], softBodyConstraints = [], tailConstraints = [];
    let machineSprite, catSprites = [], tailSprites = [];
    let isDragging = false, dragOffset = { x: 0, y: 0 };
    let showDebug = false;

    // 初始化物理引擎
    function initPhysics() {
      engine = Engine.create();
      world = engine.world;
      engine.world.gravity = CONFIG.physics.gravity;

      // 创建洗衣机
      const machineTopY = window.innerHeight * CONFIG.machine.topYRatio;
      machine = Bodies.rectangle(
        window.innerWidth * 0.5,
        machineTopY + CONFIG.machine.topOffset,
        CONFIG.machine.baseWidth * CONFIG.machine.physicsScale,
        CONFIG.machine.baseHeight * CONFIG.machine.physicsScale
      );
      World.add(world, machine);

      // 创建软体猫粒子
      createCatParticles();
      
      // 创建尾巴
      createTail();

      // 创建约束
      createConstraints();
    }

    // 创建软体猫粒子
    function createCatParticles() {
      catParticles = [];
      const originX = machine.position.x - (CONFIG.cat.cols - 1) * CONFIG.cat.spacing / 2;
      const originY = machine.position.y - CONFIG.machine.baseHeight * CONFIG.machine.physicsScale / 2 + CONFIG.cat.pinOffset - CONFIG.cat.rows * CONFIG.cat.spacing;

      for (let row = 0; row < CONFIG.cat.rows; row++) {
        for (let col = 0; col < CONFIG.cat.cols; col++) {
          const x = originX + col * CONFIG.cat.spacing;
          const y = originY + row * CONFIG.cat.spacing;
          const particle = Bodies.circle(x, y, CONFIG.cat.particleRadius, {
            frictionAir: 0.01,
            render: { fillStyle: showDebug ? '#ff6b6b' : 'transparent' }
          });
          catParticles.push(particle);
        }
      }
      World.add(world, catParticles);
    }

    // 创建尾巴
    function createTail() {
      tailSegments = [];
      const startX = machine.position.x + CONFIG.machine.baseWidth * CONFIG.machine.physicsScale / 2 + CONFIG.tail.length;
      const startY = machine.position.y - CONFIG.machine.baseHeight * CONFIG.machine.physicsScale / 2 + CONFIG.cat.pinOffset;

      for (let i = 0; i < CONFIG.tail.segments; i++) {
        const x = startX + i * CONFIG.tail.length;
        const segment = Bodies.circle(x, startY, CONFIG.tail.radius, {
          frictionAir: 0.01,
          render: { fillStyle: showDebug ? '#4ecdc4' : 'transparent' }
        });
        tailSegments.push(segment);
      }
      World.add(world, tailSegments);
    }

    // 创建约束
    function createConstraints() {
      // 固定约束
      createPinConstraints();
      
      // 软体约束
      createSoftBodyConstraints();
      
      // 尾巴约束
      createTailConstraints();
    }

    // 创建固定约束
    function createPinConstraints() {
      pinConstraints = [];
      const machineTopY = machine.position.y - CONFIG.machine.baseHeight * CONFIG.machine.physicsScale / 2;
      
      // 前面3个约束点
      for (let i = 0; i < 3; i++) {
        const index = (CONFIG.cat.rows - 1) * CONFIG.cat.cols + i;
        const constraint = Constraint.create({
          bodyA: catParticles[index],
          pointB: {
            x: catParticles[index].position.x,
            y: machineTopY + CONFIG.cat.pinOffset
          },
          stiffness: CONFIG.constraints.pin.stiffness,
          damping: CONFIG.constraints.pin.damping
        });
        pinConstraints.push(constraint);
      }
      
      // 后面3个约束点
      for (let i = 0; i < 3; i++) {
        const index = (CONFIG.cat.rows - 1) * CONFIG.cat.cols + (CONFIG.cat.cols - 1 - i);
        const constraint = Constraint.create({
          bodyA: catParticles[index],
          pointB: {
            x: catParticles[index].position.x,
            y: machineTopY + CONFIG.cat.pinOffset
          },
          stiffness: CONFIG.constraints.pin.stiffness,
          damping: CONFIG.constraints.pin.damping
        });
        pinConstraints.push(constraint);
      }
      
      World.add(world, pinConstraints);
    }

    // 创建软体约束
    function createSoftBodyConstraints() {
      softBodyConstraints = [];
      
      // 水平约束
      for (let row = 0; row < CONFIG.cat.rows; row++) {
        for (let col = 0; col < CONFIG.cat.cols - 1; col++) {
          const indexA = row * CONFIG.cat.cols + col;
          const indexB = row * CONFIG.cat.cols + col + 1;
          const constraint = Constraint.create({
            bodyA: catParticles[indexA],
            bodyB: catParticles[indexB],
            length: CONFIG.cat.spacing,
            stiffness: CONFIG.constraints.softBody.stiffness,
            damping: CONFIG.constraints.softBody.damping
          });
          softBodyConstraints.push(constraint);
        }
      }
      
      // 垂直约束
      for (let row = 0; row < CONFIG.cat.rows - 1; row++) {
        for (let col = 0; col < CONFIG.cat.cols; col++) {
          const indexA = row * CONFIG.cat.cols + col;
          const indexB = (row + 1) * CONFIG.cat.cols + col;
          const constraint = Constraint.create({
            bodyA: catParticles[indexA],
            bodyB: catParticles[indexB],
            length: CONFIG.cat.spacing,
            stiffness: CONFIG.constraints.softBody.stiffness,
            damping: CONFIG.constraints.softBody.damping
          });
          softBodyConstraints.push(constraint);
        }
      }
      
      // 对角线约束
      for (let row = 0; row < CONFIG.cat.rows - 1; row++) {
        for (let col = 0; col < CONFIG.cat.cols - 1; col++) {
          const indexA = row * CONFIG.cat.cols + col;
          const indexB = (row + 1) * CONFIG.cat.cols + col + 1;
          const constraint = Constraint.create({
            bodyA: catParticles[indexA],
            bodyB: catParticles[indexB],
            length: CONFIG.cat.spacing * Math.sqrt(2),
            stiffness: CONFIG.constraints.softBody.stiffness * 0.5,
            damping: CONFIG.constraints.softBody.damping
          });
          softBodyConstraints.push(constraint);
        }
      }
      
      World.add(world, softBodyConstraints);
    }

    // 创建尾巴约束
    function createTailConstraints() {
      tailConstraints = [];
      
      // 尾巴与洗衣机的连接
      const tailConnection = Constraint.create({
        bodyA: machine,
        bodyB: tailSegments[0],
        pointA: {
          x: CONFIG.machine.baseWidth * CONFIG.machine.physicsScale / 2,
          y: -CONFIG.machine.baseHeight * CONFIG.machine.physicsScale / 2 + CONFIG.cat.pinOffset
        },
        stiffness: CONFIG.constraints.tail.stiffness,
        damping: CONFIG.constraints.tail.damping
      });
      tailConstraints.push(tailConnection);
      
      // 尾巴段之间的连接
      for (let i = 0; i < CONFIG.tail.segments - 1; i++) {
        const constraint = Constraint.create({
          bodyA: tailSegments[i],
          bodyB: tailSegments[i + 1],
          length: CONFIG.tail.length,
          stiffness: CONFIG.constraints.tail.stiffness,
          damping: CONFIG.constraints.tail.damping
        });
        tailConstraints.push(constraint);
      }
      
      World.add(world, tailConstraints);
    }

    // 初始化渲染
    function initRender() {
      const canvas = document.getElementById('softcat-canvas');
      const app = new PIXI.Application({
        view: canvas,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundAlpha: 0,
        antialias: true
      });

      // 加载纹理
      loadTextures(app);
    }

    // 加载纹理
    function loadTextures(app) {
      const loader = new PIXI.Loader();
      
      loader.add('cat', chrome.runtime.getURL('assets/images/cat.png'));
      loader.add('catBody', chrome.runtime.getURL('assets/images/cat_body.png'));
      loader.add('machine', chrome.runtime.getURL('assets/images/washing_machine.png'));
      
      loader.load((loader, resources) => {
        createSprites(app, resources);
        startAnimation();
      });
    }

    // 创建精灵
    function createSprites(app, resources) {
      // 洗衣机精灵
      machineSprite = new PIXI.Sprite(resources.machine.texture);
      machineSprite.anchor.set(0.5);
      machineSprite.scale.set(CONFIG.machine.spriteScale);
      app.stage.addChild(machineSprite);

      // 软体猫精灵
      for (let i = 0; i < catParticles.length; i++) {
        const sprite = new PIXI.Sprite(resources.catBody.texture);
        sprite.anchor.set(0.5);
        sprite.scale.set(0.3);
        catSprites.push(sprite);
        app.stage.addChild(sprite);
      }

      // 尾巴精灵
      for (let i = 0; i < tailSegments.length; i++) {
        const sprite = new PIXI.Sprite(resources.cat.texture);
        sprite.anchor.set(0.5);
        sprite.scale.set(0.2);
        tailSprites.push(sprite);
        app.stage.addChild(sprite);
      }
    }

    // 开始动画
    function startAnimation() {
      runner = Runner.create();
      Runner.run(runner, engine);

      // 动画循环
      function animate() {
        // 更新精灵位置
        updateSprites();
        
        // 更新约束
        updateConstraints();
        
        requestAnimationFrame(animate);
      }
      animate();
    }

    // 更新精灵位置
    function updateSprites() {
      // 更新洗衣机
      machineSprite.x = machine.position.x;
      machineSprite.y = machine.position.y;

      // 更新软体猫
      for (let i = 0; i < catParticles.length; i++) {
        catSprites[i].x = catParticles[i].position.x;
        catSprites[i].y = catParticles[i].position.y;
      }

      // 更新尾巴
      for (let i = 0; i < tailSegments.length; i++) {
        tailSprites[i].x = tailSegments[i].position.x;
        tailSprites[i].y = tailSegments[i].position.y;
      }
    }

    // 更新约束
    function updateConstraints() {
      const machineTopY = machine.position.y - CONFIG.machine.baseHeight * CONFIG.machine.physicsScale / 2;
      
      pinConstraints.forEach(pin => {
        pin.pointB.x = pin.bodyA.position.x;
        pin.pointB.y = machineTopY + CONFIG.cat.pinOffset;
      });
    }

    // 添加交互
    function addInteractions() {
      const canvas = document.getElementById('softcat-canvas');
      
      // 鼠标事件
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
      
      // 键盘事件
      document.addEventListener('keydown', handleKeyDown);
      
      // 窗口大小改变
      window.addEventListener('resize', handleResize);
    }

    // 鼠标按下
    function handleMouseDown(e) {
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // 检查是否点击了洗衣机
      const machineBounds = getMachineBounds();
      if (x >= machineBounds.left && x <= machineBounds.right && 
          y >= machineBounds.top && y <= machineBounds.bottom) {
        isDragging = true;
        dragOffset.x = x - machine.position.x;
        dragOffset.y = y - machine.position.y;
        canvas.style.cursor = 'grabbing';
      }
    }

    // 鼠标移动
    function handleMouseMove(e) {
      if (isDragging) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        Body.setPosition(machine, {
          x: x - dragOffset.x,
          y: y - dragOffset.y
        });
      }
    }

    // 鼠标释放
    function handleMouseUp() {
      isDragging = false;
      canvas.style.cursor = 'grab';
    }

    // 键盘事件
    function handleKeyDown(e) {
      switch (e.key.toLowerCase()) {
        case 'v':
          toggleDebug();
          break;
        case 'r':
          resetCat();
          break;
      }
    }

    // 切换调试模式
    function toggleDebug() {
      showDebug = !showDebug;
      console.log('调试模式:', showDebug ? '开启' : '关闭');
      
      // 更新粒子渲染
      catParticles.forEach(particle => {
        particle.render.fillStyle = showDebug ? '#ff6b6b' : 'transparent';
      });
      
      tailSegments.forEach(segment => {
        segment.render.fillStyle = showDebug ? '#4ecdc4' : 'transparent';
      });
    }

    // 重置软体猫
    function resetCat() {
      console.log('重置软体猫形状');
      // 这里可以添加重置逻辑
    }

    // 获取洗衣机边界
    function getMachineBounds() {
      const halfWidth = CONFIG.machine.baseWidth * CONFIG.machine.physicsScale / 2;
      const halfHeight = CONFIG.machine.baseHeight * CONFIG.machine.physicsScale / 2;
      return {
        left: machine.position.x - halfWidth,
        right: machine.position.x + halfWidth,
        top: machine.position.y - halfHeight,
        bottom: machine.position.y + halfHeight
      };
    }

    // 窗口大小改变
    function handleResize() {
      const canvas = document.getElementById('softcat-canvas');
      const app = PIXI.Application.shared;
      if (app) {
        app.renderer.resize(window.innerWidth, window.innerHeight);
      }
    }

    // 启动软体猫
    function start() {
      initPhysics();
      initRender();
      addInteractions();
    }

    // 停止软体猫
    function stop() {
      if (runner) {
        Runner.stop(runner);
      }
      if (engine) {
        Engine.clear(engine);
      }
    }

    // 公开API
    window.SoftCat = {
      start,
      stop,
      toggleDebug,
      resetCat,
      isRunning: () => !!runner
    };

    // 自动启动
    start();
  }
})();
