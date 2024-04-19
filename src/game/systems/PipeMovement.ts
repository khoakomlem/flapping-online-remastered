import { System } from "@lastolivegames/becsy";
import {
	type ScheduleBuilder,
	type Schedule,
} from "@lastolivegames/becsy/src/schedule";
import { Pipe } from "../components/Pipe";
import { Position } from "../components/Position";
import { Velocity } from "../components/Velocity";
import { Movement } from "./Movement";

export class PipeMovement extends System {
	schedule(buildCallback: (s: ScheduleBuilder) => void): Schedule {}
	entities = this.query((q) => q.current.with(Pipe).using(Velocity).write);

	execute(): void {
		for (const entity of this.entities.current) {
			const pipe = entity.read(Pipe);
			const velocity = entity.write(Velocity);
			velocity.x = this.delta * pipe.speed;
		}
	}
}
