import type * as PIXI from 'pixi.js';
import type {PlayerCore} from './Player.core';
import {CasualPlayerCore} from '../Casual/CasualPlayer.core';
import {type TickData} from '@/types/TickData';
import {type EntityClient} from '@/game';

export abstract class PlayerClient {
	displayObject?: PIXI.DisplayObject;

	get isReady() {
		return this.playerCore?.isReady;
	}

	constructor(public playerCore: PlayerCore = new CasualPlayerCore()) {
	}

	playAs(entityClient: EntityClient) {
		this.playerCore.playAs(entityClient.entityCore);
	}

	nextTick(tickData: TickData) {
		this.playerCore.nextTick(tickData);
	}
}
