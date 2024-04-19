import { Sprite } from "pixi.js";
import { PixiDisplay } from "../components/PixiDisplay";
import { Position } from "../components/Position";
import { Velocity } from "../components/Velocity";
import { Accelerator } from "../components/Accelerator";

export function create({
	x,
	y,
	speed = 1000,
}: {
	x: number;
	y: number;
	speed?: number;
}) {
	return [
		Position,
		{ x, y },
		Velocity,
		{ x: -speed, y: 0 },
		Accelerator,
		PixiDisplay,
		{ container: Sprite.from("images/pipe1.png") },
	];
}

export function getComponents() {
	return [Position, Velocity, Accelerator, PixiDisplay];
}
