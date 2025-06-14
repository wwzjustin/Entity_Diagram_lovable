
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReactFlowProvider } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ErdCanvas from "@/components/ErdCanvas";
import EntitySidebar from "@/components/EntitySidebar";
import { Entity } from "@/types/Entity";
import { Project } from "@/types/Project";
import { sampleProjects } from "@/data/sampleProjects";

const ProjectWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  useEffect(() => {
    // Load project data (in a real app, this would come from a database)
    const foundProject = sampleProjects.find(p => p.id === projectId);
    if (foundProject) {
      setProject(foundProject);
    } else if (projectId) {
      // Create a new empty project if not found
      const newProject: Project = {
        id: projectId,
        name: "New Project",
        description: "Click to edit and start building your entity diagram",
        entities: [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setProject(newProject);
    }
  }, [projectId]);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading project...</h2>
          <p className="text-gray-600">Please wait while we load your project data.</p>
        </div>
      </div>
    );
  }

  const handleEntitySelect = (entityId: string | null) => {
    setSelectedEntityId(entityId);
  };

  const handleEntityUpdate = (updatedEntity: Entity) => {
    setProject(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        entities: prev.entities.map(entity => 
          entity.id === updatedEntity.id ? updatedEntity : entity
        ),
        updatedAt: new Date().toISOString().split('T')[0]
      };
    });
  };

  const handleEntityDelete = (entityId: string) => {
    setProject(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        entities: prev.entities.filter(entity => entity.id !== entityId),
        updatedAt: new Date().toISOString().split('T')[0]
      };
    });
    if (selectedEntityId === entityId) {
      setSelectedEntityId(null);
    }
  };

  const handleEntityAdd = (entity: Entity) => {
    setProject(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        entities: [...prev.entities, entity],
        updatedAt: new Date().toISOString().split('T')[0]
      };
    });
  };

  const goBackToProjects = () => {
    navigate('/');
  };

  return (
    <div className="flex h-screen w-full bg-slate-50">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <Button variant="outline" onClick={goBackToProjects} className="gap-2 bg-white">
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Button>
      </div>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
          <h1 className="font-semibold text-gray-900">{project.name}</h1>
          <p className="text-sm text-gray-600">{project.description}</p>
        </div>
      </div>

      <EntitySidebar 
        entities={project.entities}
        selectedEntityId={selectedEntityId}
        onEntityUpdate={handleEntityUpdate}
        onEntityDelete={handleEntityDelete}
        onEntityAdd={handleEntityAdd}
        onEntitySelect={handleEntitySelect}
      />
      <div className="flex-1 h-full">
        <ReactFlowProvider>
          <ErdCanvas 
            entities={project.entities}
            onEntitySelect={handleEntitySelect}
            onEntityUpdate={handleEntityUpdate}
            onEntityAdd={handleEntityAdd}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default ProjectWorkspace;
