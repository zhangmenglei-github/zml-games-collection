/**
 *  地图
 * 
 */

export default class TileMap {
  constructor(size) {
    this.size = size;

    // 实心墙图片
    this.solidWall = new Image();
    this.solidWall.src = '../img/wall-1.png';
    // 砖墙图片
    this.brickWall = new Image();
    this.brickWall.src = '../img/wall.png';
  }

  // 地图数据
  // 0 = 空地
  // 1 = 实心墙
  // 2 = 砖块墙
  map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,2,0,2,0,0,0,0,2,2,2,0,0,2,2,0,0,2,2,0,2,2,2,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,2,1,2,1,0,1,0,1,2,1,0,1,0,1,2,1,0,1],
    [1,0,2,2,0,0,0,2,2,0,0,0,0,2,0,0,0,0,2,2,0,0,0,0,0,0,2,2,1],
    [1,0,1,2,1,0,1,2,1,0,1,0,1,0,1,2,1,0,1,0,1,0,1,2,1,2,1,0,1],
    [1,0,0,0,0,2,0,0,0,0,0,0,0,2,0,2,2,2,0,0,0,2,0,0,2,2,2,0,1],
    [1,2,1,2,1,0,1,0,1,0,1,2,1,0,1,2,1,0,1,0,1,2,1,0,1,2,1,0,1],
    [1,2,0,2,2,0,0,0,0,0,2,2,2,0,0,0,0,2,2,2,2,2,0,2,0,0,0,2,1],
    [1,0,1,0,1,2,1,0,1,0,1,2,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,2,1],
    [1,0,2,0,2,0,0,0,0,0,0,2,2,2,0,0,0,2,2,0,0,2,2,0,0,0,2,2,1],
    [1,2,1,0,1,0,1,0,1,0,1,2,1,0,1,2,1,2,1,0,1,0,1,2,1,0,1,0,1],
    [1,0,0,0,2,2,2,2,0,0,0,0,0,2,2,0,0,2,0,0,0,0,0,2,2,2,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  // 设置canvas大小
  setCanvasSize(canvas) {
    canvas.width = this.map[0].length * this.size;
    canvas.height = this.map.length * this.size;
  }

  // 绘制地图
  draw(ctx) {
    for(let row = 0; row < this.map.length; row++) {
      for(let col = 0; col < this.map[0].length; col++) {
        let val = this.map[row][col];
        if(val === 0) {
          this.#drawBlock(ctx, row, col);
        } else if(val === 1) {
          this.#drawSolidWall(ctx, row, col);
        } else if(val === 2) {
          this.#drawBrickWall(ctx, row, col);
        }
      }
    }
  }

  // 绘制空地
  #drawBlock(ctx, row, col) {
    ctx.fillStyle = 'rgb(107, 140, 255)';
    ctx.fillRect(col * this.size, row * this.size, this.size, this.size);
  }

  // 绘制实心墙
  #drawSolidWall(ctx, row, col) {
    ctx.drawImage(this.solidWall, col * this.size, row * this.size, this.size, this.size);
  }

  // 绘制砖墙
  #drawBrickWall(ctx, row, col) {
    ctx.drawImage(this.brickWall, col * this.size, row * this.size, this.size, this.size);
  }
}