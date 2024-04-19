import { field } from "@lastolivegames/becsy";
import type { DisplayObject } from "pixi.js";

export class PixiDisplay {
	@field.object declare displayObject: DisplayObject;
}
