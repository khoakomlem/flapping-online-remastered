import { ArraySchema, Schema, type } from "@colyseus/schema";
import { Room } from "colyseus";

class Module extends Schema {}

class State extends Module {
	@type([State]) birds = new ArraySchema<State>();
}

class RoomTest extends Room<State> {}
