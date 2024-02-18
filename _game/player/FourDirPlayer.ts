import { type AsyncEE } from '@/util/AsyncEE';
import { SATVector } from 'detect-collisions';

import { type TickData } from '@/types/TickData';

import { PlayerClient, PlayerCore, type PlayerEventMap } from './Player';

type CasualPlayerEventMap = PlayerEventMap & {
  shoot: () => void;
};

export class FourDirPlayerCore extends PlayerCore {
  declare event: AsyncEE<CasualPlayerEventMap>;
  fallbackSpeed = 5;

  state = {
    keyboard: {
      w: false,
      a: false,
      s: false,
      d: false,
      shift: false,
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
    },
    mouse: {
      left: false,
      middle: false,
      right: false,
    },
  };

  init() {}

  nextTick(tickData: TickData) {
    super.nextTick(tickData);
    // if (this.state.mouse.left && this.entity.inventory.current.length > 0) {
    // 	this.entity.inventory.current[0]?.primaryAction(this, world, tickData);
    // }

    this.entity?.velocity.copy(this.getSpeedV());
  }

  getSpeedV() {
    return new SATVector(
      this.state.keyboard.a ? -1 : this.state.keyboard.d ? 1 : 0,
      this.state.keyboard.w ? -1 : this.state.keyboard.s ? 1 : 0
    ).scale((1 / Math.sqrt(2)) * this.speed);
  }

  get speed() {
    return 5;
    // return this.entity.stats.speed || this.fallbackSpeed;
  }
}

export class FourDirPlayerClient extends PlayerClient {
  init() {
    super.init();
    document.addEventListener('keydown', (event) => {
      if (event.key === 'w') {
        this.playerCore.state.keyboard.w = true;
      } else if (event.key === 'a') {
        this.state.keyboard.a = true;
      } else if (event.key === 's') {
        this.state.keyboard.s = true;
      } else if (event.key === 'd') {
        this.state.keyboard.d = true;
      } else if (event.key === 'Shift') {
        this.state.keyboard.shift = true;
      } else if (event.key === '1') {
        this.state.keyboard[1] = true;
      } else if (event.key === '2') {
        this.state.keyboard[2] = true;
      } else if (event.key === '3') {
        this.state.keyboard[3] = true;
      } else if (event.key === '4') {
        this.state.keyboard[4] = true;
      } else if (event.key === '5') {
        this.state.keyboard[5] = true;
      } else if (event.key === '6') {
        this.state.keyboard[6] = true;
      } else if (event.key === '7') {
        this.state.keyboard[7] = true;
      } else if (event.key === '8') {
        this.state.keyboard[8] = true;
      } else if (event.key === '9') {
        this.state.keyboard[9] = true;
      }
    });
  }
}
