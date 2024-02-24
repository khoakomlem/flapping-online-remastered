import { Schema, type } from '2d-multiplayer-world';

export class VectorSchema extends Schema {
  @type('number') x = 0;
  @type('number') y = 0;
}
