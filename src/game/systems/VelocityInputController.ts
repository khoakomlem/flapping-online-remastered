import { System } from "@lastolivegames/becsy";
import { Velocity } from "../components/Velocity";
import { Keypressed } from "../components/Keypressed";
import { Bird } from "../components/Bird";

export class VelocityInputController extends System {
	private readonly entities = this.query(
		(q) =>
			q.current.with(Bird).and.with(Velocity).write.and.with(Keypressed).write,
	);
	private readonly keysPressed = new Set<string>();

	initialize(): void {
		document.addEventListener("keydown", (event: KeyboardEvent) => {
			this.keysPressed.add(event.key);
		});

		document.addEventListener("keyup", (event: KeyboardEvent) => {
			this.keysPressed.delete(event.key);
		});
	}

	execute(): void {
		for (const entity of this.entities.current) {
			const velocity = entity.write(Velocity);
			velocity.x = 0;
			velocity.y = 0;
			if (this.keysPressed.has("ArrowUp")) velocity.y = -100;
			else if (this.keysPressed.has("ArrowDown")) velocity.y = 100;
			else velocity.y = 0;
			if (this.keysPressed.has("ArrowLeft")) velocity.x = -100;
			else if (this.keysPressed.has("ArrowRight")) velocity.x = 100;
			else velocity.x = 0;
		}
	}
}
