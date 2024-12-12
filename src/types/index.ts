export interface Position {
  x: number;
  y: number;
}

export interface Ship {
  id: string;
  type: ShipType;
  positions: Position[];
  hits: Position[];
  isVertical: boolean;
}

export enum ShipType {
  Carrier = 'Carrier',
  Battleship = 'Battleship',
  Cruiser = 'Cruiser',
  Submarine = 'Submarine',
  Destroyer = 'Destroyer',
}

export const SHIP_LENGTHS: Record<ShipType, number> = {
  [ShipType.Carrier]: 5,
  [ShipType.Battleship]: 4,
  [ShipType.Cruiser]: 3,
  [ShipType.Submarine]: 3,
  [ShipType.Destroyer]: 2,
};

export interface Cell {
  id: string;
  position: Position;
  shipId: string | null;
  isHit: boolean;
}

export interface Stats {
  hits: number;
  misses: number;
  sunkShips: Ship[];
}

export type GamePhase = 'placement' | 'battle' | 'gameOver';

export interface GameState {
  player1Grid: Cell[];
  player2Grid: Cell[];
  player1Ships: Ship[];
  player2Ships: Ship[];
  isGameOver: boolean;
  winner: 'Player' | 'Computer' | null;
  showAlert: boolean;
  playerStats: Stats;
  computerStats: Stats;
  isComputerTurn: boolean;
  phase: GamePhase;
}

export interface GridCellProps {
  cell: Cell;
  ship?: Ship | null;
  onClick?: () => void;
  isPlayerBoard: boolean;
  isPlacementPhase?: boolean;
  selectedShip?: ShipType | null;
  isVertical?: boolean;
}
