import { System } from "@lastolivegames/becsy";
import { Application } from "pixi.js";
import { PixiDisplay } from "../components/PixiDisplay";
import { Position } from "../components/Position";

export class Renderer extends System {
	private readonly app = new Application({
		width: 800,
		height: 600,
	});
	private readonly entities = this.query((q) =>
		q.current.and.added.and.removed.with(PixiDisplay).write.and.with(Position),
	);

	initialize(): void {
		const gameRoot = document.getElementById("gameRoot");

		if (!gameRoot) {
			throw new Error("gameRoot not found");
		}

		gameRoot.parentNode?.replaceChild(
			this.app.view as unknown as Node,
			gameRoot,
		);
	}

	execute(): void {
		for (const entity of this.entities.added) {
			const { displayObject } = entity.read(PixiDisplay);
			this.app.stage.addChild(displayObject);
		}

		for (const entity of this.entities.removed) {
			const { displayObject } = entity.read(PixiDisplay);
			this.app.stage.removeChild(displayObject);
		}

		for (const entity of this.entities.current) {
			const { displayObject } = entity.write(PixiDisplay);
			const position = entity.read(Position);
			displayObject.x = position.x;
			displayObject.y = position.y;
		}
	}
}
