import { type } from '@colyseus/schema';
import { Module } from '2d-multiplayer-world';
import clamp from 'lodash/clamp';
import { Graphics } from 'pixi.js';

import { type TickData } from '@/types/TickData';

const WIDTH = 1366;
const HEIGHT = 768;

type PipeData = {
  seed: number;
};

// Constructor ko co me gi het, init moi duoc tao Box hoac Graphic, Sprite
export class Pipe extends Module {
  @type('number') seed = Math.floor(Math.random() * 100); // use percent to generate the pipe
  x = WIDTH;
  width = 100;
  height = 0;

  stateClient = this.clientOnly(() => ({
    graphics: [new Graphics(), new Graphics()],
  }));

  init(data: Partial<PipeData>) {
    if (data.seed) {
      this.seed = data.seed;
    }
  }

  redrawGraphic() {
    if (!this.isClientSide()) {
      return;
    }

    const gap = 200;
    const MIN_HEIGHT = 100;

    const h1 = clamp(
      HEIGHT * (this.seed / 100) - gap / 2,
      MIN_HEIGHT,
      HEIGHT - MIN_HEIGHT - gap
    );
    const h2 = clamp(
      HEIGHT * ((100 - this.seed) / 100) - gap / 2,
      MIN_HEIGHT,
      HEIGHT - MIN_HEIGHT - gap
    );

    const pipe1 = this.stateClient.graphics[0];
    pipe1.clear();
    pipe1.lineStyle(5, 0xff0000);
    pipe1.beginFill(0x00ff00);
    pipe1.drawRect(0, 0, this.width, h1);
    pipe1.endFill();
    pipe1.x = this.x;
    pipe1.y = 0;

    const pipe2 = this.stateClient.graphics[1];
    pipe2.clear();
    pipe2.lineStyle(5, 0xff0000);
    pipe2.beginFill(0x00ff00);
    pipe2.drawRect(0, 0, this.width, h2);
    pipe2.endFill();
    pipe2.x = this.x;
    pipe2.y = HEIGHT - h2;
  }

  nextTick(tickData: TickData) {
    this.x -= 5;

    if (this.isClientSide()) {
      this.redrawGraphic();
    }
  }
}
