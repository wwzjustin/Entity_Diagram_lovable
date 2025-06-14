
import { Entity } from "@/types/Entity";

export interface LayoutPosition {
  x: number;
  y: number;
}

export const calculateAutoLayout = (entities: Entity[]): Map<string, LayoutPosition> => {
  const positions = new Map<string, LayoutPosition>();
  
  if (entities.length === 0) return positions;

  // Calculate optimal grid dimensions based on entity count
  const entityCount = entities.length;
  const cols = Math.ceil(Math.sqrt(entityCount * 1.5)); // Slightly wider than square
  const rows = Math.ceil(entityCount / cols);
  
  // Canvas and spacing parameters
  const CANVAS_WIDTH = 1200;
  const CANVAS_HEIGHT = 800;
  const ENTITY_WIDTH = 280;
  const ENTITY_HEIGHT = 200;
  const MIN_SPACING_X = 50;
  const MIN_SPACING_Y = 50;
  
  // Calculate spacing to distribute evenly across canvas
  const availableWidth = CANVAS_WIDTH - (cols * ENTITY_WIDTH);
  const availableHeight = CANVAS_HEIGHT - (rows * ENTITY_HEIGHT);
  
  const spacingX = Math.max(MIN_SPACING_X, availableWidth / (cols + 1));
  const spacingY = Math.max(MIN_SPACING_Y, availableHeight / (rows + 1));

  // Find entities with no foreign keys (root entities)
  const rootEntities = entities.filter(entity => 
    !entity.columns.some(col => col.isForeignKey)
  );

  // Sort remaining entities by relationship complexity
  const remainingEntities = entities.filter(e => !rootEntities.includes(e));
  remainingEntities.sort((a, b) => {
    const aRels = a.columns.filter(col => col.isForeignKey).length;
    const bRels = b.columns.filter(col => col.isForeignKey).length;
    return bRels - aRels;
  });

  // Combine all entities with roots first
  const sortedEntities = [...rootEntities, ...remainingEntities];

  // Position entities in an evenly distributed grid
  sortedEntities.forEach((entity, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    // Calculate position with even distribution
    const x = spacingX + col * (ENTITY_WIDTH + spacingX);
    const y = spacingY + row * (ENTITY_HEIGHT + spacingY);
    
    positions.set(entity.id, { x, y });
  });

  return positions;
};

export const snapToGrid = (position: LayoutPosition, gridSize: number = 20): LayoutPosition => {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize
  };
};
