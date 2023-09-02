/**
 *  pacman类
 * 
 */ 

import moveDirection from "./Direction.js";

export default class Pacman {
  constructor(x, y, size, speed, tileMap) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.tileMap = tileMap;

    this.currentDirection = null;                             // 当前运动的方向
    this.requestDirection = null;                             // 期望的方向（我想让它改变的方向）

    this.pacmanAnimateTimerDefault = 10;                      // 吃豆人动画  默认值
    this.pacmanAnimateTimer = null;                           // 吃豆人多久换下一张图片

    this.pacmanRotate = this.rotates.left;                    // 吃豆人旋转

    this.eatAudio = new Audio('../audio/eat.wav');            // 吃豆豆音效
    this.eatPowerAudio = new Audio('../audio/eatPower.mp3');  // 吃闪光豆豆音效
    this.powerCoinActive = false;                             // 是否吃到了闪光豆豆
    this.powerCoinAboutToExpire = false;                      // 闪光豆豆的效果是否快失效了，如果一个闪光豆豆的效果是6s，那当第3秒的时候，就让幽灵闪烁起来，提示用户快失效了
    this.timer = [];                                          // 存放闪光豆豆效果的计时器，和失效的计时器。

    this.eatGhostAudio = new Audio('../audio/eatGhost.wav');  // 吃幽灵音效

    this.madeFirstMove = false;                               // 吃豆人是否已经开始移动了，true移动了，这时候幽灵也可以移动了

    this.#loadPacmanImages();

    document.addEventListener('keydown', this.#keyDown);      // 监听键盘上下左右
  }

  //  旋转角度
  rotates = {
    left: 0,
    up: 1,
    right: 2,
    down: 3
  }

  draw(ctx, pause, ghosts) {
    if(!pause) {
      this.#move();
      this.#pacmanAnimate();  // 吃豆人本身动画
    }
    this.#eatDot();         // 吃豆豆
    this.#eatPowerDot();    // 吃闪光豆豆
    this.#eatGhost(ghosts); // 吃幽灵

    // 绘制吃豆人，需要注意的重点
    // ctx.drawImage(this.pacmanImgs[this.pacmanIndex], this.x, this.y, this.size, this.size);
    const size = this.size / 2;
    ctx.save();
    ctx.translate(this.x + size, this.y + size);
    ctx.rotate((this.pacmanRotate * 90 * Math.PI) / 180);
    ctx.drawImage(this.pacmanImgs[this.pacmanIndex], -size, -size, this.size, this.size);
    ctx.restore();
  }

  // 获取吃豆人所需图片，每一帧图片
  #loadPacmanImages() {
    const pacmanImg1 = new Image();
    pacmanImg1.src = '../img/pacman1.png';
    const pacmanImg2 = new Image();
    pacmanImg2.src = '../img/pacman2.png';
    const pacmanImg3 = new Image();
    pacmanImg3.src = '../img/pacman3.png';
    const pacmanImg4 = new Image();
    pacmanImg4.src = '../img/pacman2.png';

    this.pacmanImgs = [pacmanImg1, pacmanImg2, pacmanImg3, pacmanImg4]; // 吃豆人图片数组
    this.pacmanIndex = 1;   // 默认显示第一张
  }

  // 吃豆人张嘴闭嘴动效
  #pacmanAnimate() {
    if(this.pacmanAnimateTimer == null) {
      return;
    }
    this.pacmanAnimateTimer--;
    if(this.pacmanAnimateTimer == 0) {
      this.pacmanAnimateTimer = this.pacmanAnimateTimerDefault;
      this.pacmanIndex++;
      if(this.pacmanIndex == this.pacmanImgs.length) {
        this.pacmanIndex = 0;
      }
    }
  }

  // 监听键盘事件
  #keyDown = (e) => {
    // up
    if(e.keyCode == 38) {
      if(this.currentDirection == moveDirection.down) {
        this.currentDirection = moveDirection.up;
      }
      this.requestDirection = moveDirection.up;
      this.madeFirstMove = true;
    }
    // down
    if(e.keyCode == 40) {
      if(this.currentDirection == moveDirection.up) {
        this.currentDirection = moveDirection.down;
      }
      this.requestDirection = moveDirection.down;
      this.madeFirstMove = true;
    }
    // left
    if(e.keyCode == 37) {
      if(this.currentDirection == moveDirection.right) {
        this.currentDirection = moveDirection.left;
      }
      this.requestDirection = moveDirection.left;
      this.madeFirstMove = true;
    }
    // right
    if(e.keyCode == 39) {
      if(this.currentDirection == moveDirection.left) {
        this.currentDirection = moveDirection.right;
      }
      this.requestDirection = moveDirection.right;
      this.madeFirstMove = true;
    }
  }

  // 移动
  #move() {
    // 如果当前移动方向与期望的移动方向不一样，说明你想转弯了
    // 但是你还不能随便转弯，需要当吃豆人的上距离 并且左距离 正好够方块size的整数
    // 比如总不能走到某个墙的一半的时候转弯吧，这是不可行的
    if(this.currentDirection !== this.requestDirection) {
      // isInteger() 函数用于检测指定参数是否为无整数，如果是整数返回 true，否则返回 false
      if(Number.isInteger(this.x / this.size) && Number.isInteger(this.y / this.size)) {
        // 判断是否撞到了墙, 当期望方向上的第一块不是墙，才可以转弯
        // 比如当前方向是向右的，我突然按了下，这时候就需要判断下面那一块是否有墙，有则不能转弯
        if(!this.tileMap.isCollideWall(this.x, this.y, this.requestDirection)) {
          this.currentDirection = this.requestDirection;
        }
      }
    }

    // 一直朝一个方向移动，如果撞墙了，则停止，并且吃豆人动画暂停
    if(this.tileMap.isCollideWall(this.x, this.y, this.currentDirection)) {
      this.pacmanAnimateTimer = null;
      this.pacmanIndex = 1;
      return;
    } else if(this.currentDirection != null && this.pacmanAnimateTimer == null) {
      this.pacmanAnimateTimer = this.pacmanAnimateTimerDefault;
    }

    switch (this.currentDirection) {
      case moveDirection.up:
        this.y -= this.speed;
        this.pacmanRotate = this.rotates.up;
        break;
      case moveDirection.down:
        this.y += this.speed;
        this.pacmanRotate = this.rotates.down;
        break;
      case moveDirection.left:
        this.x -= this.speed;
        this.pacmanRotate = this.rotates.left;
        break;
      case moveDirection.right:
        this.x += this.speed;
        this.pacmanRotate = this.rotates.right;
        break;
    }
  }

  // 吃豆豆
  // 如果吃到了，则会播音效
  #eatDot() {
    if(this.tileMap.isEatDot(this.x, this.y) && this.madeFirstMove) {
      // play() failed because the user didn't interact with the document first.
      // 这个错误信息，其实就是最新的浏览器告诉你，现在不能上来就播放音乐了，得需要跟播放做交互动作
      // 这时候只要加上我们定义的 madeFirstMove 即可，
      // this.eatAudio.play();
    }
  }

  // 吃闪光豆豆
  #eatPowerDot() {
    if(this.tileMap.isEatPowerDot(this.x, this.y)) {
      // 播放音效
      this.eatPowerAudio.play();

      // 弱化效果
      this.powerCoinActive = true;          // 效果开启
      this.powerCoinAboutToExpire = false;  // 这时候还不用提示快失效了
      
      // 默认先清空，防止吃完第一颗闪光豆豆后，时间还没到，又吃第二颗
      this.timer.forEach(timer => clearTimeout(timer));
      this.timer = [];

      //  效果一共持续时间
      let powerCoinActiveTimer = setTimeout(() => {
        this.powerCoinActive = false;
        this.powerCoinAboutToExpire = false;
      }, 1000 * 6);

      this.timer.push(powerCoinActiveTimer);

      // 时间到达一半的时候，需要提示快失效了
      let powerCoinAboutToExpireTimer = setTimeout(() => {    
        this.powerCoinAboutToExpire = true;
      }, 1000 * 3);

      this.timer.push(powerCoinAboutToExpireTimer);
    }
  }

  // 吃幽灵
  // 只有吃了闪光豆豆才能吃幽灵
  #eatGhost(ghosts) {
    if(this.powerCoinActive) {
      const collideGhost = ghosts.filter(item => item.collidePacMan(this));
      collideGhost.forEach(item => {
        ghosts.splice(ghosts.indexOf(item), 1);
        this.eatGhostAudio.play();
      });
    }
  }
}