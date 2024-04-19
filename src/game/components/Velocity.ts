import { field } from "@lastolivegames/becsy";
import { type Vector2, v2Type } from "./primitives/Vector2";

export class Velocity {
	@field.float64 declare x: number;
	@field.float64 declare y: number;
}
