// 软体猫核心脚本 - 基于现有的 Pixi.js + Matter.js 实现
class SoftCatCore {
  constructor(container) {
    this.container = container;
    this.app = null;
    this.engine = null;
    this.softBody = null;
    this.pinConstraints = [];
    this.isInitialized = false;
    
    this.init();
  }

  async init() {
    try {
      // 动态加载 Matter.js 和 Pixi.js
      await this.loadDependencies();
      
      // 初始化渲染引擎
      this.initPixi();
      this.initMatter();
      
      // 创建软体猫
      this.createSoftCat();
      
      this.isInitialized = true;
      console.log('✅ 软体猫核心初始化完成');
    } catch (error) {
      console.error('❌ 软体猫核心初始化失败:', error);
    }
  }

  async loadDependencies() {
    // 加载 Matter.js
    if (typeof Matter === 'undefined') {
      await this.loadScript('https://unpkg.com/matter-js@0.19.0/build/matter.min.js');
    }
    
    // 加载 Pixi.js
    if (typeof PIXI === 'undefined') {
      await this.loadScript('https://unpkg.com/pixi.js@7/dist/pixi.min.js');
    }
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  initPixi() {
    this.app = new PIXI.Application({
      view: this.container,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 0,
      antialias: true,
      transparent: true
    });
  }

  initMatter() {
    const { Engine, Runner, Render, Bodies, Body, Constraint, World, Composites } = Matter;
    
    this.engine = Engine.create({
      constraintIterations: 20,
      positionIterations: 20,
      velocityIterations: 10,
      enableSleeping: true,
      gravity: { x: 0, y: 0.1 }
    });
    
    const runner = Runner.create({
      delta: 1000 / 60,
      isFixed: true
    });
    
    Runner.run(runner, this.engine);
  }

  createSoftCat() {
    const { Bodies, Body, Constraint, World, Composites } = Matter;
    
    // 配置
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
        softBody: { stiffness: 0.9, damping: 0.8 }
      }
    };

    // 创建洗衣机
    const machineTopY = window.innerHeight * CONFIG.machine.topYRatio;
    const machine = Bodies.rectangle(
      window.innerWidth * 0.5,
      machineTopY + CONFIG.machine.topOffset,
      CONFIG.machine.baseWidth * CONFIG.machine.physicsScale,
      CONFIG.machine.baseHeight * CONFIG.machine.physicsScale,
      { 
        isStatic: true, 
        render: { fillStyle: '#888888', strokeStyle: '#aaaaaa', lineWidth: 2, visible: false }
      }
    );
    World.add(this.engine.world, machine);

    // 创建洗衣机图片
    const washingMachineTexture = PIXI.Texture.from(chrome.runtime.getURL('assets/images/washing_machine.png'));
    const washingMachineSprite = new PIXI.Sprite(washingMachineTexture);
    washingMachineSprite.anchor.set(0.5, 0.5);
    washingMachineSprite.width = CONFIG.machine.baseWidth * CONFIG.machine.spriteScale;
    washingMachineSprite.height = CONFIG.machine.baseHeight * CONFIG.machine.spriteScale;
    washingMachineSprite.x = machine.position.x;
    washingMachineSprite.y = machine.position.y;
    this.app.stage.addChild(washingMachineSprite);

    // 创建软体猫
    const getMachineTopEdge = () => machine.position.y - (CONFIG.machine.baseHeight * CONFIG.machine.physicsScale) / 2;
    const originPos = {
      x: machine.position.x - (CONFIG.cat.cols - 1) * CONFIG.cat.spacing / 2,
      y: getMachineTopEdge() + CONFIG.cat.pinOffset - CONFIG.cat.rows * CONFIG.cat.spacing
    };

    this.softBody = Composites.softBody(
      originPos.x, originPos.y, CONFIG.cat.cols, CONFIG.cat.rows, 0, 0,
      true,
      CONFIG.cat.particleRadius,
      { 
        frictionAir: 0.3,
        restitution: 0.1,
        inertia: Infinity,
        friction: 0.8,
        density: 0.001,
        render: { fillStyle: '#00ff00', strokeStyle: '#00ff00', lineWidth: 1, visible: false }
      },
      { 
        stiffness: CONFIG.constraints.softBody.stiffness,
        damping: CONFIG.constraints.softBody.damping,
        render: { strokeStyle: '#ffff00', lineWidth: 1, visible: false }
      }
    );
    World.add(this.engine.world, this.softBody);

    // 创建固定约束
    this.createPinConstraints(machine, getMachineTopEdge, CONFIG);

    // 创建猫的贴图
    this.createCatMesh(CONFIG);

    // 设置渲染循环
    this.setupRenderLoop();
  }

  createPinConstraints(machine, getMachineTopEdge, CONFIG) {
    const { Constraint, World } = Matter;
    
    this.pinConstraints = [];
    const bottomRowStart = (CONFIG.cat.rows - 1) * CONFIG.cat.cols;
    const centerStart = Math.floor((CONFIG.cat.cols - 4) / 2);
    
    for (let i = 0; i < 4; i++) {
      const index = bottomRowStart + centerStart + i;
      const particle = this.softBody.bodies[index];
      const constraintY = getMachineTopEdge() + CONFIG.cat.pinOffset;
      
      const pin = Constraint.create({
        bodyA: particle,
        pointB: { 
          x: particle.position.x, 
          y: constraintY
        },
        length: 0,
        stiffness: CONFIG.constraints.pin.stiffness,
        damping: CONFIG.constraints.pin.damping,
        render: { strokeStyle: '#ff00ff', lineWidth: 2, visible: false }
      });
      
      this.pinConstraints.push(pin);
      World.add(this.engine.world, pin);
    }
  }

  createCatMesh(CONFIG) {
    const catTexture = PIXI.Texture.from(chrome.runtime.getURL('assets/images/cat.png'));
    const verts = new Float32Array(CONFIG.cat.cols * CONFIG.cat.rows * 2);
    const uvs = new Float32Array(CONFIG.cat.cols * CONFIG.cat.rows * 2);
    const indices = [];
    
    for (let y = 0; y < CONFIG.cat.rows; y++) {
      for (let x = 0; x < CONFIG.cat.cols; x++) {
        const idx = y * CONFIG.cat.cols + x;
        verts[idx * 2] = this.softBody.bodies[idx].position.x;
        verts[idx * 2 + 1] = this.softBody.bodies[idx].position.y;
        uvs[idx * 2] = x / (CONFIG.cat.cols - 1);
        uvs[idx * 2 + 1] = y / (CONFIG.cat.rows - 1);
        
        if (x < CONFIG.cat.cols - 1 && y < CONFIG.cat.rows - 1) {
          const a = idx, b = idx + 1, c = idx + CONFIG.cat.cols, d = idx + CONFIG.cat.cols + 1;
          indices.push(a, b, c, b, d, c);
        }
      }
    }
    
    const mesh = new PIXI.SimpleMesh(catTexture, verts, uvs, indices, PIXI.DRAW_MODES.TRIANGLES);
    mesh.tint = 0xFFFFFF;
    this.app.stage.addChild(mesh);
    
    this.catMesh = { mesh, verts };
  }

  setupRenderLoop() {
    this.app.ticker.add(() => {
      if (this.catMesh) {
        const bodies = this.softBody.bodies;
        for (let i = 0; i < bodies.length; i++) {
          this.catMesh.verts[i * 2] = bodies[i].position.x;
          this.catMesh.verts[i * 2 + 1] = bodies[i].position.y;
        }
      }
    });
  }

  // 销毁软体猫
  destroy() {
    if (this.app) {
      this.app.destroy(true);
    }
    if (this.engine) {
      Matter.Engine.clear(this.engine);
    }
    this.isInitialized = false;
  }
}

// 将 SoftCatCore 暴露到全局
window.SoftCatCore = SoftCatCore;
