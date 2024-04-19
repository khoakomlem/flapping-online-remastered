import { type } from "@colyseus/schema";
import { field } from "@lastolivegames/becsy";

export class Bird {
	@field.float64 @type("number") declare gravity: number;
	@field.float64 @type("number") declare lift: number;
}
