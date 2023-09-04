import {type TickData} from '@/types/TickData';
import {PlayerCore} from './Player';

export class CasualPlayerCore extends PlayerCore {
	nextTick(_tickData: TickData): void {

	}
}

export class CasualPlayerClient extends PlayerClient {
	nextTick(_tickData: TickData): void {

	}
}

export class CasualPlayerServer extends PlayerServer {

}
