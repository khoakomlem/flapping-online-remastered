/* eslint-disable @typescript-eslint/no-empty-function */
import {type TickData} from '@/types/TickData';
import {AsyncEE} from '@/util/AsyncEE';
import {type Response, type Body, SATVector} from 'detect-collisions';

export abstract class EntityCore {
	id = String(safeId());
	isStatic = false;
	markAsRemove = false;
	ee = new AsyncEE<EntityEventMap>();
	velocity = new SATVector(0, 0);

	abstract body: Body;

	constructor() {
		console.log('BirdCore');
	}

	init(_data: Record<string, unknown>) {}

	beforeNextTick(_tickData: TickData) {
		this.body.pos.add(this.velocity);
	}

	nextTick(_tickData: TickData) {}

	onCollisionEnter(_entity: EntityCore, _response: Response) {}
	onCollisionStay(_entity: EntityCore, _response: Response) {}
	onCollisionExit(_entity: EntityCore, _response: Response) {}
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
