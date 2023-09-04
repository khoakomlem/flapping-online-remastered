import * as PIXI from 'pixi.js';
import {EntityClient} from '../Entity/Entity.client';
import {type BirdCore} from './Bird.core';
import {type TickData} from '@/types/TickData';

export class BirdClient extends EntityClient {
	displayObject = PIXI.Sprite.from('public/bird.png');
	declare entityCore: BirdCore;

	init(entityCore: BirdCore) {
		super.init(entityCore);
		this.displayObject.anchor.set(0.5);
	}

	nextTick(_tickData: TickData): void {
		this.displayObject.x = this.entityCore.body.pos.x;
		this.displayObject.y = this.entityCore.body.pos.y;
	}
}
