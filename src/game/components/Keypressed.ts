import { Type, field } from "@lastolivegames/becsy";
import type { DisplayObject } from "pixi.js";

export class Keypressed {
	@field.boolean declare up: boolean;
	@field.boolean declare down: boolean;
	@field.boolean declare left: boolean;
	@field.boolean declare right: boolean;
}
