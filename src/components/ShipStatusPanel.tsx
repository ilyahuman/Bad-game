import React, { useState } from 'react';
import { Ship, ShipType } from '@/types';
import {
  Ship as ShipIcon,
  Anchor,
  Navigation,
  Waves,
  Crosshair,
} from 'lucide-react';

interface ShipStatusPanelProps {
  ships: Ship[];
  isEnemy?: boolean;
  stats: {
    hits: number;
    sunkShips: Ship[];
  };
}

const SHIP_ICONS = {
  [ShipType.Carrier]: ShipIcon,
  [ShipType.Battleship]: Navigation,
  [ShipType.Cruiser]: Anchor,
  [ShipType.Submarine]: Waves,
  [ShipType.Destroyer]: Crosshair,
};

export const ShipStatusPanel: React.FC<ShipStatusPanelProps> = ({
  ships,
  isEnemy,
  stats,
}) => {
  const [isOpen, setOpen] = useState({
    your: false,
    enemy: false,
  });
  const sideClass = isEnemy ? 'right-0 rounded-l-2xl' : 'left-0 rounded-r-2xl';
  const colorClass = isEnemy ? 'from-red-50' : 'from-blue-50';
  const textClass = isEnemy ? 'text-red-600' : 'text-blue-600';
  const titleText = isEnemy ? 'enemy' : 'your';

  return (
    <div
      className={`fixed z-10 top-1/2 ${sideClass} w-48
        bg-gradient-to-r ${colorClass} to-white 
        shadow-lg border border-gray-100 
        transition-transform -translate-y-1/2 
        ${isEnemy ? (isOpen.enemy ? 'translate-x-0' : 'translate-x-36') : isOpen.your ? 'translate-x-0' : '-translate-x-36'} group`}
    >
      <div
        className={`absolute z-20 top-1/2 ${isEnemy ? '-left-12' : '-right-12'} 
          -translate-y-1/2 w-12 h-32 
          ${isEnemy ? 'rounded-l-xl' : 'rounded-r-xl'}
          ${isEnemy ? 'bg-red-50' : 'bg-blue-50'}
          border border-gray-100
          flex items-center justify-center
          cursor-pointer`}
        onClick={() =>
          setOpen((prev) => ({
            ...prev,
            [titleText]: !prev[titleText] as boolean,
          }))
        }
      >
        <span className={`${textClass} font-medium vertical-text`}>
          {`${titleText}`}
        </span>
      </div>

      <div className="p-4 space-y-6">
        <h3 className={`${textClass} font-bold text-lg`}>{titleText}</h3>

        <div className="space-y-3">
          {Object.entries(SHIP_ICONS).map(([type, Icon]) => {
            const ship = ships.find((s) => s.type === type);
            const isSunk = ship?.hits.length === ship?.positions.length;

            return (
              <div
                key={type}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors
                  ${isSunk ? 'bg-gray-100 opacity-50' : 'bg-white/50'}`}
              >
                <Icon
                  className={`w-5 h-5 ${isSunk ? 'text-gray-400' : textClass}`}
                />
                <span
                  className={`font-medium ${isSunk ? 'text-gray-400' : 'text-gray-700'}`}
                >
                  {type}
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-1">
          <div className="text-sm text-gray-600">Hits: {stats.hits}</div>
          <div className="text-sm text-gray-600">
            Ships Sunk: {stats.sunkShips.length}
          </div>
        </div>
      </div>
    </div>
  );
};
