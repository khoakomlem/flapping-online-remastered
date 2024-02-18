import { lerp } from '@/util/common';
import { Box, type Vector } from 'detect-collisions';
import * as PIXI from 'pixi.js';

import { type TickData } from '@/types/TickData';

import { PipeType } from '../constant/PipeType';
import { EntityClient, EntityCore, EntityServer } from './Entity';

export type PipeInitData = {
  type: PipeType;
  pipes: Array<{ pos: Vector; width: number; height: number }>;
};
// Constructor ko co me gi het, init moi duoc tao Box hoac Graphic, Sprite
export class PipeCore extends EntityCore {
  type?: PipeType;
  _initData?: PipeInitData;
  _internal = {
    isUp: false,
  };

  pipes: Box[] = [];
  bodies: Box[] = [];

  init(data: PipeInitData) {
    super.init();
    this.type = data.type;
    this._initData = structuredClone(data);

    if (data.type === PipeType.Collapse) {
      data.pipes[0].pos.y = 0;
      data.pipes[0].height = window.innerHeight / 4;
      data.pipes[1].pos.y = (window.innerHeight * 3) / 4;
      data.pipes[1].height = window.innerHeight / 4;
    }

    if (data.type === PipeType.Open) {
      data.pipes[0].pos.y = 0;
      data.pipes[0].height = window.innerHeight / 2;
      data.pipes[1].pos.y = window.innerHeight / 2;
      data.pipes[1].height = window.innerHeight / 2;
    }

    if (data.type === PipeType.Spin) {
    }

    if (data.type === PipeType.Small) {
      data.pipes[0].width /= 2;
      data.pipes[1].width /= 2;
    }

    if (data.type === PipeType.Big) {
      data.pipes[0].width *= 10;
      data.pipes[1].width *= 10;
    }

    for (const pipeData of data.pipes) {
      const pipe = new Box(
        {
          x: pipeData.pos.x,
          y: pipeData.pos.y,
        },
        pipeData.width,
        pipeData.height
      );
      this.pipes.push(pipe);
      this.bodies.push(pipe);
    }
  }

  nextTick(_tickData: TickData): void {
    if (!this._initData) return;

    switch (this.type) {
      case PipeType.Normal: {
        this.bodies.forEach((pipe) => {
          pipe.pos.x -= 5;
        });
        break;
      }

      case PipeType.Unstable: {
        this.pipes.forEach((pipe) => {
          pipe.pos.x -= 5;
        });
        const ran = Math.random() * 20 - 10;
        this.pipes[0].height = this._initData.pipes[0].height + ran;
        this.pipes[1].pos.y = this._initData.pipes[1].pos.y + ran;
        this.pipes[1].height =
          this._initData.pipes[1].height -
          ran +
          (this._initData.pipes[1].pos.y - this.pipes[1].pos.y);
        break;
      }

      case PipeType.UpDown: {
        this.pipes.forEach((pipe) => {
          pipe.pos.x -= 5;
        });
        this.pipes[0].height += this._internal.isUp ? -2 : 2;
        this.pipes[1].y += this._internal.isUp ? -2 : 2;
        this.pipes[1].height -= this._internal.isUp ? -2 : 2;
        if (this.pipes[0].height < 50) {
          this._internal.isUp = false;
        } else if (this.pipes[1].pos.y > window.innerHeight - 50) {
          this._internal.isUp = true;
        }

        break;
      }

      case PipeType.Collapse: {
        this.pipes.forEach((pipe) => {
          pipe.pos.x -= 5;
        });
        if (this.pipes[0].pos.x < window.innerWidth / 2) {
          if (this.pipes[0].height < this._initData.pipes[0].height) {
            this.pipes[0].height = lerp(
              this.pipes[0].height,
              this._initData.pipes[0].height,
              0.1
            );
          }

          if (this.pipes[1].y > this._initData.pipes[1].pos.y) {
            this.pipes[1].y = lerp(
              this.pipes[1].y,
              this._initData.pipes[1].pos.y,
              0.1
            );
            this.pipes[1].height = lerp(
              this.pipes[1].height,
              this._initData.pipes[1].height,
              0.1
            );
          }
        }

        break;
      }

      case PipeType.Open: {
        this.pipes.forEach((pipe) => {
          pipe.pos.x -= 5;
        });
        if (
          this.pipes[0].pos.x < window.innerWidth / 2 &&
          this.pipes[0].height > window.innerHeight / 2 - 150
        ) {
          this.pipes[0].height -= 2;
          this.pipes[1].y += 2;
          this.pipes[1].height -= 2;
        }

        break;
      }

      case PipeType.Spin: {
        this.pipes.forEach((pipe) => {
          pipe.pos.x -= 5;
          pipe.angle += 0.01;
        });
        break;
      }

      case PipeType.Small:
      case PipeType.Big: {
        this.pipes.forEach((pipe) => {
          pipe.pos.x -= 5;
        });
        break;
      }

      default:
        break;
    }
  }
}

export class PipeClient extends EntityClient {
  pipes = [new PIXI.Graphics(), new PIXI.Graphics()];
  displayObjects = [new PIXI.Graphics(), new PIXI.Graphics()];
  declare entityCore: PipeCore;

  init() {}

  nextTick(_tickData: TickData): void {
    super.nextTick(_tickData);
    this.entityCore.bodies.forEach((pipe, index) => {
      const pipeGraphic = this.displayObjects[index];
      pipeGraphic.clear();
      pipeGraphic.lineStyle(5, 0xff0000);
      pipeGraphic.beginFill(0x00ff00);
      pipeGraphic.drawRect(0, 0, pipe.width, pipe.height);
      pipeGraphic.endFill();
      pipeGraphic.x = pipe.pos.x;
      pipeGraphic.y = pipe.pos.y;
      if (this.entityCore.type === PipeType.Spin) {
        pipeGraphic.pivot.x = pipe.width / 2;
        pipeGraphic.pivot.y = pipe.height / 2;
        pipeGraphic.rotation = pipe.angle;
      }

      this.pipes[index] = pipeGraphic;
      this.displayObjects[index] = pipeGraphic;
    });
  }
}

export class PipeServer extends EntityServer {}
