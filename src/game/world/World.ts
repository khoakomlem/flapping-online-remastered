import * as PIXI from 'pixi.js';
import {type Response, System, type Body} from 'detect-collisions';
import {type TickData} from '@/types/TickData';
import {AsyncEE} from '@/util/AsyncEE';
import {BirdClient, type EntityClient, type EntityCore} from '../entity';
import {type Game} from '@/Game';
import {PipeClient} from '../entity/Pipe';

export abstract class WorldCore {
	entities = new Map<string, EntityCore>();
	system = new System();
	collisionHashMap = new Map<string, Response>();
	newCollisionHashMap = new Map<string, Response>();
	ee = new AsyncEE<WorldEventMap>();
	events = new Array<EventData>();
	isOnline = false;

	init() {}

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
					const entityA = response.a.entityRef;
					const entityB = response.b.entityRef;

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
							entityA.ee.emit('collision-enter', entityB).catch(console.error);
						}
					}
				},
			);
		});
		this.collisionHashMap.forEach(
			(response: ResponseBodyRefEntity, uniq: string) => {
				if (!this.newCollisionHashMap.has(uniq)) {
					const entityA = response.a.entityRef;
					const entityB = response.b.entityRef;
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
			// ignore history events when online, only server world core can
			return;
		}

		const event: EventData = {type, args};
		this.events.push(event);
		this.ee.emit('+events', event).catch(console.error);
		const values = await this.ee.emit(type, ...args);
		return values[0];
	}

	async add(entityCore: EntityCore) {
		this.system.insert(entityCore.body);
		this.entities.set(entityCore.id, entityCore);
		(entityCore as EntityCore & {body: BodyRefEntity}).body.entityRef
			= entityCore;
		// Need to reference the entity's id in the body because the body is passed to the System.checkOne callback, not the entity
		await this.ee.emit('+entities', entityCore).catch(console.error);
	}

	remove(entityCore: EntityCore) {
		this.system.remove(entityCore.body);
		this.entities.delete(entityCore.id);
		this.ee.emit('-entities', entityCore).catch(console.error);
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

type BodyRefEntity = Body & {entityRef: EntityCore};
type ResponseBodyRefEntity = Omit<Response, 'a' | 'b'> & {
	a: BodyRefEntity;
	b: BodyRefEntity;
};

function genId(e1: EntityCore, e2: EntityCore) {
	return e1.id + e2.id;
}

/* ---------------------------------------------------------------------------------- */

export abstract class WorldClient {
	static EntityClientClassifiers = {
		BirdCore: BirdClient,
		PipeCore: PipeClient,
	};

	app = new PIXI.Application({
		width: window.innerWidth,
		height: window.innerHeight,
		backgroundColor: '#133a2b',
		antialias: true,
		resizeTo: window,
	});

	entities = new Map<string, EntityClient>();

	constructor(public game: Game, public worldCore: WorldCore) {
		worldCore.ee.on('+entities', (entityCore: EntityCore) => {
			const EntityClientClassifier
				= WorldClient.EntityClientClassifiers[
					entityCore.constructor
						.name as keyof typeof WorldClient.EntityClientClassifiers
				];
			if (!EntityClientClassifier) {
				throw new Error(
					`EntityClientClassifier not found for ${entityCore.constructor.name}`,
				);
			}

			const entityClient = new EntityClientClassifier(this, entityCore);
			entityClient.init();
			this.entities.set(entityCore.id, entityClient);
			this.app.stage.addChild(entityClient.displayObject);

			// Const entityServer = this.room.state.entities.get(entityCore.id);
			// if (entityServer) {
			// 	entityClient.initServer(entityServer);
			// } else {
			// 	// Previous object that have been removed from the server but still exists on worldCore.events(api:entities add) to be re-add
			// }

			// if (entityCore.id === this.room.sessionId) {
			// 	this.playAs(entityCore);
			// }
		});

		worldCore.ee.on('-entities', (entityCore: EntityCore) => {
			const entity = this.entities.get(entityCore.id);
			if (entity) {
				this.app.stage.removeChild(entity.displayObject);
				this.entities.delete(entityCore.id);
			}
		});
	}

	init() {}

	nextTick(tickData: TickData) {
		this.entities.forEach(entity => {
			entity.nextTick(tickData);
		});
	}
}

/* ---------------------------------------------------------------------------------- */

export abstract class WorldServer {
	constructor(public worldCore: WorldCore) {}
	init() {}

	nextTick(_tickData: TickData) {}
}
