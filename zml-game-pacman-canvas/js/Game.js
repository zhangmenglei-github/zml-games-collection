/**
 *  游戏入口
 * 
 */ 

import TileMap from "./TileMap.js";

// canvas
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// parameter
const tileSize = 30; // 砖块尺寸                   
const speed = 2;     // 吃豆人的速度                   

const tileMap = new TileMap(tileSize);    // 地图
const pacman = tileMap.getPacman(speed);  // 吃豆人
const ghost = tileMap.getGhost(speed);    // 幽灵

let gameOver = false; // 游戏是否结束
let gameWin = false;  // 游戏是否胜利

// music
const gameOverAudio = new Audio('../audio/die.wav');
const gameWinAudio = new Audio('../audio/win.wav');
const bgAudio = new Audio('../audio/bg.mp3');

// 设置地图默认大小
tileMap.setCanvasSize(canvas);   
// 游戏定时器
setInterval(gameLoop, 1000 / 75);


// 游戏运行
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);   // 每次先清空
  tileMap.draw(ctx);                                  // 画地图
  pacman.draw(ctx, pause(), ghost);                   // 画吃豆人
  ghost.forEach(e => e.draw(ctx, pause(), pacman));   // 画幽灵
  checkGameOver();
  checkGameWin();
  drawGameDraw();                                     // 画游戏结束的提示框
  // 只有吃豆人动了，背景音乐才播放
  // 游戏结束则停止播放
  if(pacman.madeFirstMove && !gameOver && !gameWin) {
    bgAudio.play();
  }
}

// 是否暂停
// 如果游戏 输了 / 赢了，游戏暂停
function pause() {
  return !pacman.madeFirstMove || gameOver || gameWin;
}

// 判断游戏是否结束
// 根据2D碰撞检测，检测幽灵有没有碰到吃豆人
function checkGameOver() {
  if(!gameOver) {
    gameOver = ghost.some(item => !pacman.powerCoinActive && item.collidePacMan(pacman));
    if(gameOver) {
      bgAudio.pause();
      gameOverAudio.play();
    }
  }
}

// 判断游戏是否赢了
function checkGameWin() {
  if(!gameWin) {
    gameWin = tileMap.isWin();
    if(gameWin) {
      bgAudio.pause();
      gameWinAudio.play();
    }
  }
}

// 游戏结束提示框
function drawGameDraw() {
  if(gameOver || gameWin) {
    let txt = 'You Win!'
    if(gameOver) {
      txt = 'Game Over!'
    }
    ctx.fillStyle = 'black';
    ctx.fillRect(0, canvas.height / 2.5, canvas.width, 100);
    ctx.font = '80px comic sans';

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop('0', 'magenta');
    gradient.addColorStop('0.5', 'blue');
    gradient.addColorStop('1.0', 'red');

    ctx.fillStyle = gradient;
    ctx.textAlign = 'center';
    ctx.fillText(txt, canvas.width / 2, canvas.height / 1.75);
  }
}