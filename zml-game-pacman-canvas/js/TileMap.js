/**
 *  地图类
 * 
 */ 

import Pacman from "./Pacman.js";
import Direction from "./Direction.js";
import Ghost from "./Ghost.js";

export default class TileMap {
  constructor(tileSize) {
    this.tileSize = tileSize;

    // 金币
    this.coinDot = new Image();
    this.coinDot.src = "../img/coin1.png";

    // 粉色金币
    this.pinkCoinDot = new Image();
    this.pinkCoinDot.src = "../img/coinPink.png";

    // 墙
    this.wall = new Image();
    this.wall.src = "../img/wall.png";

    // 闪光金币定时器
    this.powerCoinTimerDefault = 40;
    this.powerCoinTimer = this.powerCoinTimerDefault;
    this.powerCoinDot = this.coinDot;
  }

  // 地图数据
  // 0 = 金币   
  // 1 = 墙   
  // 4 = 吃豆人  
  // 5 = 空地
  // 6 = 幽灵
  // 7 = 闪光buff金币
  map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,6,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,4,1],
    [1,0,1,0,1,1,1,1,0,1,1,1,1,0,1,0,0,1,0,1],
    [1,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,0,1,0,1],
    [1,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,0,1,0,1],
    [1,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,0,1,0,1],
    [1,0,1,0,0,0,6,1,0,0,0,0,1,0,1,0,0,1,0,1],
    [1,7,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,7,1],
    [1,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,7,1,0,1],
    [1,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,1],
    [1,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,1],
    [1,0,1,0,1,0,0,0,0,0,0,6,1,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,1,0,1,1,1,1,0,0,0,0,1,0,1],
    [1,6,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,6,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ]

  // 遍历地图
  draw(ctx) {
    for(let i = 0; i < this.map.length; i++) {
      for(let j = 0; j < this.map[0].length; j++) {
        let tile = this.map[i][j];
        if(tile === 1) {
          this.#drawWall(ctx, i, j, this.tileSize);
        } else if(tile === 0) {
          this.#drawCoin(ctx, i, j, this.tileSize);
        } else if(tile === 7) {
          this.#drawSuperCoin(ctx, i, j, this.tileSize)
        } 
        else {
          this.#drawBlank(ctx, i, j, this.tileSize);
        }

        // ctx.strokeStyle = 'red';
        // ctx.strokeRect(j * this.tileSize, i * this.tileSize, this.tileSize, this.tileSize);
      }
    }
  }

  // 绘制墙
  #drawWall(ctx, row, col, size) {
    ctx.drawImage(this.wall, col * size, row * size, size, size);
  }

  // 绘制金币
  #drawCoin(ctx, row, col, size) {
    ctx.drawImage(this.coinDot, col * size, row * size, size, size);
  }

  // 绘制超级金币（buffer: 使怪物弱化）
  #drawSuperCoin(ctx, row, col, size) {
    this.powerCoinTimer--;
    if(this.powerCoinTimer == 0) {
      this.powerCoinTimer = this.powerCoinTimerDefault;
      if(this.powerCoinDot == this.pinkCoinDot) {
        this.powerCoinDot = this.coinDot
      } else {
        this.powerCoinDot = this.pinkCoinDot;
      }
    }
    ctx.drawImage(this.powerCoinDot, col * size, row * size, size, size);
  }

  // 绘制空地
  #drawBlank(ctx, row, col, size) {
    ctx.fillStyle = 'black';
    ctx.fillRect(col * size, row * size, size, size);
  }

  // 获取吃豆人在哪
  getPacman(speed) {
    for(let i = 0; i < this.map.length; i++) {
      for(let j = 0; j < this.map[0].length; j++) {
        let tile = this.map[i][j];
        if(tile == 4) {
          this.map[i][j] = 0;
          return new Pacman(
            j * this.tileSize,
            i * this.tileSize,
            this.tileSize,
            speed,
            this
          );
        }
      }
    }
  }

  // 获取所有幽灵
  getGhost(speed) {
    const ghosts = [];
    for(let i = 0; i < this.map.length; i++) {
      for(let j = 0; j < this.map[0].length; j++) {
        const tile = this.map[i][j];
        if(tile === 6) {
          this.map[i][j] = 0;
          ghosts.push(
            new Ghost(
              j * this.tileSize,
              i * this.tileSize,
              this.tileSize,
              speed,
              this
            )
          );
        }
      }
    }
    return ghosts;
  }

  // 设置画布大小
  setCanvasSize(canvas) {
    canvas.width = this.map[0].length * this.tileSize;
    canvas.height = this.map.length * this.tileSize;
  }

  // 是否撞墙 可以是吃豆人 也可以是幽灵
  isCollideWall(x, y, direction) {
    if(direction == null) {
      return;
    }

    if(Number.isInteger(x / this.tileSize) && Number.isInteger(y / this.tileSize)) {
      let col = 0;    // 纵坐标
      let row = 0;    // 横坐标
      let nextCol = 0;  // 下一块的左距离
      let nextRow = 0;  // 下一块的上距离

      switch(direction) {
        case Direction.up:
          nextRow = y - this.tileSize;
          row = nextRow / this.tileSize;
          col = x / this.tileSize;
          break;
        case Direction.down:
          nextRow = y + this.tileSize;
          row = nextRow / this.tileSize;
          col = x / this.tileSize;
          break;
        case Direction.left:
          nextCol = x - this.tileSize;
          col = nextCol / this.tileSize;
          row = y / this.tileSize;
          break;
        case Direction.right:
          nextCol = x + this.tileSize;
          col = nextCol / this.tileSize;
          row = y / this.tileSize;
          break;
      }
      
      const tile = this.map[row][col];
      if(tile === 1) {
        return true;
      }
    }
    return false;
  }

  // 是否吃到豆豆
  isEatDot(x, y) {
    const row = y / this.tileSize;
    const col = x / this.tileSize;
    if(Number.isInteger(row) && Number.isInteger(col)) {
      if(this.map[row][col] === 0) {
        this.map[row][col] = 5;
        return true;
      }
    }
    return false;
  }

  // 是否吃到闪光豆豆
  isEatPowerDot(x, y) {
    const row = y / this.tileSize;
    const col = x / this.tileSize;
    if(Number.isInteger(row) && Number.isInteger(col)) {
      if(this.map[row][col] === 7) {
        this.map[row][col] = 5;
        return true;
      }
    }
    return false;
  }

  // 判断是否赢了
  // flat() 方法方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回
  isWin() {
    const len = this.map.flat().filter(item => item === 0).length;
    return len === 0;
  }
}