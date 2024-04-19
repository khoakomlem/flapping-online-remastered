import { World } from "@lastolivegames/becsy";
import { Position } from "../components/Position";
import { Velocity } from "../components/Velocity";
import { VelocityInputController } from "../systems/VelocityInputController";
import { Movement } from "../systems/Movement";
import { Renderer } from "../systems/Renderer";
import { PixiDisplay } from "../components/PixiDisplay";
import { Bird } from "../components/Bird";
import { Keypressed } from "../components/Keypressed";
import { Pipe } from "../components/Pipe";
import { PipeMovement } from "../systems/PipeMovement";

export function createCasualWorld() {
	return World.create({
		defs: [
			Position,
			Velocity,
			Keypressed,
			PixiDisplay,
			Bird,
			Pipe,
			PipeMovement,
			VelocityInputController,
			Movement,
			Renderer,
		],
	});
}
