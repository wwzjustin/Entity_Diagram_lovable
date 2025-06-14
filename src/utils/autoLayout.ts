
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
  const cols = Math.ceil(Math.sqrt(entityCount * 1.2)); // More square-like distribution
  const rows = Math.ceil(entityCount / cols);
  
  // Canvas and spacing parameters - increased for better distribution
  const CANVAS_WIDTH = 1600;
  const CANVAS_HEIGHT = 1200;
  const ENTITY_WIDTH = 280;
  const ENTITY_HEIGHT = 200;
  const MIN_SPACING_X = 120; // Increased minimum spacing
  const MIN_SPACING_Y = 100; // Increased minimum spacing
  
  // Calculate optimal spacing to use full canvas
  const totalEntityWidth = cols * ENTITY_WIDTH;
  const totalEntityHeight = rows * ENTITY_HEIGHT;
  
  const optimalSpacingX = Math.max(MIN_SPACING_X, (CANVAS_WIDTH - totalEntityWidth) / (cols + 1));
  const optimalSpacingY = Math.max(MIN_SPACING_Y, (CANVAS_HEIGHT - totalEntityHeight) / (rows + 1));

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

  // Combine all entities with roots first, then by relationship complexity
  const sortedEntities = [...rootEntities, ...remainingEntities];

  // Position entities in an optimally spaced grid
  sortedEntities.forEach((entity, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    // Calculate position with optimal spacing
    const x = optimalSpacingX + col * (ENTITY_WIDTH + optimalSpacingX);
    const y = optimalSpacingY + row * (ENTITY_HEIGHT + optimalSpacingY);
    
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
