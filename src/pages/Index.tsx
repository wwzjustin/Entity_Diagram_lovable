
import { useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import ErdCanvas from "@/components/ErdCanvas";
import Sidebar from "@/components/Sidebar";

const Index = () => {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  const handleEntitySelect = (entityId: string | null) => {
    setSelectedEntity(entityId);
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar selectedEntity={selectedEntity} />
      <div className="flex-1 h-full">
        <ReactFlowProvider>
          <ErdCanvas onEntitySelect={handleEntitySelect} />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default Index;
