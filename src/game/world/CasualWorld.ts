import { zzfxPolyfill } from '@/util/zzfx-polyfill';
import {
  ArraySchema,
  EventSchema,
  MapSchema,
  Module,
  Schema,
  type,
  type AsyncEE,
  type EventData,
} from '2d-multiplayer-world';
import { Howl, Howler } from 'howler';
// import { type Viewport } from 'pixi-viewport';
import { Application, EventSystem } from 'pixi.js';
import uniqid from 'uniqid';

import type { TickData } from '@/types/TickData';

import { RunningBackground } from '../client/RunningBackground';
import { Bird } from '../object/Bird';
import { Pipe, PipeType } from '../object/Pipe';

export class Test extends Module {
  @type('number') test = 1;
}

export class CasualWorld extends Module {
  @type(Test) test: Test = new Test();
  @type([Test]) test2 = new ArraySchema<Test>();
  @type({ map: Bird }) birds = new MapSchema<Bird>();
  @type({ map: Pipe }) pipes = new MapSchema<Pipe>();

  playerId = '';

  declare ee: AsyncEE<{
    'rpc:addBird': (args: Parameters<Bird['init']>[0]) => 'Bird';
    'rpc:addPipe': (args: Parameters<Pipe['init']>[0]) => 'Bird';
  }>;

  async initClient() {
    const app = new Application({
      backgroundColor: '#133a2b',
      antialias: true,
      resizeTo: window,
    });

    // @ts-expect-error debugging
    globalThis.__PIXI_APP__ = app;

    // https://github.com/davidfig/pixi-viewport/issues/441#issuecomment-1628206981
    const events = new EventSystem(app.renderer);
    // @ts-expect-error events.domElement is not defined in @pixi/viewport
    events.domElement = app.renderer.view;

    const exports = {
      app,
      runningBg: new RunningBackground(),
      sound: new Howl({
        src: ['sound/flap.mp3'],
      }),
      zzfx: zzfxPolyfill(),
      viewport: undefined as unknown as InstanceType<typeof Viewport>,
    };

    const Viewport = await import('pixi-viewport').then((mod) => mod.Viewport);
    const viewport = new Viewport({
      screenWidth: app.screen.width,
      screenHeight: app.screen.height,
      events,
    });
    exports.viewport = viewport;

    viewport.addChild(viewport);

    exports.runningBg.displayObjects.forEach((displayObject) => {
      viewport.addChildAt(displayObject, 0);
    });
    return exports;
  }

  init() {
    // TODO: fix single player + server side
    // TODO: neu ko xai if !isClient thi se lag vcl
    if (!this.isClientSide()) {
      for (let i = 0; i < 100; i++) {
        this.sendEvent({
          name: 'rpc:addPipe',
          args: [
            {
              id: uniqid(),
              seed: Math.random(),
              x: 1366 + i * 500,
              // type: PipeType.Big,
              type: [
                PipeType.Normal,
                PipeType.Unstable,
                PipeType.UpDown,
                PipeType.Small,
                PipeType.Big,
              ][Math.floor(Math.random() * 5)],
            },
          ],
        });
      }

      // this.test.events.push(
      //   new EventSchema().assign({
      //     name: 'testing',
      //     args: '[]',
      //   })
      // );

      // this.test.initEvent({ roomServer: this.helper.roomServer });
      // this.test.helper = this.helper;
      // this.test.sendEvent({
      //   name: 'testing',
      //   args: [],
      // });

      // const tet = this.helper.create(Test, {});
      // this.test2.push(tet);
      // tet.sendEvent({
      //   name: 'testing',
      //   args: [],
      // });
    }
  }

  nextTick(tickData: TickData) {
    if (this.isClientSide()) {
      this.stateClient.runningBg.nextTick();
    }

    this.birds.forEach((bird) => {
      bird.nextTick(tickData);
      this.pipes.forEach((pipe) => {
        const boxes = pipe.getBoxes();
        const birdW = 0;
        const birdH = 0;
        if (
          bird.pos.x + birdW > boxes[0].x &&
          bird.pos.x < boxes[0].x + boxes[0].width
        ) {
          if (
            bird.pos.y < boxes[0].y + boxes[0].height ||
            bird.pos.y + birdH > boxes[1].y
          ) {
            bird.sendEvent({
              name: 'rpc:hitPipe',
              args: [],
            });
          }
        }
      });
    });
    this.pipes.forEach((pipe) => {
      pipe.nextTick(tickData);
    });
  }

  addBird(data: any) {
    const bird = this.helper.create(Bird, data, (bird) => {
      bird.world = this;
    });
    this.birds.set(bird.id, bird);
    if (this.isClientSide() && bird.isClientSide()) {
      this.stateClient.viewport.addChild(bird.stateClient.display);
    }

    return bird;
  }

  removeBird(id: string) {
    const bird = this.birds.get(id);
    if (bird) {
      this.birds.delete(id);
      if (this.isClientSide() && bird.isClientSide()) {
        this.stateClient.viewport.removeChild(bird.stateClient.display);
      }
    }
  }

  addPipe(data: any) {
    const pipe = this.helper.create(Pipe, data);
    this.pipes.set(pipe.id, pipe);
    console.log('addPipe', pipe.id, pipe.x, pipe.seed, pipe.type);
    if (this.isClientSide() && pipe.stateClient) {
      pipe.stateClient.graphics.forEach((graphic) => {
        this.stateClient.viewport.addChild(graphic);
        // console.log('add');
      });
    }

    return pipe;
  }
}
