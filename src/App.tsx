import React from 'react';
import './App.css';
import {Game} from './Game';
import {BirdCore, CasualPlayerClient, CasualWorldClient, CasualWorldCore} from './game/index';

const game = new Game();

export const GameContext = React.createContext<{game: Game}>({game});

window.onload = () => {
	game
		.connect()
		.then(async () => {
			game.init();
			document.body.appendChild(game.stats.fps.dom);
			// Document.body.appendChild(game.stats.ping.dom);

			const gameRoot = document.getElementById('gameRoot')!;
			const worldCore = new CasualWorldCore();
			const worldClient = new CasualWorldClient(game, worldCore);
			game.playerClient = new CasualPlayerClient(game);

			worldCore.init();
			worldClient.init();
			game.playerClient.init();

			// Server side
			const birdCore = new BirdCore(worldCore);
			birdCore.init();
			await worldClient.worldCore.add(birdCore);

			const birdClient = worldClient.entities.get(birdCore.id);
			if (birdClient) {
				game.playerClient.playAs(birdClient);
			}

			gameRoot.parentNode?.replaceChild(
				worldClient.app.view as HTMLCanvasElement,
				gameRoot,
			);
			game.start(worldClient, game.playerClient);
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
