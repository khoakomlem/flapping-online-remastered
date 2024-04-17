import { type CasualPlayer } from '@/game/player/Player';
import { type CasualWorld } from '@/game/world/CasualWorld';
import { MapSchema, Module, type Schema } from '2d-multiplayer-world';
import { Client, type Room as RoomClient } from 'colyseus.js';
import Stats from 'stats.js';

import { type TickData } from '@/types/TickData';

import { retry } from './util/retry';

export class Game {
  stats = {
    fps: new Stats(),
    ping: new Stats(),
  };

  isMobile = false;

  client = new Client('ws://khoakomlem-internal.ddns.net:3000');

  private readonly internal = {
    tps: 0,
    targetDelta: 1000 / 60,
    elapsedMs: 0,
    elapseTick: 0,
    accumulator: 0,
    ping: 0,
    tpsCountInterval: 0,
  };

  init() {
    document.body.appendChild(this.stats.fps.dom);
    document.body.appendChild(this.stats.ping.dom);
  }

  findAndAttachServerState(component: Module, serverState: Module) {
    // debugger;
    console.log('findAndAttachServerState', component.constructor.name);

    component.initServer(serverState);
    // eslint-disable-next-line guard-for-in
    for (const key in component) {
      const child = component[key as keyof typeof component];
      if (child instanceof Module) {
        // @ts-expect-error - We know that serverState[key] is a Schema
        serverState.listen(key, (state) => {
          this.findAndAttachServerState(child, state as Module);
        });
      } else if (child instanceof MapSchema) {
        // @ts-expect-error - We know that serverState[key] is a Schema
        serverState[key].onAdd(async (item) => {
          await retry(
            () => {
              const c = child.get(item.id);
              // console.log(
              //   'retry',
              //   item.id,
              //   child.get(item.id),
              //   c instanceof Module
              // );
              if (c && c instanceof Module) {
                this.findAndAttachServerState(c, item);
              } else {
                throw new Error('Not found');
              }
            },
            {
              retries: 10,
              delay: 1000,
            }
          );
        });
      }
    }
  }

  async connect<T extends CasualWorld = any>() {
    const room = await this.client.joinOrCreate<T>('casual');
    return room;
  }

  start<T extends CasualWorld>(
    world: T,
    player: CasualPlayer,
    room?: RoomClient<T>
  ) {
    // Auto attach server state to modules (only support Schema + ArraySchema), maybe not support ArraySchema<ArraySchema>
    if (room) {
      world.awatingClientState?.then((a) => {
        console.log(a, world.stateClient);
        this.findAndAttachServerState(world, room.state);
      });
    }

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

    return room;
  }
}
