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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Plus, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import EntityCard from "./EntityCard";
import { Entity } from "@/types/Entity";

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

  // Convert entities to nodes
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
  }, [entities, setNodes]);

  const onConnect = useCallback((connection: Connection) => {
    const newEdge: Edge = {
      id: `edge-${Date.now()}`,
      ...connection,
      type: "smoothstep",
      animated: false,
      style: { stroke: "#3b82f6", strokeWidth: 2 },
      label: "1:N",
    };
    
    setEdges((eds) => addEdge(newEdge, eds));
    
    toast({
      title: "Relationship Created",
      description: "A new relationship has been established between entities.",
    });
  }, [setEdges, toast]);

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    onEntitySelect(node.id);
    // Center the clicked entity
    setCenter(node.position.x + 150, node.position.y + 100, { zoom: 1, duration: 800 });
  }, [onEntitySelect, setCenter]);

  const handleAddEntity = useCallback(() => {
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
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      visible: true,
    };
    
    onEntityAdd(newEntity);
    
    toast({
      title: "Entity Added",
      description: "A new entity has been added to the diagram.",
    });
  }, [onEntityAdd, toast]);

  const handleNodeDragStop = useCallback((_, node) => {
    const entity = entities.find(e => e.id === node.id);
    if (entity) {
      onEntityUpdate({
        ...entity,
        position: node.position,
      });
    }
  }, [entities, onEntityUpdate]);

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
        className="bg-slate-50"
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
          className="bg-white border border-gray-200 rounded-lg"
          nodeColor="#3b82f6"
        />

        {/* Zoom Controls */}
        <Panel position="top-right" className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => zoomIn({ duration: 300 })}
            className="bg-white"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => zoomOut({ duration: 300 })}
            className="bg-white"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => fitView({ duration: 500, padding: 0.2 })}
            className="bg-white"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </Panel>

        {/* Floating Add Button */}
        <Panel position="bottom-right">
          <Button 
            onClick={handleAddEntity}
            className="rounded-full w-14 h-14 shadow-lg bg-blue-600 hover:bg-blue-700"
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
