// 软体猫核心逻辑 - 使用 p5.js + Matter.js 实现复杂效果
// 参考 index.html 的洗衣机软体猫效果，添加精灵图蒙皮

(function(){
	const g:any = window as any;
	
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

	let engine: any;
	let machine: any;
	let softBody: any;
	let pinConstraints: any[] = [];
	let tailBodies: any[] = [];
	let isDraggingMachine = false;
	let dragOffset = { x: 0, y: 0 };
	let initialMachinePos = { x: 0, y: 0 };
	let initialSoftBodyPositions: any[] = [];
	let initialTailPositions: any[] = [];
	let showVisualization = false;
	let p5Instance: any;
	
	// 精灵图
	let catImage: any;
	let washingMachineImage: any;
	let catMesh: any;

	function init(opts: { container: HTMLElement }) {
		const container = opts.container;
		if (g.__softcat_started) return;
		g.__softcat_started = true;

		console.log('🐱 软体猫核心逻辑开始初始化...');
		console.log('容器元素:', container);
		console.log('p5 构造函数:', typeof g.p5);

		// 检查库是否正确加载
		if (typeof g.p5 !== 'function') {
			console.error('🐱 p5 构造函数不存在！', g.p5);
			return;
		}

		if (!g.Matter || !g.Matter.Engine) {
			console.error('🐱 Matter.js 未正确加载！', g.Matter);
			return;
		}

		// 创建 p5 实例
		try {
			p5Instance = new g.p5((sk: any) => {
				console.log('🐱 p5 sketch 创建成功');
				
				sk.setup = () => {
					console.log('🐱 p5 setup 开始...');
					const cnv = sk.createCanvas(window.innerWidth, window.innerHeight);
					cnv.elt.style.pointerEvents = 'none';
					cnv.elt.style.position = 'absolute';
					cnv.elt.style.left = '0';
					cnv.elt.style.top = '0';
					cnv.elt.style.zIndex = '999999';
					container.appendChild(cnv.elt);
					console.log('🐱 Canvas 已添加到容器:', cnv.elt);

					// 加载精灵图
					loadSprites(sk);
				};
				
				sk.windowResized = () => {
					sk.resizeCanvas(window.innerWidth, window.innerHeight);
				};
				
				sk.draw = () => {
					if (!engine || !softBody) return;
					
					// 更新物理引擎
					g.Matter.Engine.update(engine, 1000/60);
					
					// 清除画布
					sk.clear(0,0,0,0);
					sk.background(0,0,0,0);
					
					// 绘制洗衣机
					drawMachine(sk);
					
					// 绘制软体猫
					drawSoftBody(sk);
					
					// 绘制尾巴
					drawTail(sk);
					
					// 绘制约束（调试用）
					if (showVisualization) {
						drawConstraints(sk);
					}
					
					// 洗衣机震动效果
					applyVibration(sk);
				};
			});
		} catch (error) {
			console.error('🐱 p5 sketch 创建失败:', error);
		}
	}

	function loadSprites(sk: any) {
		// 使用 p5 v2 的 Promise 形式加载，避免将 Promise 传给 image()
		(async () => {
			try {
				const catUrl = chrome.runtime.getURL('assets/images/cat.png');
				const washerUrl = chrome.runtime.getURL('assets/images/washing_machine.png');
				const [catImg, washerImg] = await Promise.all([
					sk.loadImage(catUrl),
					sk.loadImage(washerUrl)
				]);
				catImage = catImg;
				washingMachineImage = washerImg;
				console.log('🐱 精灵图加载完成');
			} catch (err) {
				console.warn('🐱 精灵图部分加载失败，继续使用降级形态:', err);
			} finally {
				initPhysics();
			}
		})();
	}

	function initPhysics() {
		// 初始化物理引擎
		initMatter();
		
		// 创建物理对象
		createMachine();
		createSoftBody();
		createTail();
		
		// 延迟创建约束
		setTimeout(() => {
			createPinConstraints();
			console.log('约束已添加，猫应该稳定了');
		}, 500);
		
		// 设置事件监听
		setupEventListeners(p5Instance);
		setupKeyboardControls();
	}

	function initMatter() {
		engine = g.Matter.Engine.create({ 
			constraintIterations: CONFIG.physics.constraintIterations,
			positionIterations: CONFIG.physics.positionIterations,
			velocityIterations: CONFIG.physics.velocityIterations,
			enableSleeping: false,
			gravity: CONFIG.physics.gravity
		});
		
		const runner = g.Matter.Runner.create({
			delta: 1000 / 60,
			isFixed: true
		});
		
		g.Matter.Runner.run(runner, engine);
		console.log('🐱 Matter.js 物理引擎已创建');
	}

	function createMachine() {
		const machineTopY = getMachineTopY();
		machine = g.Matter.Bodies.rectangle(
			window.innerWidth * 0.5, 
			machineTopY + CONFIG.machine.topOffset, 
			CONFIG.machine.baseWidth * CONFIG.machine.physicsScale, 
			CONFIG.machine.baseHeight * CONFIG.machine.physicsScale, 
			{ 
				isStatic: true, 
				render: { fillStyle: '#888888', strokeStyle: '#aaaaaa', lineWidth: 2 }
			}
		);
		g.Matter.World.add(engine.world, machine);
		console.log('🐱 洗衣机已创建');
	}

	function createSoftBody() {
		const originPos = getCatOriginPosition();
		
		softBody = g.Matter.Composites.softBody(
			originPos.x, originPos.y, CONFIG.cat.cols, CONFIG.cat.rows, 0, 0,
			true,  // crossBrace
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
		softBody.bodies.forEach((body: any, index: number) => {
			const row = Math.floor(index / CONFIG.cat.cols);
			const col = index % CONFIG.cat.cols;
			const x = originPos.x + col * CONFIG.cat.spacing;
			const y = originPos.y + row * CONFIG.cat.spacing;
			g.Matter.Body.setPosition(body, { x, y });
			g.Matter.Body.setVelocity(body, { x: 0, y: 0 });
			g.Matter.Body.setAngularVelocity(body, 0);
		});
		
		g.Matter.World.add(engine.world, softBody);
		console.log('🐱 软体猫已创建，位置:', originPos);
	}

	function createTail() {
		const tailBase = softBody.bodies[(CONFIG.cat.rows - 1) * CONFIG.cat.cols + (CONFIG.cat.cols - 1)];
		let prev = tailBase;
		tailBodies = [];
		
		for (let i = 0; i < CONFIG.tail.segments; i++) {
			const seg = g.Matter.Bodies.circle(
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
			
			const link = g.Matter.Constraint.create({ 
				bodyA: prev, 
				bodyB: seg, 
				length: CONFIG.tail.length, 
				stiffness: CONFIG.constraints.tail.stiffness,
				damping: CONFIG.constraints.tail.damping,
				render: { strokeStyle: '#ff8800', lineWidth: 1 }
			});
			
			g.Matter.World.add(engine.world, [seg, link]);
			tailBodies.push(seg);
			prev = seg;
		}
		console.log('🐱 尾巴已创建');
	}

	function createPinConstraints() {
		pinConstraints = [];
		
		// 只固定最底行的4个中心点
		const bottomRowStart = (CONFIG.cat.rows - 1) * CONFIG.cat.cols;
		const centerStart = Math.floor((CONFIG.cat.cols - 4) / 2);
		
		for (let i = 0; i < 4; i++) {
			const index = bottomRowStart + centerStart + i;
			const particle = softBody.bodies[index];
			const constraintY = getMachineTopEdge() + CONFIG.cat.pinOffset;
			
			const pin = g.Matter.Constraint.create({
				bodyA: particle,
				pointB: { 
					x: particle.position.x, 
					y: constraintY
				},
				length: 0,
				stiffness: CONFIG.constraints.pin.stiffness,
				damping: CONFIG.constraints.pin.damping,
				render: { strokeStyle: '#ff00ff', lineWidth: 2 }
			});
			
			pinConstraints.push(pin);
		}
		
		// 添加到世界
		pinConstraints.forEach(pin => g.Matter.World.add(engine.world, pin));
		console.log('🐱 约束已创建');
	}

	function drawMachine(sk: any) {
		if (washingMachineImage && washingMachineImage.width) {
			// 使用精灵图绘制洗衣机
			sk.imageMode(sk.CENTER);
			sk.image(
				washingMachineImage,
				machine.position.x, 
				machine.position.y,
				CONFIG.machine.baseWidth * CONFIG.machine.spriteScale,
				CONFIG.machine.baseHeight * CONFIG.machine.spriteScale
			);
		} else {
			// 备用：绘制简单矩形
			sk.fill(136, 136, 136, 200);
			sk.stroke(170, 170, 170);
			sk.strokeWeight(2);
			sk.rectMode(sk.CENTER);
			sk.rect(
				machine.position.x, 
				machine.position.y, 
				CONFIG.machine.baseWidth * CONFIG.machine.physicsScale, 
				CONFIG.machine.baseHeight * CONFIG.machine.physicsScale
			);
		}
	}

	function drawSoftBody(sk: any) {
		if (catImage && catImage.width && softBody) {
			// 使用精灵图绘制软体猫
			drawCatMesh(sk);
		} else {
			// 备用：绘制简单粒子网格
			sk.fill(255, 182, 193, 220);
			sk.noStroke();
			
			// 绘制粒子
			softBody.bodies.forEach((body: any) => {
				sk.circle(body.position.x, body.position.y, CONFIG.cat.particleRadius * 2);
			});
			
			// 绘制连接线
			sk.stroke(255, 182, 193, 150);
			sk.strokeWeight(1);
			sk.noFill();
			
			// 水平连接
			for (let row = 0; row < CONFIG.cat.rows; row++) {
				for (let col = 0; col < CONFIG.cat.cols - 1; col++) {
					const index1 = row * CONFIG.cat.cols + col;
					const index2 = row * CONFIG.cat.cols + col + 1;
					const body1 = softBody.bodies[index1];
					const body2 = softBody.bodies[index2];
					sk.line(body1.position.x, body1.position.y, body2.position.x, body2.position.y);
				}
			}
			
			// 垂直连接
			for (let row = 0; row < CONFIG.cat.rows - 1; row++) {
				for (let col = 0; col < CONFIG.cat.cols; col++) {
					const index1 = row * CONFIG.cat.cols + col;
					const index2 = (row + 1) * CONFIG.cat.cols + col;
					const body1 = softBody.bodies[index1];
					const body2 = softBody.bodies[index2];
					sk.line(body1.position.x, body1.position.y, body2.position.x, body2.position.y);
				}
			}
		}
	}

	function drawCatMesh(sk: any) {
		// 创建软体猫的网格蒙皮
		sk.push();
		
		// 计算软体猫的边界
		let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
		softBody.bodies.forEach((body: any) => {
			minX = Math.min(minX, body.position.x);
			maxX = Math.max(maxX, body.position.x);
			minY = Math.min(minY, body.position.y);
			maxY = Math.max(maxY, body.position.y);
		});
		
		const centerX = (minX + maxX) / 2;
		const centerY = (minY + maxY) / 2;
		const width = maxX - minX;
		const height = maxY - minY;
		
		// 绘制猫的精灵图
		sk.imageMode(sk.CENTER);
		sk.image(catImage, centerX, centerY, width * 1.2, height * 1.2);
		
		sk.pop();
	}

	function drawTail(sk: any) {
		// 绘制尾巴
		sk.fill(255, 136, 0, 200);
		sk.noStroke();
		
		tailBodies.forEach((body: any) => {
			sk.circle(body.position.x, body.position.y, CONFIG.tail.radius * 2);
		});
	}

	function drawConstraints(sk: any) {
		// 绘制约束线（调试用）
		sk.stroke(255, 0, 255, 100);
		sk.strokeWeight(2);
		sk.noFill();
		
		pinConstraints.forEach((pin: any) => {
			sk.line(
				pin.bodyA.position.x, pin.bodyA.position.y,
				pin.pointB.x, pin.pointB.y
			);
		});
	}

	function applyVibration(sk: any) {
		// 洗衣机震动效果
		const t = performance.now() * 0.001;
		const bottomRowStart = (CONFIG.cat.rows - 1) * CONFIG.cat.cols;
		const centerStart = Math.floor((CONFIG.cat.cols - 4) / 2);
		
		for (let i = 0; i < 4; i++) {
			const index = bottomRowStart + centerStart + i;
			g.Matter.Body.applyForce(softBody.bodies[index], softBody.bodies[index].position, { 
				x: Math.sin(t * 3 + i) * 0.00005,
				y: Math.cos(t * 2 + i) * 0.00002
			});
		}
	}

	function setupEventListeners(sk: any) {
		sk.mousePressed = () => {
			const machineBounds = getMachineBounds();
			
			if (sk.mouseX >= machineBounds.left && sk.mouseX <= machineBounds.right &&
				sk.mouseY >= machineBounds.top && sk.mouseY <= machineBounds.bottom) {
				startDragging(sk.mouseX, sk.mouseY);
			}
		};

		sk.mouseDragged = () => {
			if (isDraggingMachine) {
				updateDragging(sk.mouseX, sk.mouseY);
			}
		};

		sk.mouseReleased = () => {
			if (isDraggingMachine) {
				stopDragging();
			}
		};
	}

	function setupKeyboardControls() {
		document.addEventListener('keydown', (e) => {
			if (e.key.toLowerCase() === 'v') {
				showVisualization = !showVisualization;
				console.log('物理可视化:', showVisualization ? '显示' : '隐藏');
			} else if (e.key.toLowerCase() === 'r') {
				resetCatShape();
				console.log('猫的形状已重置');
			}
		});
	}

	function startDragging(mouseX: number, mouseY: number) {
		isDraggingMachine = true;
		dragOffset.x = mouseX - machine.position.x;
		dragOffset.y = mouseY - machine.position.y;
		
		// 记录初始位置
		initialMachinePos = { x: machine.position.x, y: machine.position.y };
		initialSoftBodyPositions = softBody.bodies.map((body: any) => ({ x: body.position.x, y: body.position.y }));
		initialTailPositions = tailBodies.map((body: any) => ({ x: body.position.x, y: body.position.y }));
		
		// 暂时移除固定约束
		pinConstraints.forEach(pin => {
			g.Matter.World.remove(engine.world, pin);
		});
	}

	function updateDragging(mouseX: number, mouseY: number) {
		const newX = mouseX - dragOffset.x;
		const newY = mouseY - dragOffset.y;
		
		// 计算移动距离
		const deltaX = newX - initialMachinePos.x;
		const deltaY = newY - initialMachinePos.y;
		
		// 更新洗衣机位置
		g.Matter.Body.setPosition(machine, { x: newX, y: newY });
		
		// 更新软体猫的位置
		softBody.bodies.forEach((body: any, index: number) => {
			const initialPos = initialSoftBodyPositions[index];
			g.Matter.Body.setPosition(body, {
				x: initialPos.x + deltaX,
				y: initialPos.y + deltaY
			});
		});
		
		// 更新尾巴位置
		tailBodies.forEach((body: any, index: number) => {
			const initialPos = initialTailPositions[index];
			g.Matter.Body.setPosition(body, {
				x: initialPos.x + deltaX,
				y: initialPos.y + deltaY
			});
		});
	}

	function stopDragging() {
		isDraggingMachine = false;
		
		// 重新添加固定约束
		pinConstraints.forEach(pin => {
			pin.pointB.x = pin.bodyA.position.x;
			pin.pointB.y = getMachineTopEdge() + CONFIG.cat.pinOffset;
			g.Matter.World.add(engine.world, pin);
		});
	}

	function resetCatShape() {
		const originPos = getCatOriginPosition();
		
		// 重新排列软体猫的粒子
		softBody.bodies.forEach((body: any, index: number) => {
			const row = Math.floor(index / CONFIG.cat.cols);
			const col = index % CONFIG.cat.cols;
			const newX = originPos.x + col * CONFIG.cat.spacing;
			const newY = originPos.y + row * CONFIG.cat.spacing;
			
			g.Matter.Body.setPosition(body, { x: newX, y: newY });
			g.Matter.Body.setVelocity(body, { x: 0, y: 0 });
			g.Matter.Body.setAngularVelocity(body, 0);
		});
		
		// 重置尾巴位置
		const tailBase = softBody.bodies[(CONFIG.cat.rows - 1) * CONFIG.cat.cols + (CONFIG.cat.cols - 1)];
		tailBodies.forEach((body: any, index: number) => {
			const newX = tailBase.position.x + (index + 1) * CONFIG.tail.length;
			const newY = tailBase.position.y;
			g.Matter.Body.setPosition(body, { x: newX, y: newY });
			g.Matter.Body.setVelocity(body, { x: 0, y: 0 });
			g.Matter.Body.setAngularVelocity(body, 0);
		});
	}

	// 辅助函数
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

	// 暴露到全局
	g.SoftCatInit = init;
	g.SoftCat = g.SoftCat || { 
		stop() { 
			console.log('🐱 软体猫停止'); 
			if (p5Instance) {
				p5Instance.remove();
			}
		} 
	};
})();