import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCw, Shuffle, Ship as ShipIcon } from 'lucide-react';
import { ShipType, SHIP_LENGTHS } from '@/types';
import { motion, AnimatePresence } from 'motion/react';

interface ShipPlacementProps {
  selectedShip: ShipType | null;
  placedShips: ShipType[];
  onSelectShip: (ship: ShipType) => void;
  onRotateShip: () => void;
  onAutoPlace: () => void;
}

export const ShipPlacement: React.FC<ShipPlacementProps> = ({
  selectedShip,
  placedShips,
  onSelectShip,
  onRotateShip,
  onAutoPlace,
}) => {
  const renderShipPreview = (length: number) => (
    <div className="flex items-center gap-1">
      {Array.from({ length }).map((_, i) => (
        <div
          key={i}
          className="w-3 h-3 bg-blue-500 rounded-sm first:rounded-l-md last:rounded-r-md"
        />
      ))}
    </div>
  );

  return (
    <Card className="w-80">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Place Your Ships</h3>
            <Button
              size="default"
              onClick={onAutoPlace}
              className="gap-2 text-white bg-teal-500 hover:bg-teal-600"
            >
              <Shuffle className="w-4 h-4" />
              Random
            </Button>
          </div>

          <AnimatePresence>
            {Object.entries(SHIP_LENGTHS).map(([type, length]) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`group relative p-4 rounded-lg border-2 transition-all
                  ${
                    placedShips.includes(type as ShipType)
                      ? 'border-green-200 bg-green-50'
                      : selectedShip === type
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShipIcon
                      className={`w-5 h-5 
                      ${
                        placedShips.includes(type as ShipType)
                          ? 'text-green-600'
                          : 'text-blue-600'
                      }`}
                    />
                    <div>
                      <div className="font-medium">{type}</div>
                      <div className="flex items-center gap-2">
                        {renderShipPreview(length)}
                        <span className="text-sm text-gray-500">
                          Length: {length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!placedShips.includes(type as ShipType) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectShip(type as ShipType)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Select
                    </Button>
                  )}
                </div>

                {selectedShip === type && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -right-2 -top-2"
                  >
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={onRotateShip}
                      className="h-6 w-6 rounded-full bg-white shadow-md"
                    >
                      <RotateCw className="w-3 h-3" />
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};
