import { System } from "@lastolivegames/becsy";
import { Application, Assets } from "pixi.js";
import { PixiDisplay } from "../components/PixiDisplay";
import { Position } from "../components/Position";

export class Renderer extends System {
	private readonly app = new Application();
	private readonly entities = this.query(
		(q) => q.current.added.removed.with(PixiDisplay, Position).write,
	);

	constructor() {
		super();
		this.schedule((s) => s.inAnyOrderWith(s.allSystems) && s.onMainThread);
	}

	async prepare(): Promise<void> {
		await this.app.init({
			width: window.innerWidth,
			height: window.innerHeight,
			// backgroundColor: 0x1099bb,
		});

		await Promise.allSettled([
			Assets.load("images/pipe1.png"),
			Assets.load("images/pipe2.png"),
			Assets.load("images/bird.png"),
		]);
	}

	initialize() {
		const gameRoot = document.getElementById("gameRoot");
		if (!gameRoot) {
			throw new Error("gameRoot not found");
		}
		console.log(this.app);

		gameRoot.parentNode?.replaceChild(this.app.canvas, gameRoot);
	}

	execute(): void {
		for (const entity of this.entities.added) {
			const { container } = entity.read(PixiDisplay);
			this.app.stage.addChild(container);
		}

		for (const entity of this.entities.removed) {
			this.accessRecentlyDeletedData();
			const { container } = entity.read(PixiDisplay);
			this.app.stage.removeChild(container);
		}

		for (const entity of this.entities.current) {
			const { container } = entity.write(PixiDisplay);
			const position = entity.read(Position);
			container.x = position.x;
			container.y = position.y;
		}
	}
}
