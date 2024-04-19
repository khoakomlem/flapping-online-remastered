import { Sprite } from "pixi.js";
import { PixiDisplay } from "../components/PixiDisplay";
import { Position } from "../components/Position";
import { Velocity } from "../components/Velocity";
import { Keypressed } from "../components/Keypressed";
import { Accelerator } from "../components/Accelerator";
import { Lift } from "../components/Lift";

export function create({ x, y }: { x: number; y: number }) {
	return [
		Position,
		{ x, y },
		Velocity,
		{ x: 0, y: 0 },
		Accelerator,
		{ x: 0, y: 10 },
		Lift,
		{ value: 11 },
		PixiDisplay,
		{ container: Sprite.from("images/bird.png") },
		Keypressed,
	];
}

export function getComponents() {
	return [Position, Velocity, Accelerator, Lift, PixiDisplay, Keypressed];
}
