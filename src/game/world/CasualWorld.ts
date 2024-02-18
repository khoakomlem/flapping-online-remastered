import { ArraySchema, Schema, type } from '@colyseus/schema';
import { Module } from '2d-multiplayer-world';
import { Application } from 'pixi.js';

import { type TickData } from '@/types/TickData';

import { Bird } from '../object/Bird';
import { Pipe } from '../object/Pipe';

class Block extends Schema {
  @type('number') x: number;
  @type('number') y: number;
}

// class MyState extends Module {
//   @type([Block]) blocks = new ArraySchema<Block>();
// }
export class CasualWorld extends Module {
  @type([Block]) test = new ArraySchema<Block>();
  // @type([Bird]) birds = new ArraySchema<Bird>();
  // @type([Pipe]) pipes = new ArraySchema<Pipe>();

  stateClient = this.clientOnly(() => ({
    app: new Application({
      backgroundColor: '#133a2b',
      antialias: true,
      resizeTo: window,
    }),
  }));

  init() {
    // for (let i = 0; i < 100; i++) {
    //   const pipe = Pipe.create({
    //     roomClient: this.roomClient,
    //     roomServer: this.roomServer,
    //   });
    //   pipe.x = i * 300;
    //   this.pipes.push(pipe);
    //   if (this.isClientSide()) {
    //     pipe.stateClient?.graphics.forEach((graphic) => {
    //       this.stateClient.app.stage.addChild(graphic);
    //     });
    //   }
    // }
    // if (this.isClientSide()) {
    //   // this.birds.forEach((bird) => {
    //   //   if (bird.stateClient)
    //   //     this.stateClient.app.stage.addChild(bird.stateClient.sprite);
    //   // });
    // }
  }

  nextTick(tickData: TickData) {
    // // this.birds.forEach((bird) => {
    // //   bird.nextTick(tickData);
    // // });
    // this.pipes.forEach((pipe) => {
    //   pipe.nextTick(tickData);
    // });
  }
}
