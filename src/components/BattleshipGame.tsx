import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Sword, RefreshCw } from 'lucide-react';
import { GameState, ShipType, Ship } from '@/types';
import {
  createEmptyGrid,
  autoPlaceShips,
  getShipAtPosition,
  canPlaceShip,
  getShipPositions,
  placeShip,
  isShipSunk,
  calculateAccuracy,
} from '@/lib/utils';
import { GameBoard } from './GameBoard';
import { ShipPlacement } from './ShipPlacement';
import { COMPUTER_MOVE_DELAY } from '@/shared/const';
import { GameStatus } from '@/components/GameStatus.tsx';
import { ShipStatusPanel } from '@/components/ShipStatusPanel.tsx';

export const BattleshipGame: React.FC = () => {
  const initialState: GameState = {
    player1Grid: createEmptyGrid(),
    player2Grid: createEmptyGrid(),
    player1Ships: [],
    player2Ships: [],
    isGameOver: false,
    winner: null,
    showAlert: false,
    playerStats: { hits: 0, misses: 0, sunkShips: [] },
    computerStats: { hits: 0, misses: 0, sunkShips: [] },
    isComputerTurn: false,
    phase: 'placement',
  };

  const [gameState, setGameState] = useState<GameState>(initialState);
  const [selectedShip, setSelectedShip] = useState<ShipType | null>(null);
  const [isVertical, setIsVertical] = useState(false);
  const [lastHit, setLastHit] = useState<
    { position: string; wasHit: boolean } | undefined
  >(undefined);

  const initGame = () => {
    const [computerGrid, computerShips] = autoPlaceShips(createEmptyGrid());
    setGameState({
      ...initialState,
      player2Grid: computerGrid,
      player2Ships: computerShips,
    });
    setSelectedShip(null);
    setIsVertical(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleShipSelect = (shipType: ShipType) => {
    setSelectedShip(shipType);
  };

  const handleShipRotate = () => {
    setIsVertical(!isVertical);
  };

  const handleAutoPlace = () => {
    const [playerGrid, playerShips] = autoPlaceShips(createEmptyGrid());
    setGameState((prev) => ({
      ...prev,
      player1Grid: playerGrid,
      player1Ships: playerShips,
      phase: 'battle',
    }));
    setSelectedShip(null);
  };

  const handleCellClick = (cellId: string) => {
    if (gameState.phase === 'placement') {
      handleShipPlacement(cellId);
    } else if (gameState.phase === 'battle') {
      handleBattleMove(cellId);
    }
  };

  const handleShipPlacement = (cellId: string) => {
    if (!selectedShip) return;

    const cell = gameState.player1Grid.find((c) => c.id === cellId);
    if (!cell) return;

    const positions = getShipPositions(cell.position, selectedShip, isVertical);

    if (!canPlaceShip(gameState.player1Grid, positions)) return;

    const newShip: Ship = {
      id: `player-${selectedShip}-${gameState.player1Ships.length}`,
      type: selectedShip,
      positions,
      hits: [],
      isVertical,
    };

    const newGrid = placeShip(gameState.player1Grid, newShip);
    const newShips = [...gameState.player1Ships, newShip];

    setGameState((prev) => ({
      ...prev,
      player1Grid: newGrid,
      player1Ships: newShips,
      phase:
        newShips.length === Object.values(ShipType).length
          ? 'battle'
          : 'placement',
    }));

    setSelectedShip(null);
  };

  const handleBattleMove = (cellId: string) => {
    if (gameState.isGameOver || gameState.isComputerTurn) return;

    const targetCell = gameState.player2Grid.find((cell) => cell.id === cellId);
    if (!targetCell || targetCell.isHit) return;

    const targetShip = getShipAtPosition(
      gameState.player2Ships,
      targetCell.position
    );
    const isHit = Boolean(targetShip);

    setLastHit({
      position: `${String.fromCharCode(65 + targetCell.position.x)}${targetCell.position.y + 1}`,
      wasHit: isHit,
    });

    const newGrid = gameState.player2Grid.map((cell) =>
      cell.id === cellId ? { ...cell, isHit: true } : cell
    );

    let newShips = [...gameState.player2Ships];
    let newSunkShips = [...gameState.playerStats.sunkShips];

    if (targetShip) {
      newShips = newShips.map((ship) => {
        if (ship.id === targetShip.id) {
          const newHits = [...ship.hits, targetCell.position];
          const updatedShip = { ...ship, hits: newHits };
          if (isShipSunk(updatedShip) && !newSunkShips.includes(updatedShip)) {
            newSunkShips.push(updatedShip);
          }
          return updatedShip;
        }
        return ship;
      });
    }

    const newPlayerStats = {
      hits: gameState.playerStats.hits + (isHit ? 1 : 0),
      misses: gameState.playerStats.misses + (isHit ? 0 : 1),
      sunkShips: newSunkShips,
    };

    const isGameOver = newSunkShips.length === gameState.player2Ships.length;

    setGameState((prev) => ({
      ...prev,
      player2Grid: newGrid,
      player2Ships: newShips,
      playerStats: newPlayerStats,
      isGameOver,
      winner: isGameOver ? 'Player' : null,
      showAlert: isGameOver,
      isComputerTurn: !isGameOver,
    }));

    if (!isGameOver) {
      setTimeout(computerMove, COMPUTER_MOVE_DELAY);
    }
  };

  const computerMove = () => {
    const availableCells = gameState.player1Grid.filter((cell) => !cell.isHit);
    if (availableCells.length === 0) return;

    const targetCell =
      availableCells[Math.floor(Math.random() * availableCells.length)];
    const targetShip = getShipAtPosition(
      gameState.player1Ships,
      targetCell.position
    );
    const isHit = Boolean(targetShip);

    const newGrid = gameState.player1Grid.map((cell) =>
      cell.id === targetCell.id ? { ...cell, isHit: true } : cell
    );

    let newShips = [...gameState.player1Ships];
    let newSunkShips = [...gameState.computerStats.sunkShips];

    setLastHit({
      position: `${String.fromCharCode(65 + targetCell.position.x)}${targetCell.position.y + 1}`,
      wasHit: isHit,
    });

    if (targetShip) {
      newShips = newShips.map((ship) => {
        if (ship.id === targetShip.id) {
          const newHits = [...ship.hits, targetCell.position];
          const updatedShip = { ...ship, hits: newHits };
          if (isShipSunk(updatedShip) && !newSunkShips.includes(updatedShip)) {
            newSunkShips.push(updatedShip);
          }
          return updatedShip;
        }
        return ship;
      });
    }

    const newComputerStats = {
      hits: gameState.computerStats.hits + (isHit ? 1 : 0),
      misses: gameState.computerStats.misses + (isHit ? 0 : 1),
      sunkShips: newSunkShips,
    };

    const isGameOver = newSunkShips.length === gameState.player1Ships.length;

    setGameState((prev) => ({
      ...prev,
      player1Grid: newGrid,
      player1Ships: newShips,
      computerStats: newComputerStats,
      isGameOver,
      winner: isGameOver ? 'Computer' : null,
      showAlert: isGameOver,
      isComputerTurn: false,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Battleship</h1>
        <Button onClick={initGame} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Reset Game
        </Button>
      </div>

      {gameState.phase === 'battle' && (
        <>
          <ShipStatusPanel
            ships={gameState.player1Ships}
            stats={gameState.playerStats}
          />
          <ShipStatusPanel
            ships={gameState.player2Ships}
            stats={gameState.computerStats}
            isEnemy
          />
        </>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <GameBoard
            isPlayerBoard={true}
            grid={gameState.player1Grid}
            ships={gameState.player1Ships}
            stats={gameState.computerStats}
            isComputerTurn={gameState.isComputerTurn}
            phase={gameState.phase}
            onCellClick={
              gameState.phase === 'placement' ? handleCellClick : undefined
            }
            selectedShip={selectedShip}
            isVertical={isVertical}
          />
        </div>

        {gameState.phase === 'placement' ? (
          <ShipPlacement
            selectedShip={selectedShip}
            placedShips={gameState.player1Ships.map((ship) => ship.type)}
            onSelectShip={handleShipSelect}
            onRotateShip={handleShipRotate}
            onAutoPlace={handleAutoPlace}
          />
        ) : (
          <div className="flex-1">
            <GameBoard
              isPlayerBoard={false}
              grid={gameState.player2Grid}
              ships={gameState.player2Ships}
              stats={gameState.playerStats}
              isComputerTurn={gameState.isComputerTurn}
              phase={gameState.phase}
              onCellClick={handleCellClick}
            />
          </div>
        )}
      </div>

      {gameState.phase === 'battle' && (
        <GameStatus
          activeShips={gameState.player1Ships.filter(
            (ship) => ship.hits.length < ship.positions.length
          )}
          sunkShips={gameState.player1Ships.filter(
            (ship) => ship.hits.length === ship.positions.length
          )}
          isPlayerTurn={!gameState.isComputerTurn}
          lastHit={lastHit}
        />
      )}

      <AlertDialog open={gameState.showAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Sword className="w-5 h-5" />
              Battle Concluded!
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                {gameState.winner === 'Player'
                  ? 'Victory! You have destroyed the enemy fleet.'
                  : 'Defeat! Your fleet has been destroyed.'}
              </p>
              <div className="flex gap-4 pt-2">
                <div className="flex-1">
                  <p className="font-medium">Your Stats</p>
                  <p className="text-sm">Hits: {gameState.playerStats.hits}</p>
                  <p className="text-sm">
                    Ships Sunk: {gameState.playerStats.sunkShips.length}
                  </p>
                  <p className="text-sm">
                    Accuracy: {calculateAccuracy(gameState.playerStats)}%
                  </p>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Computer Stats</p>
                  <p className="text-sm">
                    Hits: {gameState.computerStats.hits}
                  </p>
                  <p className="text-sm">
                    Ships Sunk: {gameState.computerStats.sunkShips.length}
                  </p>
                  <p className="text-sm">
                    Accuracy: {calculateAccuracy(gameState.computerStats)}%
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={initGame}>Play Again</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
