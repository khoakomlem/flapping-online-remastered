import React from 'react';
import { Game } from '@/Client';
import { CasualPlayer, CasualWorld } from '@/game';

export const GameContext = React.createContext<{ game?: Game }>({});

export function GamePage() {
  const game = React.useMemo(() => new Game(), []);
  const contextValue = React.useMemo(() => ({ game }), [game]);

  React.useEffect(() => {
    game
      .connect()
      .then(async () => {
        game.init();
        const world = CasualWorld.create({ roomClient: game.room });
        const player = CasualPlayer.create();
        player.core = world.birds[0];
        game.start(world, player);
      })
      .catch(console.error);
  });

  return (
    <GameContext.Provider value={contextValue}>
      <div className='fixed top-0 left-0 w-screen h-screen z-50'>
        <div id='gameRoot' />
        <div
          id='move-zone'
          className='zone dynamic active w-1/2 h-full absolute bottom-0 left-0'
        />
        <div
          id='aim-zone'
          className='zone dynamic active w-1/2 h-full absolute bottom-0 right-0'
        />
        <div className='w-screen absolute bottom-28'>
          <div className='justify-center flex' />
        </div>
      </div>
    </GameContext.Provider>
  );
}
