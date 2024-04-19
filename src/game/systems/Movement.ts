import { System } from "@lastolivegames/becsy";
import { Velocity } from "../components/Velocity";
import { Position } from "../components/Position";
import { Accelerator } from "../components/Accelerator";

export class Movement extends System {
	private readonly entities = this.query(
		(q) => q.current.with(Accelerator).and.with(Velocity, Position).write,
	);

	constructor() {
		super();
		this.schedule((s) => s.inAnyOrderWith(s.allSystems));
	}

	execute(): void {
		for (const movable of this.entities.current) {
			// const position = movable.write(Position);
			const velocity = movable.write(Velocity);
			const accelerator = movable.read(Accelerator);
			velocity.x += accelerator.x;
			velocity.y += accelerator.y;
			console.log("before", "vel-y", velocity.y);
			// position.x += velocity.x;
			// position.y += velocity.y;
			// console.log("after", "vel-y", velocity.y);
		}
	}
}
