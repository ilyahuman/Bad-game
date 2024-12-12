import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Cell, Position, Ship, ShipType, SHIP_LENGTHS } from '@/types';
import { GRID_SIZE } from '@/shared/const';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createEmptyGrid = (): Cell[] => {
  const grid: Cell[] = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      grid.push({
        id: `${i}-${j}`,
        position: { x: i, y: j },
        shipId: null,
        isHit: false,
      });
    }
  }
  return grid;
};

export const isPositionValid = (pos: Position): boolean => {
  return pos.x >= 0 && pos.x < GRID_SIZE && pos.y >= 0 && pos.y < GRID_SIZE;
};

export const getShipPositions = (
  startPos: Position,
  shipType: ShipType,
  isVertical: boolean
): Position[] => {
  const length = SHIP_LENGTHS[shipType];
  const positions: Position[] = [];

  for (let i = 0; i < length; i++) {
    const pos = {
      x: startPos.x + (isVertical ? 0 : i),
      y: startPos.y + (isVertical ? i : 0),
    };
    positions.push(pos);
  }

  return positions;
};

export const canPlaceShip = (grid: Cell[], positions: Position[]): boolean => {
  return positions.every((pos) => {
    if (!isPositionValid(pos)) return false;

    const cell = grid.find(
      (c) => c.position.x === pos.x && c.position.y === pos.y
    );
    if (!cell || cell.shipId) return false;

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const adjacentPos = { x: pos.x + dx, y: pos.y + dy };
        if (!isPositionValid(adjacentPos)) continue;

        const adjacentCell = grid.find(
          (c) =>
            c.position.x === adjacentPos.x && c.position.y === adjacentPos.y
        );
        if (adjacentCell?.shipId) return false;
      }
    }

    return true;
  });
};

export const placeShip = (grid: Cell[], ship: Ship): Cell[] => {
  return grid.map((cell) => {
    const isShipCell = ship.positions.some(
      (pos) => pos.x === cell.position.x && pos.y === cell.position.y
    );
    if (isShipCell) {
      return { ...cell, shipId: ship.id };
    }
    return cell;
  });
};

export const autoPlaceShips = (grid: Cell[]): [Cell[], Ship[]] => {
  const ships: Ship[] = [];
  let newGrid = [...grid];

  const shipTypes = Object.values(ShipType);

  for (const type of shipTypes) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      const isVertical = Math.random() > 0.5;
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);

      const positions = getShipPositions({ x, y }, type, isVertical);

      if (canPlaceShip(newGrid, positions)) {
        const ship: Ship = {
          id: `${type}-${ships.length}`,
          type,
          positions,
          hits: [],
          isVertical,
        };

        ships.push(ship);
        newGrid = placeShip(newGrid, ship);
        placed = true;
      }

      attempts++;
    }

    if (!placed) {
      throw new Error(`Failed to place ship: ${type}`);
    }
  }

  return [newGrid, ships];
};

export const isShipSunk = (ship: Ship): boolean => {
  return ship.positions.length === ship.hits.length;
};

export const getShipAtPosition = (
  ships: Ship[],
  pos: Position
): Ship | null => {
  return (
    ships.find((ship) =>
      ship.positions.some((p) => p.x === pos.x && p.y === pos.y)
    ) || null
  );
};

export const calculateAccuracy = (stats: {
  hits: number;
  misses: number;
}): number => {
  const total = stats.hits + stats.misses;
  return total === 0 ? 0 : Math.round((stats.hits / total) * 100);
};
