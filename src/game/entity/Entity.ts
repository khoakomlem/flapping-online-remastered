import type * as PIXI from 'pixi.js';
import {type Response, type Body, SATVector} from 'detect-collisions';
import {type TickData} from '@/types/TickData';
import {type WorldCore, type WorldClient, type WorldServer} from '../world/World';
import {AsyncEE} from '@/util/AsyncEE';

export abstract class EntityCore {
	id = String(safeId());
	isStatic = false;
	markAsRemove = false;
	ee = new AsyncEE<EntityEventMap>();
	velocity = new SATVector(0, 0);

	abstract body: Body;

	constructor(public worldCore: WorldCore) {}

	init(_data: Record<string, unknown> = {}) {}

	beforeNextTick(_tickData: TickData) {
		this.body.pos.add(this.velocity);
	}

	nextTick(_tickData: TickData) {}

	onCollisionEnter(_entity: EntityCore, _response: Response) {}
	onCollisionStay(_entity: EntityCore, _response: Response) {}
	onCollisionExit(_entity: EntityCore, _response: Response) {}

	primaryAction() {}
}

function safeId() {
	return Math.floor(Math.random() * 100000000000000000);
}

export type EntityEventMap = {
	// '+effects': (effect: Effect) => void;
	// '-effects': (effect: Effect) => void;

	'collision-enter': (entity: EntityCore) => void;
	'collision-stay': (entity: EntityCore) => void;
	'collision-exit': (entity: EntityCore) => void;
};

export abstract class EntityClient {
	abstract displayObject: PIXI.DisplayObject;

	constructor(public worldClient: WorldClient, public entityCore: EntityCore) {
	}

	init() {
		this.displayObject.x = this.entityCore.body.pos.x;
		this.displayObject.y = this.entityCore.body.pos.y;
	}

	initServer(_entityServer: EntityServer) {}

	nextTick(_tickData: TickData) {
		this.displayObject.x = this.entityCore.body.pos.x;
		this.displayObject.y = this.entityCore.body.pos.y;
	}
}

export abstract class EntityServer {
	constructor(public worldServer: WorldServer, public entityCore: EntityCore) {
	}

	init() {}
	nextTick(_tickData: TickData) {
	}
}
