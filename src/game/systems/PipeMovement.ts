import * as Pipe from "../entities/Pipe";
import { System, co } from "@lastolivegames/becsy";
import { Velocity } from "../components/Velocity";
import { Position } from "../components/Position";
import { VelocityInputController } from "./VelocityInputController";

export class PipeMovement extends System {
	entities = this.query((q) => q.current.with(...Pipe.getComponents()).write);

	constructor() {
		super();
		this.schedule((s) => s.inAnyOrderWith(s.allSystems));
	}

	initialize(): void {
		this.spawnPipes();
	}

	execute(): void {
		for (const entity of this.entities.current) {
			const position = entity.read(Position);
			if (position.x + 80 < 0) {
				// this.createEntity(
				// 	...Pipe.create({
				// 		x: 100,
				// 		y: 100,
				// 	}),
				// );
				entity.delete();
			}
		}
	}

	@co *spawnPipes() {
		while (true) {
			yield co.waitForSeconds(1);
			this.createEntity(
				...Pipe.create({
					x: 700,
					y: 100,
				}),
			);
		}
	}
}
