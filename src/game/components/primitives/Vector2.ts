import { Schema, type } from "@colyseus/schema";
import { Type, field } from "@lastolivegames/becsy";

export class Vector2 {
	@field.float64 declare x: number;
	@field.float64 declare y: number;
}

export const v2Type = Type.vector(Type.float64, ["x", "y"], Vector2);
