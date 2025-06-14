
import React, { useState, useCallback, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeMouseHandler,
  Panel,
  useReactFlow,
  BackgroundVariant,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Plus, ZoomIn, ZoomOut, RotateCcw, Layout, Grid } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import EntityCard from "./EntityCard";
import { Entity } from "@/types/Entity";
import { calculateAutoLayout, snapToGrid } from "@/utils/autoLayout";

const nodeTypes = {
  entity: EntityCard
};

interface ErdCanvasProps {
  entities: Entity[];
  onEntitySelect: (entityId: string | null) => void;
  onEntityUpdate: (entity: Entity) => void;
  onEntityAdd: (entity: Entity) => void;
}

const ErdCanvas = ({ entities, onEntitySelect, onEntityUpdate, onEntityAdd }: ErdCanvasProps) => {
  const { toast } = useToast();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView, zoomIn, zoomOut, setCenter } = useReactFlow();
  const [isAutoLayoutEnabled, setIsAutoLayoutEnabled] = useState(false);

  // Convert entities to nodes and create relationships
  React.useEffect(() => {
    const newNodes: Node[] = entities
      .filter(entity => entity.visible !== false)
      .map(entity => ({
        id: entity.id,
        type: "entity",
        position: entity.position,
        data: entity as any,
      }));
    setNodes(newNodes);

    // Create edges based on foreign key relationships with improved styling
    const newEdges: Edge[] = [];
    entities.forEach(entity => {
      entity.columns.forEach(column => {
        if (column.isForeignKey) {
          // Try to find the referenced entity based on naming convention
          const referencedEntityName = column.name.replace('_id', '');
          const referencedEntity = entities.find(e => 
            e.name.toLowerCase() === referencedEntityName || 
            e.id === referencedEntityName ||
            e.name.toLowerCase().replace(' ', '_') === referencedEntityName ||
            e.name.toLowerCase().replace(' ', '') === referencedEntityName
          );

          if (referencedEntity) {
            const edgeId = `${referencedEntity.id}-${entity.id}`;
            // Check if edge already exists
            if (!newEdges.find(edge => edge.id === edgeId)) {
              newEdges.push({
                id: edgeId,
                source: referencedEntity.id,
                target: entity.id,
                type: "smoothstep",
                animated: false,
                style: { 
                  stroke: "#3b82f6", 
                  strokeWidth: 2,
                  strokeDasharray: "5,5"
                },
                label: "1:N",
                labelStyle: {
                  fontSize: 12,
                  fontWeight: 600,
                  fill: "#3b82f6",
                  backgroundColor: "white",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  border: "1px solid #e5e7eb"
                },
                labelBgStyle: {
                  fill: "white",
                  fillOpacity: 0.9,
                },
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  color: "#3b82f6",
                  width: 20,
                  height: 20,
                },
              });
            }
          }
        }
      });
    });

    setEdges(newEdges);
  }, [entities, setNodes, setEdges]);

  const onConnect = useCallback((connection: Connection) => {
    const newEdge: Edge = {
      id: `edge-${Date.now()}`,
      ...connection,
      type: "smoothstep",
      animated: false,
      style: { 
        stroke: "#3b82f6", 
        strokeWidth: 2,
        strokeDasharray: "5,5"
      },
      label: "1:N",
      labelStyle: {
        fontSize: 12,
        fontWeight: 600,
        fill: "#3b82f6",
      },
      labelBgStyle: {
        fill: "white",
        fillOpacity: 0.9,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#3b82f6",
        width: 20,
        height: 20,
      },
    };
    
    setEdges((eds) => addEdge(newEdge, eds));
    
    toast({
      title: "Relationship Created",
      description: "A new relationship has been established between entities.",
    });
  }, [setEdges, toast]);

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    onEntitySelect(node.id);
    // Center the clicked entity with smooth animation
    setCenter(node.position.x + 150, node.position.y + 100, { zoom: 1, duration: 800 });
  }, [onEntitySelect, setCenter]);

  const handleAddEntity = useCallback(() => {
    // Find a good position for the new entity
    const existingPositions = entities.map(e => e.position);
    let newX = 100;
    let newY = 100;
    
    // Try to find an empty spot
    while (existingPositions.some(pos => 
      Math.abs(pos.x - newX) < 300 && Math.abs(pos.y - newY) < 250
    )) {
      newX += 350;
      if (newX > 1000) {
        newX = 100;
        newY += 300;
      }
    }

    const newEntity: Entity = {
      id: `entity-${Date.now()}`,
      name: "New Entity",
      columns: [
        { 
          id: `col-${Date.now()}`, 
          name: "id", 
          dataType: "INTEGER", 
          isPrimaryKey: true 
        }
      ],
      position: { x: newX, y: newY },
      visible: true,
    };
    
    onEntityAdd(newEntity);
    
    toast({
      title: "Entity Added",
      description: "A new entity has been added to the diagram.",
    });
  }, [entities, onEntityAdd, toast]);

  const handleAutoLayout = useCallback(() => {
    const layoutPositions = calculateAutoLayout(entities);
    
    // Update entities with new positions
    entities.forEach(entity => {
      const newPosition = layoutPositions.get(entity.id);
      if (newPosition) {
        onEntityUpdate({
          ...entity,
          position: newPosition,
        });
      }
    });

    // Fit view after layout
    setTimeout(() => {
      fitView({ duration: 500, padding: 0.1 });
    }, 100);

    toast({
      title: "Auto Layout Applied",
      description: "Entities have been automatically arranged for better visibility.",
    });
  }, [entities, onEntityUpdate, fitView, toast]);

  const handleNodeDragStop = useCallback((_, node) => {
    const entity = entities.find(e => e.id === node.id);
    if (entity) {
      // Snap to grid if enabled
      const finalPosition = isAutoLayoutEnabled ? 
        snapToGrid(node.position) : node.position;
        
      onEntityUpdate({
        ...entity,
        position: finalPosition,
      });
    }
  }, [entities, onEntityUpdate, isAutoLayoutEnabled]);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDragStop={handleNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gradient-to-br from-slate-50 to-blue-50"
        connectionLineStyle={{ stroke: "#3b82f6", strokeWidth: 2 }}
        defaultEdgeOptions={{
          style: { stroke: "#3b82f6", strokeWidth: 2 },
          type: "smoothstep",
        }}
      >
        <Background 
          gap={20} 
          color="#e2e8f0" 
          variant={BackgroundVariant.Dots}
          size={1}
        />
        
        <MiniMap 
          zoomable 
          pannable 
          className="bg-white border border-gray-200 rounded-lg shadow-lg"
          nodeColor="#3b82f6"
          nodeStrokeWidth={2}
          maskColor="rgba(0, 0, 0, 0.1)"
        />

        {/* Enhanced Controls */}
        <Panel position="top-right" className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => zoomIn({ duration: 300 })}
              className="bg-white shadow-md hover:shadow-lg"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => zoomOut({ duration: 300 })}
              className="bg-white shadow-md hover:shadow-lg"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fitView({ duration: 500, padding: 0.2 })}
              className="bg-white shadow-md hover:shadow-lg"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleAutoLayout}
              className="bg-white shadow-md hover:shadow-lg"
              title="Auto arrange entities"
            >
              <Layout className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={isAutoLayoutEnabled ? "default" : "outline"}
              onClick={() => setIsAutoLayoutEnabled(!isAutoLayoutEnabled)}
              className="bg-white shadow-md hover:shadow-lg"
              title="Toggle grid snapping"
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </Panel>

        {/* Enhanced Add Button */}
        <Panel position="bottom-right">
          <Button 
            onClick={handleAddEntity}
            className="rounded-full w-16 h-16 shadow-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-2 border-white"
            size="lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default ErdCanvas;
