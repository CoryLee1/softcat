import * as Matter from 'matter-js';

// 将Matter挂载到全局window对象
(window as any).Matter = Matter;

console.log('Matter.js loaded:', Matter.version);
