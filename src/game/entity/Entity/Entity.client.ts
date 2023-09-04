import type * as PIXI from 'pixi.js';
import {type EntityCore} from '../Entity/Entity.core';
import {type EntityServer, type WorldClient} from '@/game';
import {type TickData} from '@/types/TickData';

export abstract class EntityClient {
	abstract displayObject: PIXI.DisplayObject;

	constructor(public world: WorldClient, public entityCore: EntityCore) {
	}

	init(entityCore: EntityCore) {
		console.log(this.displayObject);
		this.displayObject.x = entityCore.body.pos.x;
		this.displayObject.y = entityCore.body.pos.y;
	}

	initServer(_entityServer: EntityServer) {}

	nextTick(tickData: TickData) {
		this.entityCore.nextTick(tickData);
	}
}
