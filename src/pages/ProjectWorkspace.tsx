
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReactFlowProvider } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Share } from "lucide-react";
import ErdCanvas from "@/components/ErdCanvas";
import EntitySidebar from "@/components/EntitySidebar";
import ShareProjectDialog from "@/components/ShareProjectDialog";
import CollaboratorIndicator from "@/components/CollaboratorIndicator";
import ProjectMetadata from "@/components/ProjectMetadata";
import { Entity } from "@/types/Entity";
import { Project, ProjectContributor } from "@/types/Project";
import { sampleProjects } from "@/data/sampleProjects";

const PROJECTS_STORAGE_KEY = 'erdProjects';

const ProjectWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);

  // Simulate current user
  const currentUser: ProjectContributor = {
    id: 'current-user',
    name: 'You',
    email: 'user@example.com',
    lastActive: new Date().toISOString(),
    role: 'owner',
  };

  useEffect(() => {
    // Load project data from localStorage first
    const savedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
    let allProjects = sampleProjects;
    
    if (savedProjects) {
      try {
        allProjects = JSON.parse(savedProjects);
      } catch (error) {
        console.error('Error loading projects from localStorage:', error);
      }
    }

    const foundProject = allProjects.find(p => p.id === projectId);
    if (foundProject) {
      // Ensure project has collaboration properties
      const enhancedProject = {
        ...foundProject,
        contributors: foundProject.contributors || [],
        isShared: foundProject.isShared || false,
        shareCode: foundProject.shareCode,
        activeCollaborators: foundProject.activeCollaborators || [],
        createdBy: foundProject.createdBy || currentUser,
        lastUpdatedBy: foundProject.lastUpdatedBy || currentUser,
      };
      setProject(enhancedProject);
    } else if (projectId) {
      // Create a new empty project if not found
      const newProject: Project = {
        id: projectId,
        name: "New Project",
        description: "Click to edit and start building your entity diagram",
        entities: [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        contributors: [],
        isShared: false,
        activeCollaborators: [],
        createdBy: currentUser,
        lastUpdatedBy: currentUser,
      };
      setProject(newProject);
      
      // Save the new project to localStorage
      const updatedProjects = [...allProjects, newProject];
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects));
    }
  }, [projectId]);

  // Save project changes to localStorage whenever project state changes
  useEffect(() => {
    if (project) {
      const savedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
      let allProjects = [];
      
      if (savedProjects) {
        try {
          allProjects = JSON.parse(savedProjects);
        } catch (error) {
          console.error('Error loading projects from localStorage:', error);
          allProjects = sampleProjects;
        }
      } else {
        allProjects = sampleProjects;
      }

      // Update the current project in the array
      const updatedProjects = allProjects.map(p => 
        p.id === project.id ? project : p
      );

      // If project doesn't exist in the array, add it
      if (!allProjects.find(p => p.id === project.id)) {
        updatedProjects.push(project);
      }

      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects));
    }
  }, [project]);

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
        updatedAt: new Date().toISOString().split('T')[0],
        lastUpdatedBy: currentUser,
      };
    });
  };

  const handleEntityDelete = (entityId: string) => {
    setProject(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        entities: prev.entities.filter(entity => entity.id !== entityId),
        updatedAt: new Date().toISOString().split('T')[0],
        lastUpdatedBy: currentUser,
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
        updatedAt: new Date().toISOString().split('T')[0],
        lastUpdatedBy: currentUser,
      };
    });
  };

  const handleProjectUpdate = (updatedProject: Project) => {
    setProject(updatedProject);
  };

  const goBackToProjects = () => {
    navigate('/');
  };

  return (
    <div className="flex h-screen w-full bg-slate-50">
      {/* Fixed Header with proper spacing */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left side buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={goBackToProjects} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
            <Button variant="outline" onClick={() => setShowMetadata(!showMetadata)} className="gap-2">
              <Users className="h-4 w-4" />
              Details
            </Button>
            <Button variant="outline" onClick={() => setShowShareDialog(true)} className="gap-2">
              <Share className="h-4 w-4" />
              Share
            </Button>
          </div>

          {/* Center project info */}
          <div className="flex-1 max-w-md mx-4">
            <div className="text-center">
              <h1 className="font-semibold text-gray-900 truncate">{project.name}</h1>
              <p className="text-sm text-gray-600 truncate">{project.description}</p>
              <div className="mt-1">
                <CollaboratorIndicator 
                  contributors={project.contributors}
                  activeCollaborators={project.activeCollaborators}
                />
              </div>
            </div>
          </div>

          {/* Right side spacer to balance layout */}
          <div className="w-48"></div>
        </div>
      </div>

      {/* Project Metadata Panel - adjusted position */}
      {showMetadata && (
        <div className="absolute top-20 left-4 z-10 w-96">
          <ProjectMetadata project={project} />
        </div>
      )}

      {/* Main content with top padding for header */}
      <div className="flex w-full pt-16">
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

      <ShareProjectDialog 
        project={project}
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        onProjectUpdate={handleProjectUpdate}
      />
    </div>
  );
};

export default ProjectWorkspace;
