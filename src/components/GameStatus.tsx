import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Ship, ShipType } from '../types';
import { Shield, Crosshair, AlertTriangle, Anchor } from 'lucide-react';

interface GameStatusProps {
  activeShips: Ship[];
  sunkShips: Ship[];
  isPlayerTurn: boolean;
  lastHit?: { position: string; wasHit: boolean };
}

export const GameStatus: React.FC<GameStatusProps> = ({
  activeShips,
  sunkShips,
  isPlayerTurn,
  lastHit,
}) => {
  const renderShipStatus = (type: ShipType) => {
    const isActive = activeShips.some((s) => s.type === type);
    const isSunk = sunkShips.some((s) => s.type === type);

    return (
      <div
        key={type}
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm
          ${
            isActive
              ? 'bg-green-100 text-green-700'
              : isSunk
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
          }`}
      >
        <Anchor className="w-3 h-3" />
        <span>{type.charAt(0)}</span>
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-auto">
      <Card className="bg-white/95 backdrop-blur border-2 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              {isPlayerTurn ? (
                <Crosshair className="w-5 h-5 text-blue-500 animate-pulse" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
              )}
              <span className="font-medium">
                {isPlayerTurn ? 'Take your shot!' : 'Enemy is aiming...'}
              </span>
            </div>

            <div className="flex items-center gap-3 px-4 border-l border-r">
              {Object.values(ShipType).map(renderShipStatus)}
            </div>

            <div className="flex items-center gap-2 px-3">
              <Shield className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium">
                Ships Sunk: {sunkShips.length}/{Object.values(ShipType).length}
              </span>
            </div>

            {lastHit && (
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm
                ${lastHit.wasHit ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}
              >
                <span className="font-medium">
                  {lastHit.wasHit ? 'Hit!' : 'Miss'} at {lastHit.position}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
