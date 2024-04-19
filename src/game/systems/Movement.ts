import { System } from "@lastolivegames/becsy";
import { Velocity } from "../components/Velocity";
import { Position } from "../components/Position";

export class Movement extends System {
	private readonly entities = this.query(
		(q) => q.current.with(Velocity).and.with(Position).write,
	);

	execute(): void {
		this.createEntity();
		for (const movable of this.entities.current) {
			const velocity = movable.read(Velocity);
			const position = movable.write(Position);
			position.x += this.delta * velocity.x;
			position.y += this.delta * velocity.y;
		}
	}
}
