import * as PIXI from 'pixi.js';

const backgroundWidth = 1366;
const backgroundHeight = 768;

export class RunningBackground {
  bg: PIXI.Sprite[] = [];
  runningBush: PIXI.Sprite[] = [];
  runningCloud: PIXI.Sprite[] = [];
  speed = 3;

  displayObjects: PIXI.DisplayObject[] = [];

  constructor(public app: PIXI.Application) {
    const bg = PIXI.Sprite.from('images/bg.png');
    bg.scale = { x: this.scale(), y: this.scale() };
    this.displayObjects.push(bg);

    for (let i = 0; i < Math.ceil(window.innerWidth / 1366) + 1; i++) {
      const runningBush = PIXI.Sprite.from('images/running-bush.png');
      const runningCloud = PIXI.Sprite.from('images/running-cloud.png');

      runningBush.x = this.scale(i * backgroundWidth);
      runningBush.y = window.outerHeight - this.scale(327);
      runningBush.scale = { x: this.scale(), y: this.scale() };

      runningCloud.x = i * this.scale(backgroundWidth);
      runningCloud.y = window.outerHeight - this.scale(790);
      runningCloud.scale = { x: this.scale(), y: this.scale() };

      this.runningBush.push(runningBush);
      this.runningCloud.push(runningCloud);
    }

    this.displayObjects.push(...this.runningCloud);
    this.displayObjects.push(...this.runningBush);
  }

  nextTick() {
    this.runningBush.forEach((runningBush) => {
      runningBush.x -= this.speed;
      if (runningBush.x < this.scale(-backgroundWidth)) {
        runningBush.x =
          this.runningBush[this.runningBush.length - 1].x +
          backgroundWidth * this.scale();
        this.runningBush.push(this.runningBush.shift()!);
      }
    });

    this.runningCloud.forEach((runningCloud) => {
      runningCloud.x -= this.speed * 0.5;
      if (runningCloud.x < this.scale(-backgroundWidth)) {
        runningCloud.x =
          this.runningCloud[this.runningCloud.length - 1].x +
          backgroundWidth * this.scale();
        this.runningCloud.push(this.runningCloud.shift()!);
      }
    });
  }

  scale(x = 1) {
    return x * (window.outerHeight / backgroundHeight);
  }
}
