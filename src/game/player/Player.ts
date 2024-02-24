import { Player } from '2d-multiplayer-world';
import { type Room } from 'colyseus';
import { type Room as RoomClient } from 'colyseus.js';

import { type Bird } from '../object/Bird';

export class CasualPlayer extends Player {
  declare core?: Bird;

  initClient(roomClient: RoomClient): void {
    document.addEventListener('keydown', (event) => {
      // this.core?.primaryAction();
      // TODO: thêm args cho phép kích hoạt event, ko cần phải đợi đồng bộ với server
      // TODO: có thể xài emit broadcast
      this.sendMessage('primaryAction', '', roomClient);
    });

    document.addEventListener('touchstart', (_event) => {
      this.sendMessage('primaryAction', '', roomClient);
    });
  }

  init(): void {
    this.ee.on('primaryAction', () => {
      this.core?.sendEvent({
        id: this.core.id,
        name: 'rpc:primaryAction',
        args: [],
      });
      this.core?.primaryAction();
    });
  }
}
