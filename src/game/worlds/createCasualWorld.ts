import { System, World } from "@lastolivegames/becsy";
import { Position } from "../components/Position";
import { Velocity } from "../components/Velocity";
import { VelocityInputController } from "../systems/VelocityInputController";
import { Movement } from "../systems/Movement";
import { Renderer } from "../systems/Renderer";
import { PixiDisplay } from "../components/PixiDisplay";
import { Keypressed } from "../components/Keypressed";
import { PipeMovement } from "../systems/PipeMovement";
import { Lift } from "../components/Lift";
import { Accelerator } from "../components/Accelerator";

export function createCasualWorld() {
	return World.create({
		defs: [
			Position,
			Velocity,
			Keypressed,
			PixiDisplay,
			Lift,
			Accelerator,
			Movement,
			Renderer,
			PipeMovement,
			VelocityInputController,
		],
		threads: 1,
		// defaultComponentStorage:'compact'
	});
}
