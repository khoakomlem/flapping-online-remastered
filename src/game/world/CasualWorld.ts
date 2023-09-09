import {PipeCore} from '../entity/Pipe';
import {WorldCore, WorldClient, WorldServer} from './World';

export class CasualWorldCore extends WorldCore {
	init() {
		super.init();
		for (let i = 0; i < 100; i++) {
			const pipe = new PipeCore(this);
			pipe.init();
			pipe.body.pos.x = 1000 + i * 100;
			this.add(pipe).catch(console.error);
		}
	}
}

export class CasualWorldClient extends WorldClient {

}

export class CasualWorldServer extends WorldServer {

}
