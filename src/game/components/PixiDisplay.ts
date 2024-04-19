import { field } from "@lastolivegames/becsy";
import type { Container } from "pixi.js";

export class PixiDisplay {
	@field.object declare container: Container;
}
