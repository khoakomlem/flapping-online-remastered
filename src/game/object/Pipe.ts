import { type } from '@colyseus/schema';
import { lerp, Module } from '2d-multiplayer-world';
import clamp from 'lodash/clamp';
import random from 'lodash/random';
import { Graphics } from 'pixi.js';
import uniqid from 'uniqid';

import { type TickData } from '@/types/TickData';

const WIDTH = 1366;
const HEIGHT = 768;
const gap = 200;
const MIN_HEIGHT = 100;

type PipeData = {
  id: string;
  seed: number;
  x: number;
  type: PipeType;
};

// Constructor ko co me gi het, init moi duoc tao Box hoac Graphic, Sprite
export class Pipe extends Module {
  @type('float32') seed = Math.random(); // use percent to generate the pipe
  @type('number') x = WIDTH;
  @type('boolean') isUp = false; // for pipe type up down

  _seed = 0;
  type: PipeType = PipeType.Normal;
  width = 100;
  height = 0;

  stateClient = this.clientOnly(() => ({
    graphics: [new Graphics(), new Graphics()],
  }));

  init(data: Partial<PipeData>) {
    if (data.id) {
      this.id = data.id;
    }

    if (data.seed) {
      this.seed = data.seed;
    }

    if (data.x) {
      this.x = data.x;
    }

    if (data.type) {
      this.type = data.type;
    }

    this._seed = this.seed;
    if (this.type === PipeType.Small) {
      this.width = 50;
    }

    if (this.type === PipeType.Big) {
      this.width = 200;
    }
  }

  redrawGraphic() {
    if (!this.isClientSide()) {
      return;
    }

    const boxes = this.getBoxes();
    this.stateClient.graphics.forEach((graphic, index) => {
      graphic.clear();
      graphic.lineStyle(5, 0xff0000);
      graphic.beginFill(0x00ff00);
      graphic.drawRect(0, 0, boxes[index].width, boxes[index].height);
      graphic.endFill();
      graphic.x = boxes[index].x;
      graphic.y = boxes[index].y;
    });
  }

  getBoxes() {
    return [
      {
        x: this.x,
        y: 0,
        width: this.width,
        height: clamp(
          HEIGHT * this.seed - gap / 2,
          MIN_HEIGHT,
          HEIGHT - MIN_HEIGHT - gap
        ),
      },
      {
        x: this.x,
        y:
          HEIGHT -
          clamp(
            HEIGHT * (1 - this.seed) - gap / 2,
            MIN_HEIGHT,
            HEIGHT - MIN_HEIGHT - gap
          ),
        width: this.width,
        height: clamp(
          HEIGHT * (1 - this.seed) - gap / 2,
          MIN_HEIGHT,
          HEIGHT - MIN_HEIGHT - gap
        ),
      },
    ];
  }

  nextTick(tickData: TickData) {
    const speed = 5;
    switch (this.type) {
      case PipeType.Normal: {
        this.x -= speed;
        break;
      }

      case PipeType.Unstable: {
        this.x -= speed;
        const newSeed = random(this._seed - 0.01, this._seed + 0.01, true);
        this.seed = clamp(newSeed, 0, 1);
        break;
      }

      case PipeType.UpDown: {
        this.x -= speed;
        if (this.isUp) {
          this.seed -= 0.002;
        } else {
          this.seed += 0.002;
        }

        if (this.isUp && this.seed <= (gap / 2 + MIN_HEIGHT) / HEIGHT) {
          this.seed = (gap / 2 + MIN_HEIGHT) / HEIGHT;
          this.isUp = false;
        }

        if (
          !this.isUp &&
          this.seed >= (HEIGHT - gap / 2 - MIN_HEIGHT) / HEIGHT
        ) {
          this.seed = (HEIGHT - gap / 2 - MIN_HEIGHT) / HEIGHT;
          this.isUp = !this.isUp;
        }

        break;
      }

      // case PipeType.Collapse: {
      //   this.x -= speed;
      //   if (this.x < WIDTH / 2) {

      //       this.seed = lerp(
      //         this.pipes[0].height,
      //         this._initData.pipes[0].height,
      //         0.1
      //       );
      //     }
      //   }

      //   break;
      // }

      // case PipeType.Open: {
      //   this.pipes.forEach((pipe) => {
      //     pipe.pos.x -= 5;
      //   });
      //   if (
      //     this.pipes[0].pos.x < window.innerWidth / 2 &&
      //     this.pipes[0].height > window.innerHeight / 2 - 150
      //   ) {
      //     this.pipes[0].height -= 2;
      //     this.pipes[1].y += 2;
      //     this.pipes[1].height -= 2;
      //   }

      //   break;
      // }

      // case PipeType.Spin: {
      //   this.pipes.forEach((pipe) => {
      //     pipe.pos.x -= 5;
      //     pipe.angle += 0.01;
      //   });
      //   break;
      // }

      case PipeType.Small:
      case PipeType.Big: {
        this.x -= speed;
        break;
      }

      default:
        break;
    }

    if (this.isClientSide()) {
      this.redrawGraphic();
      this.reconcileState();
    }
  }

  reconcileState() {
    if (this.isClientSide() && this.stateServer) {
      this.x = lerp(this.x, this.stateServer.x, 0.3);
      // this.seed = lerp(this.seed, this.stateServer.seed, 0.3);
      this.seed = this.stateServer.seed;
      this.isUp = this.stateServer.isUp;
    }
  }
}

export enum PipeType {
  Normal,
  UpDown,
  Collapse,
  Open,
  Unstable,
  Spin,
  Small,
  Big,
}
