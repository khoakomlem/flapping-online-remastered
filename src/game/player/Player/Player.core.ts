import {AsyncEE} from '@/util/AsyncEE.js';
import {type TickData} from '@/types/TickData.js';
import {type EntityCore} from '@/game/index.js';

export abstract class PlayerCore {
	/** You need to check isReady is true before using this! */
	entity!: EntityCore;
	ee = new AsyncEE<PlayerEventMap>();
	state = {};

	get isReady() {
		return Boolean(this.entity);
	}

	playAs(entity: EntityCore) {
		this.entity = entity;
		this.ee.emit('ready').catch(console.error);
	}

	nextTick(_tickData: TickData) {}
}

export type PlayerEventMap = {
	ready: () => void;
};
