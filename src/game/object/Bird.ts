import {
  lerp,
  Module,
  type,
  type EventData,
  type Schema,
} from '2d-multiplayer-world';
import { Container, Sprite } from 'pixi.js';

import { type TickData } from '@/types/TickData';

import { choosingGraph } from '../client/Choosing';
import { VectorSchema } from '../schema/VectorSchema';
import { type CasualWorld } from '../world/CasualWorld';

const WIDTH = 1366;
const HEIGHT = 768;

export class Bird extends Module {
  @type(VectorSchema) pos: VectorSchema = new VectorSchema();
  @type(VectorSchema) velocity: VectorSchema = new VectorSchema();
  @type('boolean') isDead = false;
  @type('boolean') isReady = false;

  world!: CasualWorld;

  // TODO: hỗ trợ async function load
  stateClient = this.clientOnly(() => ({
    display: new Container(),
    sprite: Sprite.from('images/bird.png'),
  }));

  init(data: Partial<{ id: string; x: number }>) {
    this.id = data?.id ?? this.id;
    this.pos.x = data?.x ?? this.pos.x;

    if (this.isClientSide()) {
      const { sprite } = this.stateClient;
      sprite.anchor.set(0.5);
      this.stateClient.display.addChild(sprite);
      if (this.world.playerId === this.id) {
        this.stateClient.display.addChild(choosingGraph());
      } else {
        sprite.alpha = 0.3;
      }
    }
  }

  primaryAction(shouldTriggerReady = true) {
    // state should not be changed too frequently

    if (!this.isReady && shouldTriggerReady) {
      this.isReady = true;
    }

    if (this.isDead) {
      return;
    }

    if (this.isClientSide() && this.world.playerId === this.id) {
      // this.world.stateClient?.sound.play();
      // @ts-expect-error amogus
      // eslint-disable-next-line prettier/prettier, no-sparse-arrays
      this.world.stateClient?.zzfx(...[, , 395, 0.01, 0.03, 0.09, , 1.2, 0.9, , , , , , , , , , 0.06]);
    }

    this.velocity.y = -13;
  }

  hitPipe() {
    if (!this.isReady || this.isDead) {
      return;
    }

    if (!this.isDead) {
      this.isDead = true;
      this.primaryAction();

      // is this bird the player's bird?
      if (this.id === this.world.playerId) {
        this.world.stateClient?.runningBg.stop();
        setTimeout(() => {
          this.world.stateClient?.runningBg.start();
        }, 2000);
      }

      setTimeout(() => {
        this.isDead = false;
        this.isReady = false;
        this.pos.x = 100;
        this.pos.y = HEIGHT / 2;
        if (this.isClientSide()) {
          this.stateClient.sprite.rotation = 0;
        }
      }, 2000);

      if (this.isClientSide()) {
        // @ts-expect-error amogus
        // eslint-disable-next-line prettier/prettier, no-sparse-arrays
        this.world.stateClient?.zzfx(...[,,79,.03,.01,.19,4,2.58,,-2,,,,.4,,,,.49,.04,.15]);
      }
    }
  }

  nextTick(tickData: TickData) {
    this.velocity.y += 1;
    this.pos.y += this.velocity.y;

    if (!this.isReady && this.pos.y > HEIGHT / 2 + 50) {
      this.primaryAction(false);
    }

    if (this.pos.y > HEIGHT || this.pos.y < 0) {
      this.isDead = true;
    }

    if (this.isClientSide()) {
      this.reconcileState();
      this.stateClient.display.x = this.pos.x;
      this.stateClient.display.y = this.pos.y;

      if (this.isDead) {
        this.stateClient.sprite.rotation -= 0.2;
      } else {
        this.stateClient.sprite.rotation = this.velocity.y / 40;
      }
    }
  }

  reconcileState() {
    if (this.stateServer) {
      if (this.isClientSide()) {
        this.pos.x = lerp(this.pos.x, this.stateServer.pos.x, 0.3);
        this.pos.y = lerp(this.pos.y, this.stateServer.pos.y, 0.3);
      }

      this.isReady = this.stateServer.isReady;
      this.isDead = this.stateServer.isDead;
    }
  }
}
