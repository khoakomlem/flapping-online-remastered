import { type } from "@colyseus/schema";
import { field } from "@lastolivegames/becsy";

export class Lift {
	@field.float64 @type("number") declare value: number;
}
