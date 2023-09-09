import * as PIXI from 'pixi.js';
import {Circle} from 'detect-collisions';
import {EntityCore, EntityClient, EntityServer} from './Entity';
import {type TickData} from '@/types/TickData';

export class BirdCore extends EntityCore {
	body = new Circle({x: 200, y: 0}, 10);
	mass = (40 / 40) * 0.8;

	nextTick(_tickData: TickData): void {
		this.velocity.y += this.mass;
		if (this.body.pos.y > 800) {
			this.body.pos.y = 800;
			this.velocity.y = 0;
		}
	}

	primaryAction() {
		// Fly
		this.velocity.y = -10;
	}
}

export class BirdClient extends EntityClient {
	displayObject = PIXI.Sprite.from('images/bird.png');
	declare entityCore: BirdCore;

	init() {
		super.init();
		this.displayObject.anchor.set(0.5);
	}
}

export class BirdServer extends EntityServer {
}
