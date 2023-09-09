import {type TickData} from '@/types/TickData';
import {PlayerCore, PlayerClient, PlayerServer} from './Player';

export class CasualPlayerCore extends PlayerCore {
	nextTick(_tickData: TickData): void {

	}
}

export class CasualPlayerClient extends PlayerClient {
	init() {
		document.addEventListener('keydown', _event => {
			this.playerCore.primaryAction();
		});

		document.addEventListener('touchstart', _event => {
			this.playerCore.primaryAction();
		});
	}

	nextTick(_tickData: TickData): void {

	}
}

export class CasualPlayerServer extends PlayerServer {

}
