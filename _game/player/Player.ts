import { type Game } from '@/game';
import { AsyncEE } from '@/util/AsyncEE';
import type * as PIXI from 'pixi.js';

import { type TickData } from '@/types/TickData.js';

import { type EntityClient, type EntityCore } from '../entity';

export abstract class PlayerCore {
  entity?: EntityCore;
  ee = new AsyncEE<PlayerEventMap>();

  isReady(): this is { entity: number } {
    return this.entity !== undefined;
  }

  init() {}

  playAs(entity: EntityCore) {
    this.entity = entity;
    this.ee.emit('ready').catch(console.error);
  }

  nextTick(_tickData: TickData) {}

  primaryAction() {
    this.entity?.primaryAction();
  }
}

export type PlayerEventMap = {
  ready: () => void;
  playAs: (entityCore: EntityCore) => void;
};

export abstract class PlayerClient {
  displayObject?: PIXI.DisplayObject;

  constructor(public playerCore: PlayerCore) {}

  init() {}

  isReady() {
    return this.playerCore.isReady();
  }

  playAs(entityClient: EntityClient) {
    this.playerCore.playAs(entityClient.entityCore);
  }

  nextTick(_tickData: TickData) {}
}

export class PlayerServer {
  constructor(public playerCore: PlayerCore) {}
  init() {}

  nextTick(_tickData: TickData) {}
}
