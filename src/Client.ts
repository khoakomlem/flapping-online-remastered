import type { TickData } from "@/types/TickData";

import Stats from "stats.js";

import type { Entity, World } from "@lastolivegames/becsy";
import { Ticker } from "pixi.js";

export class Game {
	stats = {
		fps: new Stats(),
		ping: new Stats(),
	};

	isMobile = false;

	// client = new Client("ws://khoakomlem-internal.ddns.net:3000");

	private readonly internal = {
		tps: 0,
		targetDelta: 1000 / 60,
		elapsedMs: 0,
		elapseTick: 0,
		accumulator: 0,
		ping: 0,
		tpsCountInterval: 0,
	};

	init() {
		document.body.appendChild(this.stats.fps.dom);
		document.body.appendChild(this.stats.ping.dom);
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	start(world: World, player: any[]) {
		const ticker = new Ticker();
		world.createEntity(...player);
		setInterval(() => {
			world.execute();
		}, 10);

		// ticker.add(async (delta) => {
		// 	const { deltaMS } = ticker;
		// 	const { internal } = this;

		// 	internal.accumulator += deltaMS;
		// 	this.stats.fps.begin();
		// 	while (internal.accumulator >= internal.targetDelta) {
		// 		internal.elapseTick++;
		// 		internal.accumulator -= internal.targetDelta;
		// 		const tickData: TickData = {
		// 			accumulator: internal.accumulator,
		// 			elapsedMs: internal.elapsedMs,
		// 			deltaMs: internal.targetDelta,
		// 			delta: 1,
		// 		};

		// 		// await world.execute(ticker.lastTime, tickData.deltaMs);
		// 		await world.execute();
		// 		internal.elapsedMs += internal.targetDelta;
		// 	}

		// 	this.stats.fps.end();
		// });

		// ticker.start();

		// return ticker;
	}
}
