import { AsyncEE } from '@/util/AsyncEE';
import { SATVector, type Body, type Response } from 'detect-collisions';
import type * as PIXI from 'pixi.js';

import { type TickData } from '@/types/TickData';

import {
  type WorldClient,
  type WorldCore,
  type WorldServer,
} from '../modules/World';

export abstract class EntityCore {
  id = String(safeId());
  markAsRemove = false;
  ee = new AsyncEE<EntityEventMap>();
  velocity = new SATVector(0, 0);

  bodies = new Array<Body>();

  constructor(public worldCore: WorldCore) {}

  init(_data: Record<string, unknown> = {}) {}

  beforeNextTick(_tickData: TickData) {
    this.bodies.forEach((body) => body.pos.add(this.velocity));
  }

  nextTick(_tickData: TickData) {}

  onCollisionEnter(_entity: EntityCore, _response: Response) {}
  onCollisionStay(_entity: EntityCore, _response: Response) {}
  onCollisionExit(_entity: EntityCore, _response: Response) {}

  primaryAction() {}
}

function safeId() {
  return Math.floor(Math.random() * 100000000000000000);
}

export type EntityEventMap = {
  // '+effects': (effect: Effect) => void;
  // '-effects': (effect: Effect) => void;

  'collision-enter': (entity: EntityCore) => void;
  'collision-stay': (entity: EntityCore) => void;
  'collision-exit': (entity: EntityCore) => void;
};

export abstract class EntityClient {
  displayObjects = new Array<PIXI.DisplayObject>();

  constructor(
    public worldClient: WorldClient,
    public entityCore: EntityCore
  ) {}

  init() {}

  initServer(_entityServer: EntityServer) {}

  nextTick(_tickData: TickData) {
    this.displayObjects.forEach((displayObject, index) => {
      displayObject.x = this.entityCore.bodies[index].pos.x;
      displayObject.y = this.entityCore.bodies[index].pos.y;
      displayObject.rotation = this.entityCore.bodies[index].angle;
    });
  }
}

export abstract class EntityServer {
  constructor(
    public worldServer: WorldServer,
    public entityCore: EntityCore
  ) {}

  init() {}
  nextTick(_tickData: TickData) {}
}
