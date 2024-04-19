import { Sprite } from "pixi.js";
import { Bird } from "../components/Bird";
import { PixiDisplay } from "../components/PixiDisplay";
import { Position } from "../components/Position";
import { Velocity } from "../components/Velocity";
import { Keypressed } from "../components/Keypressed";
import { Pipe } from "../components/Pipe";

export function createBird({
	x,
	y,
}: {
	x: number;
	y: number;
}) {
	return [
		Position,
		{ x, y },
		Velocity,
		Bird,
		{ gravity: 1, lift: 11 },
		PixiDisplay,
		{ displayObject: Sprite.from("images/bird.png") },
		Keypressed,
	];
}

export function createPipe({
	x,
	y,
	speed = 0.5,
}: {
	x: number;
	y: number;
	speed?: number;
}) {
	return [
		Position,
		{ x, y },
		Velocity,
		Pipe,
		{ speed },
		PixiDisplay,
		{ displayObject: Sprite.from("images/pipe1.png") },
	];
}
