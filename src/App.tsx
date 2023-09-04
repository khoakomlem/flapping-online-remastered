import React, {useEffect} from 'react';
import './App.css';
import {Game} from './Game';
import {CasualWorldClient} from './game/world/Casual/CasualWorld.client';
import {CasualWorldCore} from './game/world/Casual/CasualWorld.core';
import {BirdClient, BirdCore} from './game';
import {CasualPlayerClient} from './game/player';

const game = new Game();

export const GameContext = React.createContext<{game: Game}>({game});

window.onload = () => {
	game
		.connect()
		.then(() => {
			game.init();
			const gameRoot = document.getElementById('gameRoot')!;
			const worldClient = new CasualWorldClient(new CasualWorldCore());
			const birdClient = new BirdClient(worldClient, new BirdCore());
			const playerClient = new CasualPlayerClient();

			worldClient.app.stage.addChild(birdClient.displayObject);
			worldClient.entities.set(birdClient.entityCore.id, birdClient);
			worldClient.worldCore.entities.set(birdClient.entityCore.id, birdClient.entityCore);
			playerClient.playAs(birdClient);

			document.addEventListener('keydown', key => {
				// Alert(1);
				birdClient.entityCore.fly();
			});

			gameRoot.parentNode?.replaceChild(
				worldClient.app.view as HTMLCanvasElement,
				gameRoot,
			);
			game.start(worldClient, playerClient);
		})
		.catch(console.error);
};

function App() {
	return (
		<GameContext.Provider value={{game}}>
			<div className='fixed top-0 left-0 w-screen h-screen z-50'>
				<div id='gameRoot'></div>
				<div
					id='move-zone'
					className='zone dynamic active w-1/2 h-full absolute bottom-0 left-0'
				></div>
				<div
					id='aim-zone'
					className='zone dynamic active w-1/2 h-full absolute bottom-0 right-0'
				></div>
				<div className='w-screen absolute bottom-28'>
					<div className='justify-center flex'>
					</div>
				</div>
			</div>
		</GameContext.Provider>
	);
}

export default App;
