/**
 *   游戏入口
 * 
 */

import TileMap from './Tilemap.js';

// canvas
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const size = 30;  // 每块的长宽
const speed = 1;  // 速度

// 实例
const tileMap = new TileMap(size);

// 设置canvas长宽
tileMap.setCanvasSize(canvas);

// 游戏定时器
function gameLoop() {
  console.log('游戏开始...');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  tileMap.draw(ctx);
}
setInterval(gameLoop, 1000/ 75);