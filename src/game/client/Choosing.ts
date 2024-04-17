import { Graphics } from 'pixi.js';

export function choosingGraph() {
  const graph = new Graphics();
  graph.beginFill('pink');
  graph.drawPolygon([0, 0, 40, 0, 20, 20]);
  graph.transform.position.set(-20, -80);
  graph.endFill();
  return graph;
}
