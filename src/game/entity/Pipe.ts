import * as PIXI from 'pixi.js';
import {Box} from 'detect-collisions';
import {EntityCore, EntityClient, EntityServer} from '../entity';
import {type TickData} from '@/types/TickData';

export class PipeCore extends EntityCore {
	body = new Box({x: 1000, y: 0}, 50, 300);

	nextTick(_tickData: TickData): void {
		this.body.pos.x -= 5;
	}
}

export class PipeClient extends EntityClient {
	displayObject = PIXI.Sprite.from('images/pipe1.jpg');
	declare entityCore: PipeCore;

	init() {
		super.init();
		this.displayObject.width = this.entityCore.body.width;
		this.displayObject.height = this.entityCore.body.height;
		this.displayObject.anchor.set(0.5);
	}
}

export class PipeServer extends EntityServer {

}
