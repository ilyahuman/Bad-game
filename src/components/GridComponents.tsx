import React from 'react';
import { Crosshair } from 'lucide-react';
import { TooltipWrapper } from '@/components/TooltipWrapper';
import { GridCellProps, SHIP_LENGTHS } from '@/types';

export const GridCell: React.FC<GridCellProps> = ({
  cell,
  ship,
  onClick,
  isPlayerBoard,
  isPlacementPhase,
  selectedShip,
  isVertical,
}) => {
  const baseClass = 'w-full h-full border transition-all duration-200';

  const getTooltipContent = () => {
    if (cell.isHit) {
      return cell.shipId ? '💥 Hit!' : '💨 Miss!';
    }
    if (isPlacementPhase && selectedShip) {
      return `Place ${selectedShip} ${isVertical ? 'vertically' : 'horizontally'}`;
    }
    return `${String.fromCharCode(65 + cell.position.x)}${cell.position.y + 1}`;
  };

  const isInPlacementPreview = (): boolean => {
    if (!isPlacementPhase || !selectedShip) return false;

    const shipLength = SHIP_LENGTHS[selectedShip];
    const { x, y } = cell.position;

    if (isVertical) {
      return x === Math.floor(shipLength / 10) && y < shipLength;
    } else {
      return y === Math.floor(shipLength / 10) && x < shipLength;
    }
  };

  const getCellStyle = (): string => {
    if (cell.isHit) {
      return cell.shipId
        ? 'border-red-400 bg-red-50'
        : 'border-blue-400 bg-blue-50';
    }

    if (isPlayerBoard && ship) {
      return 'border-gray-400 bg-gray-200';
    }

    if (isPlacementPhase && selectedShip && isInPlacementPreview()) {
      return 'border-blue-400 bg-blue-100';
    }

    if (isPlacementPhase && selectedShip) {
      return 'hover:bg-blue-100 hover:border-blue-300 cursor-pointer';
    }

    if (!isPlayerBoard && !isPlacementPhase) {
      return 'border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 cursor-pointer';
    }

    return 'border-gray-200 bg-white';
  };

  return (
    <TooltipWrapper content={getTooltipContent()}>
      <div
        onClick={onClick}
        className={`${baseClass} ${getCellStyle()} flex items-center justify-center relative group`}
      >
        {cell.isHit ? (
          <div className="relative">
            {cell.shipId ? (
              <div className="relative">
                <div className="absolute -inset-3">
                  <div className="w-6 h-6 border-2 border-red-400 rounded-full animate-ping opacity-50" />
                </div>
                <Crosshair className="w-4 h-4 text-red-500" />
              </div>
            ) : (
              <div className="w-2 h-2 rounded-full bg-blue-400" />
            )}
          </div>
        ) : ship && isPlayerBoard ? (
          <div className="w-3 h-3 rounded-sm bg-gray-500" />
        ) : null}
        {!cell.isHit && !isPlayerBoard && (
          <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-10 transition-opacity" />
        )}
      </div>
    </TooltipWrapper>
  );
};

export const GridHeader: React.FC = () => (
  <div className="flex ml-3">
    {[...Array(10)].map((_, i) => (
      <div
        key={i}
        className="w-8 flex justify-center text-sm text-gray-500 font-medium"
      >
        {String.fromCharCode(65 + i)}
      </div>
    ))}
  </div>
);

export const GridSideLabels: React.FC = () => (
  <div className="absolute -left-7 top-3 flex flex-col h-full">
    {[...Array(10)].map((_, i) => (
      <div
        key={i}
        className="h-8 flex items-center justify-end pr-2 text-sm text-gray-500 font-medium"
      >
        {i + 1}
      </div>
    ))}
  </div>
);
