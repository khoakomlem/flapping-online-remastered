import type * as PIXI from 'pixi.js';
import {AsyncEE} from '@/util/AsyncEE.js';
import {type TickData} from '@/types/TickData.js';
import {CasualPlayerCore, type EntityClient, type EntityCore} from '@/game/index.js';
import {type Game} from '@/Game';

export abstract class PlayerCore {
	/** You need to check isReady is true before using this! */
	entity!: EntityCore;
	ee = new AsyncEE<PlayerEventMap>();
	state = {};

	get isReady() {
		return Boolean(this.entity);
	}

	init() {}

	playAs(entity: EntityCore) {
		this.entity = entity;
		this.ee.emit('ready').catch(console.error);
	}

	nextTick(_tickData: TickData) {}

	primaryAction() {
		this.entity?.primaryAction();
	}
}

export type PlayerEventMap = {
	ready: () => void;
	playAs: (entityCore: EntityCore) => void;
};

export abstract class PlayerClient {
	displayObject?: PIXI.DisplayObject;

	get isReady() {
		return this.playerCore.isReady;
	}

	constructor(public game: Game, public playerCore: PlayerCore = new CasualPlayerCore()) {}

	init() {
	}

	playAs(entityClient: EntityClient) {
		this.playerCore.playAs(entityClient.entityCore);
	}

	nextTick(_tickData: TickData) {
	}
}

export class PlayerServer {
	constructor(public playerCore: PlayerCore = new CasualPlayerCore()) {}
	init() {}

	nextTick(_tickData: TickData) {
	}
}
