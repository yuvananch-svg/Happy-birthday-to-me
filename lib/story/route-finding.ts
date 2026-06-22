import { mapGraph } from "./map-graph";
import type { MapPointKey } from "./story-types";

export function findRoute(from: MapPointKey, to: MapPointKey): MapPointKey[] {
  if (from === to) return [from];

  const queue: MapPointKey[][] = [[from]];
  const visited = new Set<MapPointKey>([from]);

  while (queue.length > 0) {
    const route = queue.shift();
    if (!route) break;

    const last = route[route.length - 1];
    const neighbors = mapGraph[last] || [];

    for (const neighbor of neighbors) {
      if (visited.has(neighbor)) continue;

      const nextRoute = [...route, neighbor];
      if (neighbor === to) return nextRoute;

      visited.add(neighbor);
      queue.push(nextRoute);
    }
  }

  return [from];
}
