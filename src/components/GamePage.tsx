"use client";
import { Game } from "@/Client";
import { createCasualWorld } from "@/game/worlds/createCasualWorld";
import { Bird, Pipe } from "@/game/entities";
import type { World } from "@lastolivegames/becsy";
import { createContext, useEffect, useMemo, useState } from "react";
import { useIsMounted } from "usehooks-ts";

// export const GameContext = createContext<{ world: World }>({
//   // biome-ignore lint/style/noNonNullAssertion: <explanation>
//   world: undefined!,
// });

export function GamePage() {
	const [world, setWorld] = useState<World | undefined>(undefined);
	const isMounted = useIsMounted();

	useEffect(() => {
		if (isMounted()) {
			createCasualWorld()
				.then((world) => {
					const game = new Game();
					world.createEntity(
						...Pipe.create({
							x: 700,
							y: 100,
						}),
					);
					game.start(
						world,
						Bird.create({
							x: 100,
							y: 100,
						}),
					);
					setWorld(world);
				})
				.catch(console.error);
		}
	}, [isMounted]);

	return (
		<div className="fixed top-0 left-0 w-screen h-screen z-50">
			<div id="gameRoot" />
			<div
				id="move-zone"
				className="zone dynamic active w-1/2 h-full absolute bottom-0 left-0"
			/>
			<div
				id="aim-zone"
				className="zone dynamic active w-1/2 h-full absolute bottom-0 right-0"
			/>
			<div className="w-screen absolute bottom-28">
				<div className="justify-center flex" />
			</div>
		</div>
	);
}
