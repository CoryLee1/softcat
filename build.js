#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始构建软体猫扩展...');

// 确保dist目录存在
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// 构建PIXI.js
console.log('📦 构建PIXI.js...');
try {
  execSync('npx esbuild src/vendor/pixi-entry.ts --bundle --format=iife --global-name=PIXI --outfile=dist/libs/pixi.iife.js', { stdio: 'inherit' });
  console.log('✅ PIXI.js 构建完成');
} catch (error) {
  console.error('❌ PIXI.js 构建失败:', error.message);
  process.exit(1);
}

// 构建Matter.js
console.log('📦 构建Matter.js...');
try {
  execSync('npx esbuild src/vendor/matter-entry.ts --bundle --format=iife --global-name=Matter --outfile=dist/libs/matter.iife.js', { stdio: 'inherit' });
  console.log('✅ Matter.js 构建完成');
} catch (error) {
  console.error('❌ Matter.js 构建失败:', error.message);
  process.exit(1);
}

// 构建内容脚本
console.log('📦 构建内容脚本...');
try {
  execSync('npx esbuild src/content/index.ts --bundle --format=iife --outfile=dist/content.iife.js', { stdio: 'inherit' });
  console.log('✅ 内容脚本构建完成');
} catch (error) {
  console.error('❌ 内容脚本构建失败:', error.message);
  process.exit(1);
}

// 复制资源文件
console.log('📁 复制资源文件...');
if (fs.existsSync('extension/assets')) {
  execSync('cp -r extension/assets dist/', { stdio: 'inherit' });
  console.log('✅ 资源文件复制完成');
}

// 复制新创建的文件
console.log('📁 复制新文件...');
if (fs.existsSync('dist/content-simple.js')) {
  console.log('✅ content-simple.js 已存在');
} else {
  console.log('⚠️ content-simple.js 不存在，请确保已创建');
}

if (fs.existsSync('test-simple.html')) {
  execSync('cp test-simple.html dist/', { stdio: 'inherit' });
  console.log('✅ test-simple.html 复制完成');
}

console.log('🎉 构建完成！');
console.log('📂 输出目录: dist/');
console.log('📋 文件列表:');
console.log('  - dist/manifest.json');
console.log('  - dist/background.js');
console.log('  - dist/content.iife.js');
console.log('  - dist/popup.html');
console.log('  - dist/popup.css');
console.log('  - dist/popup.js');
console.log('  - dist/libs/pixi.iife.js');
console.log('  - dist/libs/matter.iife.js');
console.log('  - dist/shared/softcat-core.js');
console.log('');
console.log('🔧 请在Chrome扩展开发者模式下加载 dist/ 目录');
