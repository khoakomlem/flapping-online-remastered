import { Player } from '2d-multiplayer-world';

import { type Bird } from '../object/Bird';

export class CasualPlayer extends Player {
  declare core: Bird;

  init(): void {
    document.addEventListener('keydown', (event) => {
      this.core.primaryAction();
    });

    document.addEventListener('touchstart', (_event) => {
      this.core.primaryAction();
    });
  }
}
