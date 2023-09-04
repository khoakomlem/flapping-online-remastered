import Stats from 'stats.js';
import {type WorldClient} from './game/index';
import {type TickData} from './types/TickData';
import {type PlayerClient} from './game/player/Player/Player.client';

export class Game {
	stats = {
		fps: new Stats(),
		ping: new Stats(),
	};

	isMobile = false;

	private readonly internal = {
		tps: 0,
		targetDelta: 1000 / 60,
		elapsedMs: 0,
		elapseTick: 0,
		accumulator: 0,
		ping: 0,
		tpsCountInterval: 0,
	};

	async connect() {

	}

	init() {
	}

	initDOM() {
	}

	start(worldClient: WorldClient, playerClient: PlayerClient) {
		// Const camera = new Camera(world.app.stage);

		worldClient.app.ticker.add(_delta => {
			const {deltaMS} = worldClient.app.ticker;
			const {internal} = this;

			internal.accumulator += deltaMS;
			this.stats.fps.begin();
			while (internal.accumulator >= internal.targetDelta) {
				internal.elapseTick++;
				internal.accumulator -= internal.targetDelta;
				const tickData: TickData = {
					accumulator: internal.accumulator,
					elapsedMs: internal.elapsedMs,
					deltaMs: internal.targetDelta,
					delta: 1,
				};

				if (playerClient.isReady) {
					playerClient.nextTick(tickData);
					// Update camera
					// camera.update();

					// Update player angle to mouse
					// const {entity} = player.playerCore;
					// if (entity && !this.isMobile) {
					// 	const playerX = entity.body.pos.x;
					// 	const playerY = entity.body.pos.y;
					// 	const playerScreenPos = worldClient.app.stage.toScreen(playerX, playerY);
					// 	this.player.entity.body.angle = Math.atan2(
					// 		this.pointerPos.y - playerScreenPos.y,
					// 		this.pointerPos.x - playerScreenPos.x,
					// 	);
					// }
				}

				worldClient.nextTick(tickData);
				internal.elapsedMs += internal.targetDelta;
			}

			this.stats.fps.end();
		});
	}
}
