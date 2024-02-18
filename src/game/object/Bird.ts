import { Module } from '2d-multiplayer-world';
import { Sprite } from 'pixi.js';

import { type TickData } from '@/types/TickData';

const WIDTH = 1366;
const HEIGHT = 768;

export class Bird extends Module {
  pos: { x: number; y: number } = { x: 100, y: HEIGHT / 2 };
  velocity: { x: number; y: number } = { x: 0, y: 0 };

  stateClient = this.clientOnly(() => ({
    sprite: Sprite.from('images/bird.png'),
  }));

  primaryAction() {
    this.velocity.y = -12;
  }

  nextTick(tickData: TickData) {
    this.velocity.y += 1;
    this.pos.y += this.velocity.y;

    if (this.isClientSide()) {
      this.stateClient.sprite.x = this.pos.x;
      this.stateClient.sprite.y = this.pos.y;
    }
  }
}
