import { type TickData } from '@/types/TickData';

import { PlayerClient, PlayerCore, PlayerServer } from './Player';

export class CasualPlayerCore extends PlayerCore {
  nextTick(_tickData: TickData): void {}
}

export class CasualPlayerClient extends PlayerClient {
  constructor(playerCore: CasualPlayerCore = new CasualPlayerCore()) {
    super(playerCore);
  }

  init() {
    document.addEventListener('keydown', (event) => {
      this.playerCore.primaryAction();
    });

    document.addEventListener('touchstart', (_event) => {
      this.playerCore.primaryAction();
    });
  }

  nextTick(_tickData: TickData): void {}
}

export class CasualPlayerServer extends PlayerServer {}
