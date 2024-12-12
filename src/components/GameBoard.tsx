import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Target } from 'lucide-react';
import { Cell, Stats, Ship, ShipType, GamePhase, Position } from '@/types';
import { calculateAccuracy, getShipAtPosition } from '@/lib/utils';
import { GridCell, GridHeader, GridSideLabels } from './GridComponents';

interface GameBoardProps {
  isPlayerBoard: boolean;
  grid: Cell[];
  ships: Ship[];
  stats: Stats;
  isComputerTurn: boolean;
  phase: GamePhase;
  onCellClick?: (cellId: string) => void;
  selectedShip?: ShipType | null;
  isVertical?: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  isPlayerBoard,
  grid,
  ships,
  stats,
  isComputerTurn,
  phase,
  onCellClick,
  selectedShip,
  isVertical,
}) => {
  const isMyTurn = isPlayerBoard ? !isComputerTurn : isComputerTurn;
  const Icon = isPlayerBoard ? Shield : Target;
  const title = isPlayerBoard ? 'Your Fleet' : 'Enemy Fleet';
  const description = isPlayerBoard
    ? 'Defend your position'
    : 'Plan your attack';
  const gradientColors = isPlayerBoard
    ? 'from-blue-50 to-blue-100'
    : 'from-red-50 to-red-100';
  const progressBgColor = isPlayerBoard ? 'bg-blue-100' : 'bg-red-100';

  const getShipForCell = (position: Position): Ship | null => {
    return getShipAtPosition(ships, position);
  };

  return (
    <Card className="flex-1">
      <CardHeader className={`bg-gradient-to-r ${gradientColors} pb-6`}>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Icon className="w-5 h-5" />
              {title}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {description}
            </CardDescription>
          </div>
          <Badge
            variant={!isMyTurn ? 'destructive' : 'secondary'}
            className="animate-pulse px-4 py-1"
          >
            {!isMyTurn ? 'Your Turn' : 'Planning'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative bg-white rounded-lg p-6">
          <GridHeader />
          <div className="relative mt-2.5">
            <GridSideLabels />
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex flex-col">
                {[...Array(10)].map((_, row) => (
                  <div key={row} className="flex">
                    {grid.slice(row * 10, (row + 1) * 10).map((cell) => (
                      <div key={cell.id} className="w-8 h-8">
                        <GridCell
                          cell={cell}
                          ship={getShipForCell(cell.position)}
                          onClick={
                            onCellClick ? () => onCellClick(cell.id) : undefined
                          }
                          isPlayerBoard={isPlayerBoard}
                          isPlacementPhase={phase === 'placement'}
                          selectedShip={selectedShip}
                          isVertical={isVertical}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>{isPlayerBoard ? 'Computer' : 'Your'} Accuracy</span>
            <span>{calculateAccuracy(stats)}%</span>
          </div>
          <Progress
            value={calculateAccuracy(stats)}
            className={`h-2 ${progressBgColor}`}
          />
        </div>
      </CardContent>
    </Card>
  );
};
