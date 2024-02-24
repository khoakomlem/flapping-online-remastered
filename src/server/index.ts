import { createServer } from 'http';
import { matchMaker, Server } from '@colyseus/core';
import { monitor } from '@colyseus/monitor';
import { WebSocketTransport } from '@colyseus/ws-transport';
import cors from 'cors';
import express from 'express';

import { RoomCasual } from './room';

const setTerminalTitle = (text: string) => {
  process.stdout.write(
    `${String.fromCharCode(27)}]0;${text}${String.fromCharCode(7)}`
  );
};

const corsOptions = {
  allowedHeaders: 'Content-Type,Authorization,X-Total-Count',
  exposedHeaders: 'X-Total-Count',
};

const port = Number(process.env.port) || 3000;
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use('/colyseus', monitor());

const gameServer = new Server({
  transport: new WebSocketTransport({
    server: createServer(app),
    pingInterval: 5000,
    pingMaxRetries: 3,
  }),
});

setInterval(() => {
  const memoryUsage = process.memoryUsage().heapTotal / 1024 / 1024;
  setTerminalTitle(`GAME SERVER - MEMORY: ${memoryUsage.toFixed(2)}MB`);
}, 1000);

await gameServer.listen(port);
console.log(`Server listening on port ${port}`);

gameServer.define('casual', RoomCasual).enableRealtimeListing();

matchMaker.controller.getCorsHeaders = function (req) {
  return {
    'Access-Control-Allow-Origin': '*',
    Vary: '*',
    // 'Vary': "<header-name>, <header-name>, ...",
  };
};
