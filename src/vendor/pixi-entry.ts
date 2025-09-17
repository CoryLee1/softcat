import * as PIXI from 'pixi.js';

// 将PIXI挂载到全局window对象
(window as any).PIXI = PIXI;

console.log('PIXI.js loaded:', PIXI.VERSION);
