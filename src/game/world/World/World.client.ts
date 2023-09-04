import {type WorldCore, type EntityClient, type EntityCore, BirdClient} from '@/game';
import {type TickData} from '@/types/TickData';
import * as PIXI from 'pixi.js';

const EntityClientClassifiers = {
	BirdClient,
};

export abstract class WorldClient {
	app = new PIXI.Application({
		width: window.innerWidth,
		height: window.innerHeight,
		backgroundColor: '#133a2b',
		antialias: true,
		resizeTo: window,
	});

	entities = new Map<string, EntityClient>();

	constructor(public worldCore: WorldCore) {
		worldCore.ee.on('+entities', (entityCore: EntityCore) => {
			const EntityClientClassifier = EntityClientClassifiers[entityCore.constructor.name as keyof typeof EntityClientClassifiers];
			if (!EntityClientClassifier) {
				throw new Error(`EntityClientClassifier not found for ${entityCore.constructor.name}`);
			}

			const entityClient = new EntityClientClassifier(this, entityCore);
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

	nextTick(tickData: TickData) {
		this.entities.forEach(entity => {
			entity.nextTick(tickData);
		});
		this.worldCore.nextTick(tickData);
	}
}
