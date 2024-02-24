import React from 'react';
import { Game } from '@/Client';
import { CasualPlayer, CasualWorld } from '@/game';
import { EventData, ModuleHelper } from '2d-multiplayer-world';

export const GameContext = React.createContext<{ game?: Game }>({});

export function GamePage() {
  const game = React.useMemo(() => new Game(), []);
  const contextValue = React.useMemo(() => ({ game }), [game]);
  React.useEffect(() => {
    game
      .connect<CasualWorld>()
      .then((room) => {
        const moduleHelper = new ModuleHelper({ roomClient: room });
        const world = moduleHelper.create(CasualWorld, {});
        world.playerId = room.sessionId;
        const player = CasualPlayer.create({ roomClient: room });
        window.room = room;
        window.world = world;

        room.state.birds.onAdd((bird, key) => {
          world.birds.get(key)?.initServer(bird);
        });

        window.player = player;

        setTimeout(() => {
          player.setCore(world.birds.get(room.sessionId));

          // TODO: tìm cách gán playerId đẹp hơn
          console.log('player core', player.core);
          // console.log(world.birds);
          // world.birds.forEach((bird) => {
          //   if (bird.id === room.sessionId) {
          //     alert(1);
          //     player.setCore(bird);
          //   }
          // });
        }, 1000);

        game.start(world, player, room);
        game.init();
      })
      .catch(console.error);
  }, [game]);

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
