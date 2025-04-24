
import { useState, useCallback, useRef } from "react";
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
  NodeChange,
  NodeMouseHandler,
  Panel,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { PlusSquare } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import EntityNode from "./EntityNode";
import { initialNodes, initialEdges } from "../data/initialData";

const nodeTypes = {
  entity: EntityNode
};

interface ErdCanvasProps {
  onEntitySelect: (entityId: string | null) => void;
}

const ErdCanvas = ({ onEntitySelect }: ErdCanvasProps) => {
  const { toast } = useToast();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const { project, fitView, getZoom } = useReactFlow();

  const onConnect = useCallback((connection: Connection) => {
    // Create a default relationship type (one-to-many)
    const newEdge = {
      ...connection,
      animated: false,
      type: "smoothstep",
      label: "1:N",
      className: "relation-one-to-many",
      style: { stroke: "#94a3b8", strokeWidth: 2 },
    };
    
    setEdges((eds) => addEdge(newEdge, eds));
    
    toast({
      title: "Relationship Created",
      description: "A new relationship has been established between entities.",
    });
  }, [setEdges, toast]);

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNode(node.id);
    onEntitySelect(node.id);
  }, [onEntitySelect]);

  const handleAddEntity = useCallback(() => {
    const id = `entity-${Date.now()}`;
    const newNode: Node = {
      id,
      type: "entity",
      position: { x: 100, y: 100 },
      data: { 
        label: "New Entity", 
        columns: [
          { id: "col-1", name: "id", type: "INTEGER", isPrimaryKey: true, isForeignKey: false },
          { id: "col-2", name: "name", type: "VARCHAR(255)", isPrimaryKey: false, isForeignKey: false },
          { id: "col-3", name: "created_at", type: "TIMESTAMP", isPrimaryKey: false, isForeignKey: false },
        ]
      }
    };
    
    setNodes((nds) => [...nds, newNode]);
    
    toast({
      title: "Entity Added",
      description: "A new entity has been added to the diagram.",
    });
    
    setTimeout(() => {
      fitView({ padding: 0.2, nodes: [newNode] });
    }, 100);
  }, [setNodes, fitView, toast]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const id = `entity-${Date.now()}`;
      const newNode = {
        id,
        type: "entity",
        position,
        data: { 
          label: "New Entity", 
          columns: [
            { id: "col-1", name: "id", type: "INTEGER", isPrimaryKey: true, isForeignKey: false },
            { id: "col-2", name: "name", type: "VARCHAR(255)", isPrimaryKey: false, isForeignKey: false },
            { id: "col-3", name: "created_at", type: "TIMESTAMP", isPrimaryKey: false, isForeignKey: false },
          ]
        }
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [project, setNodes]
  );

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        attributionPosition="bottom-right"
      >
        <Background gap={24} color="#e2e8f0" variant="dots" />
        <Controls />
        <MiniMap zoomable pannable />
        <Panel position="top-right">
          <Button 
            variant="secondary"
            className="flex items-center gap-1"
            onClick={handleAddEntity}
          >
            <PlusSquare className="h-4 w-4" />
            Add Entity
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default ErdCanvas;
