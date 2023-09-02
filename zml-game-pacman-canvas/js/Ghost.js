/**
 *  幽灵类
 * 
 */ 

import Direction from "./Direction.js";

export default class Ghost {
  constructor(x, y, size, speed, tileMap) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.tileMap = tileMap;

    this.#laodImages();

    this.randomMoveDir = Math.floor(
      Math.random() * Object.keys(Direction).length
    );              // 随机获取一个方向

    this.directionTimerDefault = this.#random(10, 30);  // 默认多长时间切换一次方向, 值越小，幽灵换方向越频繁
    this.directionTimer = this.directionTimerDefault;   // 实际切换时间递减，到0时，表示要切换了

    this.blinkAboutToExpireTimerDefault = 10;           // 默认闪烁的间隔（也就是频繁的切换图片）
    this.blinkAboutToExpireTimer = this.blinkAboutToExpireTimerDefault; // 闪烁间隔递减，到0时，切换图片
  }

  // 画幽灵
  draw(ctx, pause, pacman) {
    if(!pause) {
      this.#move();
      this.#changeDirection();
    }
    this.#setImage(ctx, pacman);
  }
  #setImage(ctx, pacman) {
    // 如果吃到了闪光豆豆，则需要让幽灵变色
    if(pacman.powerCoinActive) {
      this.#setImageWhenEatPowerCoin(pacman);
    } else {
      this.ghostImageActive = this.ghostImageDefault;
    }
    ctx.drawImage(this.ghostImageActive, this.x, this.y, this.size, this.size);
  }

  // 吃到闪光豆豆了，幽灵要变色了
  // 到一半的时候，需要闪烁
  #setImageWhenEatPowerCoin(pacman) {
    if(pacman.powerCoinAboutToExpire) {
      this.blinkAboutToExpireTimer--;
      if(this.blinkAboutToExpireTimer == 0) {
        this.blinkAboutToExpireTimer = this.blinkAboutToExpireTimerDefault;
        if(this.ghostImageActive == this.ghostImageBlink1) {
          this.ghostImageActive = this.ghostImageBlink2;
        } else {
          this.ghostImageActive = this.ghostImageBlink1;
        }
      }
    } else {
      this.ghostImageActive = this.ghostImageBlink1;
    }
  }

  // 幽灵移动
  #move() {
    // 如果没撞墙
    if(!this.tileMap.isCollideWall(this.x, this.y, this.randomMoveDir)) {
      switch (this.randomMoveDir) {
        case Direction.up:
          this.y -= this.speed;
          break;
        case Direction.down:
          this.y += this.speed;
          break;
        case Direction.left:
          this.x -= this.speed;
          break;
        case Direction.right:
          this.x += this.speed;
          break;
      }
    }
  }

  // 改变方向
  #changeDirection() {
    this.directionTimer--;
    let newMoveDirection = null;
    if(this.directionTimer == 0) {
      this.directionTimer = this.directionTimerDefault;
      newMoveDirection = Math.floor(
        Math.random() * Object.keys(Direction).length
      );
    }

    if(newMoveDirection != null && this.randomMoveDir != newMoveDirection) {
      if(Number.isInteger(this.x / this.size) && Number.isInteger(this.y / this.size)) {
        if(!this.tileMap.isCollideWall(this.x, this.y, newMoveDirection)) {
          this.randomMoveDir = newMoveDirection;
        }
      }
    }
  }

  // 获取幽灵图像
  #laodImages() {
    this.ghostImageDefault = new Image();
    this.ghostImageDefault.src = '../img/ghost1.png';

    this.ghostImageBlink1 = new Image();
    this.ghostImageBlink1.src = '../img/ghost2.png';

    this.ghostImageBlink2 = new Image();
    this.ghostImageBlink2.src = '../img/ghost3.png';

    this.ghostImageActive = this.ghostImageDefault; // 当前图片
  }

  // 获取区间随机数
  #random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // 2D碰撞检测 - 判断是否撞到吃豆人
  collidePacMan(pacman) {
    const size = this.size / 1.5;
    if(
      this.x < pacman.x + size && 
      this.x + size > pacman.x &&
      this.y < pacman.y + size &&
      this.y + size > pacman.y
    ) {
      return true;
    }
    return false;
  }
}