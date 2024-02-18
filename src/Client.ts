import { type CasualPlayer } from '@/game/player/Player';
import { type CasualWorld } from '@/game/world/CasualWorld';
import { Client, type Room as RoomClient } from 'colyseus.js';
import Stats from 'stats.js';

import { type TickData } from '@/types/TickData';

export class Game {
  stats = {
    fps: new Stats(),
    ping: new Stats(),
  };

  isMobile = false;

  client = new Client('ws://localhost:3000');
  room?: RoomClient<CasualWorld>;

  private readonly internal = {
    tps: 0,
    targetDelta: 1000 / 60,
    elapsedMs: 0,
    elapseTick: 0,
    accumulator: 0,
    ping: 0,
    tpsCountInterval: 0,
  };

  async connect() {
    this.room = await this.client.joinOrCreate<CasualWorld>('casual');
  }

  init() {
    document.body.appendChild(this.stats.fps.dom);
    document.body.appendChild(this.stats.ping.dom);
  }

  start(world: CasualWorld, player: CasualPlayer) {
    const gameRoot = document.getElementById('gameRoot');
    if (!world.stateClient || !gameRoot) {
      return;
    }

    gameRoot.parentNode?.replaceChild(
      world.stateClient.app.view as HTMLCanvasElement,
      gameRoot
    );

    world.stateClient.app.ticker.add((_delta) => {
      if (!world.stateClient) {
        return;
      }

      const { deltaMS } = world.stateClient.app.ticker;
      const { internal } = this;

      internal.accumulator += deltaMS;
      this.stats.fps.begin();
      while (internal.accumulator >= internal.targetDelta) {
        internal.elapseTick++;
        internal.accumulator -= internal.targetDelta;
        const tickData: TickData = {
          accumulator: internal.accumulator,
          elapsedMs: internal.elapsedMs,
          deltaMs: internal.targetDelta,
          delta: 1,
        };

        world.nextTick(tickData);
        internal.elapsedMs += internal.targetDelta;
      }

      this.stats.fps.end();
    });
  }
}
