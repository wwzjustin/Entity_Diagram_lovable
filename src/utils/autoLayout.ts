
import { Entity } from "@/types/Entity";

export interface LayoutPosition {
  x: number;
  y: number;
}

export const calculateAutoLayout = (entities: Entity[]): Map<string, LayoutPosition> => {
  const positions = new Map<string, LayoutPosition>();
  
  if (entities.length === 0) return positions;

  // Find entities with no foreign keys (root entities)
  const rootEntities = entities.filter(entity => 
    !entity.columns.some(col => col.isForeignKey)
  );

  // If no root entities, use the first entity as root
  const roots = rootEntities.length > 0 ? rootEntities : [entities[0]];
  
  // Grid layout parameters
  const GRID_SIZE = 350;
  const ENTITY_WIDTH = 280;
  const ENTITY_HEIGHT = 200;
  
  let currentRow = 0;
  let currentCol = 0;
  const maxCols = Math.ceil(Math.sqrt(entities.length));

  // Position root entities first
  roots.forEach((entity, index) => {
    positions.set(entity.id, {
      x: index * GRID_SIZE,
      y: 0
    });
  });

  // Position remaining entities in a grid, prioritizing those with relationships
  const remainingEntities = entities.filter(e => !roots.includes(e));
  
  // Sort by number of relationships (entities with more relationships come first)
  remainingEntities.sort((a, b) => {
    const aRels = a.columns.filter(col => col.isForeignKey).length;
    const bRels = b.columns.filter(col => col.isForeignKey).length;
    return bRels - aRels;
  });

  let nextY = roots.length > 0 ? GRID_SIZE : 0;
  currentCol = 0;

  remainingEntities.forEach((entity) => {
    if (currentCol >= maxCols) {
      currentCol = 0;
      nextY += GRID_SIZE;
    }

    positions.set(entity.id, {
      x: currentCol * GRID_SIZE + (currentCol * 50), // Add some spacing
      y: nextY
    });

    currentCol++;
  });

  return positions;
};

export const snapToGrid = (position: LayoutPosition, gridSize: number = 20): LayoutPosition => {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize
  };
};
