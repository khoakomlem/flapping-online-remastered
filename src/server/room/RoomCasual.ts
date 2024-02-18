import { CasualWorld } from '@/game';
import {
  Room as RoomServer,
  type Client,
  type ClientArray,
} from '@colyseus/core';

import { type UserData } from '@/types/UserData';

export class RoomCasual extends RoomServer<CasualWorld> {
  declare clients: ClientArray<UserData>;
  isPaused = false; // Send signal to world to pause
  confirmPaused = false; // Confirm world has paused
  targetDeltaMs = 0;
  elapsedMs = 0;
  accumulator = 0;
  lastTime = 0;
  tps = 0;
  elapsedTick = 0;
  counterTpsInterval?: NodeJS.Timeout;

  onCreate(opts: any) {
    this.eventRegister();
    this.lastTime = performance.now(); // Important: Reset the lastTime
    const world = CasualWorld.create({ roomServer: this });
    this.setState(world);
    this.generateWorld();
    this.startSimulate(128);
  }

  onJoin(client: Client<UserData>, options: any) {
    console.log(client.sessionId, 'JOINED');
  }

  onLeave(client: Client<UserData>) {
    console.log(client.sessionId, 'LEFT!');
    // this.state.worldCore.entities.delete(client.userData!.player.entity.id);
  }

  onDispose() {
    this.pause();
  }

  simulate(targetTps = 64) {
    // Const magicNumber = (0.46 * 128 / targetTps); // Based on 128 tps, best run on 1-1000tps
    // const magicNumber2 = (0.41 * 128 / targetTps); // Based on 128 tps, best run on 2000-10000tps
    let deltaMs = performance.now() - this.lastTime;
    this.lastTime = performance.now();
    if (deltaMs > 250) {
      deltaMs = 250;
    }

    this.accumulator += deltaMs;

    while (this.accumulator >= this.targetDeltaMs) {
      this.elapsedTick++;
      this.accumulator -= this.targetDeltaMs;
      const tickData = {
        accumulator: this.accumulator,
        elapsedMs: this.elapsedMs,
        deltaMs: this.targetDeltaMs,
        delta: 128 / targetTps,
      };

      // this.clients.forEach((client) => {
      //   if (client.userData) {
      //     client.userData.player.update(this.state.worldCore, tickData);
      //   }
      // });

      this.state.nextTick(tickData);
      this.elapsedMs += this.targetDeltaMs;
    }

    if (this.isPaused) {
      this.confirmPaused = true;
    } else {
      setImmediate(() => {
        this.simulate(targetTps);
      });
    }
  }

  pause() {
    this.isPaused = true;
    clearInterval(this.counterTpsInterval);
  }

  startSimulate(targetTps: number) {
    this.targetDeltaMs = 1000 / targetTps;
    // This.setPatchRate(this.targetDeltaMs);
    this.setPatchRate(30);

    if (!this.confirmPaused) {
      this.confirmPaused = false;
      this.isPaused = false;
      this.lastTime = performance.now();
      this.countTps();
      this.simulate(targetTps);
    }
  }

  countTps() {
    this.counterTpsInterval = setInterval(() => {
      this.tps = this.elapsedTick;
      this.elapsedTick = 0;
      console.log('TPS: ', this.tps);
    }, 1000);
  }

  eventRegister() {
    this.onMessage('ping', (client) => {
      client.send('pong', Date.now());
    });
  }

  generateWorld() {}
}
