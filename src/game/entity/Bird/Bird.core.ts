import {Circle} from 'detect-collisions';
import {EntityCore} from '../Entity/Entity.core';
import {type TickData} from '@/types/TickData';

export class BirdCore extends EntityCore {
	body = new Circle({x: 0, y: 0}, 10);
	mass = (40 / 40) * 0.8;

	nextTick(_tickData: TickData): void {
		console.log(_tickData);
		this.velocity.y += this.mass;
	}

	fly() {
		this.velocity.y = -10;
	}
}
