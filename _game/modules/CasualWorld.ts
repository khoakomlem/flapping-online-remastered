import * as PIXI from 'pixi.js';

import { RunningBackground } from '../client/background/RunningBackground';
import { PipeType } from '../constant/PipeType';
import { PipeCore } from '../entity/Pipe';
import { WorldClient, WorldCore, WorldServer } from './World';

export class CasualWorldCore extends WorldCore {
  init() {
    super.init();
    for (let i = 0; i < 100; i++) {
      const pipe = new PipeCore(this);
      const randomHeight = 100 + Math.random() * 500;
      const types = [
        // PipeType.Normal,
        PipeType.UpDown,
        // PipeType.Collapse,
        // PipeType.Open,
        // PipeType.Unstable,
        // PipeType.Spin,
        // PipeType.Small,
        // PipeType.Big,
      ];
      pipe.init({
        type: types[Math.floor(Math.random() * types.length)],
        pipes: [
          {
            pos: { x: 1000 + i * 500, y: 0 },
            width: 70,
            height: randomHeight,
          },
          {
            pos: {
              x: 1000 + i * 500,
              y: randomHeight + 300,
            },
            width: 70,
            height: window.innerHeight - randomHeight + 300,
          },
        ],
      });
      this.add(pipe).catch(console.error);
    }
  }
}

export class CasualWorldClient extends WorldClient {
  init() {
    super.init();
    const runningBg = new RunningBackground(this.app);
    this.addStage(runningBg.displayObjects);
    console.log(runningBg);
    this.app.ticker.add(() => {
      runningBg.nextTick();
    });
  }
}

export class CasualWorldServer extends WorldServer {}
