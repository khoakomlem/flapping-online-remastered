import {type EntityCore} from '@/game';
import {type TickData} from '@/types/TickData';
import {AsyncEE} from '@/util/AsyncEE';
import {type Response, System} from 'detect-collisions';

export abstract class WorldCore {
	entities = new Map<string, EntityCore>();
	system = new System();
	collisionHashMap = new Map<string, Response>();
	newCollisionHashMap = new Map<string, Response>();
	ee = new AsyncEE<WorldEventMap>();
	events = new Array<EventData>();
	isOnline = false;

	nextTick(tickData: TickData) {
		this.newCollisionHashMap.clear();

		this.entities.forEach((entity: EntityCore, id) => {
			if (entity.markAsRemove) {
				this.addEvent('api:-entities', id).catch(console.error);
				return;
			}

			entity.beforeNextTick(tickData);
			entity.nextTick(tickData);
			this.system.updateBody(entity.body);

			this.system.checkOne(
				entity.body,
				({...response}: ResponseBodyRefEntity) => {
					const entityA = response.a.entitiyRef;
					const entityB = response.b.entitiyRef;

					if (entityA && entityB) {
						if (entityA.isStatic && entityB.isStatic) {
							// If current both entities are static, skip collision check
							return;
						}

						const uniq = genId(entityA, entityB);
						this.newCollisionHashMap.set(uniq, response);
						if (this.collisionHashMap.has(uniq)) {
							entity.onCollisionStay(entityB, response);
						} else {
							this.collisionHashMap.set(uniq, response);
							entityA.onCollisionEnter(entityB, response);
							entityA.ee
								.emit('collision-enter', entityB)
								.catch(console.error);
						}
					}
				},
			);
		});
		this.collisionHashMap.forEach(
			(response: ResponseBodyRefEntity, uniq: string) => {
				if (!this.newCollisionHashMap.has(uniq)) {
					const entityA = response.a.entitiyRef;
					const entityB = response.b.entitiyRef;
					if (entityA && entityB) {
						const uniq = genId(entityA, entityB);
						this.collisionHashMap.delete(uniq);
						entityA.onCollisionExit(entityB, response);
						entityA.ee.emit('collision-exit', entityB).catch(console.error);
					}
				}
			},
		);
	}

	async addEvent<Ev extends keyof WorldEventMap>(
		type: Ev,
		...args: Parameters<WorldEventMap[Ev]>
	) {
		if (this.isOnline) {
			return;
		}

		const event: EventData = {type, args};
		this.events.push(event);
		this.ee.emit('+events', event).catch(console.error);
		const values = await this.ee.emit(type, ...args);
		return values[0];
	}
}

export type WorldEventMap = {
	'api:+entities': (
		className: string,
		initial: Record<string, unknown>
	) => EntityCore;
	'api:-entities': (id: string) => void;
	'+entities': (entity: EntityCore) => void;
	'-entities': (entity: EntityCore) => void;
	'+events': (event: EventData) => void;
};

type EventData = {
	type: string;
	args: unknown[];
};

type BodyRefEntity = Body & {entitiyRef: EntityCore};
type ResponseBodyRefEntity = Omit<Response, 'a' | 'b'> & {
	a: BodyRefEntity;
	b: BodyRefEntity;
};

function genId(e1: EntityCore, e2: EntityCore) {
	return e1.id + e2.id;
}
