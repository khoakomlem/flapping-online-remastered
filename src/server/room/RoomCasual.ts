import { Bird, CasualPlayer, CasualWorld } from '@/game';
import {
  Room as RoomServer,
  type Client,
  type ClientArray,
} from '@colyseus/core';
import { ModuleHelper, Player } from '2d-multiplayer-world';

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
  moduleHelper = new ModuleHelper({ roomServer: this });

  onCreate(opts: any) {
    this.eventRegister();
    this.lastTime = performance.now(); // Important: Reset the lastTime
    const world = this.moduleHelper.create(CasualWorld, {});
    this.setState(world);
    this.generateWorld();
    this.startSimulate(64);

    Player.initServer(this);
  }

  onJoin(client: Client<UserData>, options: any) {
    console.log(client.sessionId, 'JOINED');

    const player = CasualPlayer.create({});
    // TODO: chỉ đc register 1 lần event rpc, và type support
    this.state.sendEvent({
      name: 'rpc:addBird',
      args: [{ x: 300 * Math.random(), id: client.sessionId }],
    });
    setTimeout(() => {
      const bird = this.state.birds.get(client.sessionId);
      if (bird) {
        console.log('player core', player.core?.id, bird.id);
        player.setCore(bird);
      }
    }, 1000);

    client.userData = {
      player,
    };
  }

  onLeave(client: Client<UserData>) {
    console.log(client.sessionId, 'LEFT!');
    this.state.sendEvent({
      name: 'rpc:removeBird',
      args: [client.sessionId],
    });
    // this.state.worldCore.entities.delete(client.userData!.player.entity.id);
  }

  onDispose() {
    this.pause();
  }

  // TODO: use this.clock.start();
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
      // console.log('TPS: ', this.tps);
    }, 1000);
  }

  eventRegister() {
    this.onMessage('ping', (client) => {
      client.send('pong', Date.now());
    });
  }

  generateWorld() {}
}
