import * as PIXI from 'pixi.js';
import {Circle} from 'detect-collisions';
import {EntityCore} from './Entity';
import {type TickData} from '@/types/TickData';

export class BirdCore extends EntityCore {
	body = new Circle({x: 200, y: 0}, 10);
	mass = (40 / 40) * 0.8;

	nextTick(_tickData: TickData): void {
		console.log(_tickData);
		this.velocity.y += this.mass;
	}

	fly() {
		this.velocity.y = -10;
	}
}

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

export class BirdServer extends EntityServer {
	constructor() {
		console.log('BirdCore');
	}
}
