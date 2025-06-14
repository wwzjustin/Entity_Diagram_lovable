
import { useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import ErdCanvas from "@/components/ErdCanvas";
import EntitySidebar from "@/components/EntitySidebar";
import { Entity } from "@/types/Entity";

const Index = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  const handleEntitySelect = (entityId: string | null) => {
    setSelectedEntityId(entityId);
  };

  const handleEntityUpdate = (updatedEntity: Entity) => {
    setEntities(prev => 
      prev.map(entity => 
        entity.id === updatedEntity.id ? updatedEntity : entity
      )
    );
  };

  const handleEntityDelete = (entityId: string) => {
    setEntities(prev => prev.filter(entity => entity.id !== entityId));
    if (selectedEntityId === entityId) {
      setSelectedEntityId(null);
    }
  };

  const handleEntityAdd = (entity: Entity) => {
    setEntities(prev => [...prev, entity]);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50">
      <EntitySidebar 
        entities={entities}
        selectedEntityId={selectedEntityId}
        onEntityUpdate={handleEntityUpdate}
        onEntityDelete={handleEntityDelete}
        onEntityAdd={handleEntityAdd}
        onEntitySelect={handleEntitySelect}
      />
      <div className="flex-1 h-full">
        <ReactFlowProvider>
          <ErdCanvas 
            entities={entities}
            onEntitySelect={handleEntitySelect}
            onEntityUpdate={handleEntityUpdate}
            onEntityAdd={handleEntityAdd}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default Index;
