import { Circle, deg2rad } from 'detect-collisions';
import * as PIXI from 'pixi.js';

import { type TickData } from '@/types/TickData';

import { EntityClient, EntityCore, EntityServer } from './Entity';

export class BirdCore extends EntityCore {
  body = new Circle({ x: 0, y: 0 }, 10);
  bodies = [this.body];
  mass = (40 / 40) * 0.8;

  nextTick(_tickData: TickData): void {
    this.velocity.y += this.mass;
    if (this.body.pos.y > 800) {
      this.body.pos.y = 800;
      this.velocity.y = 0;
    }

    this.body.setAngle(
      this.velocity.y > 0
        ? -Math.PI / 6 + deg2rad(this.velocity.y * 20)
        : -Math.PI / 6
    );
  }

  primaryAction() {
    // Fly
    this.velocity.y = -12;
  }

  onCollisionEnter(_entity: EntityCore, _response: SAT.Response): void {
    this.velocity.y = 0;
    console.log('hit');
  }
}

export class BirdClient extends EntityClient {
  display?: PIXI.Sprite;
  displayObjects: PIXI.Sprite[] = [];
  declare entityCore: BirdCore;

  init() {
    this.display = PIXI.Sprite.from('images/bird.png');
    this.display.anchor.set(0.5);
    this.displayObjects.push(this.display);
  }
}

export class BirdServer extends EntityServer {}
