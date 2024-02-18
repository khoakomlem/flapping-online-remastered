import { type Game } from '@/game/Game';
import { AsyncEE } from '@/util/AsyncEE';
import { System, type Body, type Response } from 'detect-collisions';
import * as PIXI from 'pixi.js';

import { type TickData } from '@/types/TickData';

import {
  BirdClient,
  BirdCore,
  type EntityClient,
  type EntityCore,
} from '../entity';
import { PipeClient } from '../entity/Pipe';

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

      entity.bodies.forEach((body) => {
        this.system.updateBody(body);
        this.system.checkOne(body, ({ ...response }: ResponseBodyRefEntity) => {
          const entityA = response.a.entityRef;
          const entityB = response.b.entityRef;

          if (entity instanceof BirdCore) {
            console.log(response);
            console.log(this.system);
            // debugger;
          }

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
        });
      });
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
      }
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

    const event: EventData = { type, args };
    this.events.push(event);
    this.ee.emit('+events', event).catch(console.error);
    const values = await this.ee.emit(type, ...args);
    return values[0];
  }

  async add(entityCore: EntityCore) {
    entityCore.bodies.forEach((body) => {
      this.system.insert(body);
    });
    this.entities.set(entityCore.id, entityCore);
    entityCore.bodies.forEach((body) => {
      (body as BodyRefEntity).entityRef = entityCore;
    });
    // Need to reference the entity's id in the body because the body is passed to the System.checkOne callback, not the entity
    await this.ee.emit('+entities', entityCore).catch(console.error);
  }

  remove(entityCore: EntityCore) {
    entityCore.bodies.forEach((body) => {
      this.system.remove(body);
    });
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

type BodyRefEntity = Body & { entityRef: EntityCore };
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

  constructor(
    public game: Game,
    public worldCore: WorldCore
  ) {
    // @ts-expect-error asdasdasds
    globalThis.__PIXI_APP__ = this.app;
    worldCore.ee.on('+entities', (entityCore: EntityCore) => {
      const EntityClientClassifier =
        WorldClient.EntityClientClassifiers[
          entityCore.constructor
            .name as keyof typeof WorldClient.EntityClientClassifiers
        ];
      if (!EntityClientClassifier) {
        throw new Error(
          `EntityClientClassifier not found for ${entityCore.constructor.name}`
        );
      }

      const entityClient = new EntityClientClassifier(this, entityCore);
      entityClient.init();
      this.entities.set(entityCore.id, entityClient);
      this.addStage(entityClient.displayObjects);

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
        this.removeStage(entity.displayObjects);
        this.entities.delete(entityCore.id);
      }
    });
  }

  init() {}

  nextTick(tickData: TickData) {
    this.entities.forEach((entity) => {
      entity.nextTick(tickData);
    });
  }

  addStage(displayObjects: PIXI.DisplayObject[]) {
    displayObjects.forEach((displayObject) => {
      this.app.stage.addChild(displayObject);
    });
  }

  removeStage(displayObjects: PIXI.DisplayObject[]) {
    displayObjects.forEach((displayObject) => {
      this.app.stage.removeChild(displayObject);
    });
  }
}

/* ---------------------------------------------------------------------------------- */

export abstract class WorldServer {
  constructor(public worldCore: WorldCore) {}
  init() {}

  nextTick(_tickData: TickData) {}
}
