
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Database, Calendar, Users, ShoppingCart, Building2, User } from "lucide-react";
import { Project, ProjectContributor } from "@/types/Project";
import { sampleProjects } from "@/data/sampleProjects";

const PROJECTS_STORAGE_KEY = 'erdProjects';

const ProjectsDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  // Simulate current user
  const currentUser: ProjectContributor = {
    id: 'current-user',
    name: 'You',
    email: 'user@example.com',
    lastActive: new Date().toISOString(),
    role: 'owner',
  };

  // Load projects from localStorage on component mount
  useEffect(() => {
    const savedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        // Ensure all projects have collaboration properties
        const enhancedProjects = parsedProjects.map((project: Project) => ({
          ...project,
          contributors: project.contributors || [],
          isShared: project.isShared || false,
          activeCollaborators: project.activeCollaborators || [],
          createdBy: project.createdBy || currentUser,
          lastUpdatedBy: project.lastUpdatedBy || currentUser,
        }));
        setProjects(enhancedProjects);
      } catch (error) {
        console.error('Error loading projects from localStorage:', error);
        setProjects(sampleProjects);
      }
    } else {
      // If no saved projects, use sample projects and save them
      const enhancedSampleProjects = sampleProjects.map(project => ({
        ...project,
        contributors: [],
        isShared: false,
        activeCollaborators: [],
        createdBy: currentUser,
        lastUpdatedBy: currentUser,
      }));
      setProjects(enhancedSampleProjects);
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(enhancedSampleProjects));
    }
  }, []);

  // Save projects to localStorage whenever projects state changes
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    }
  }, [projects]);

  const createNewProject = () => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
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
    
    setProjects(prev => {
      const updatedProjects = [...prev, newProject];
      return updatedProjects;
    });
    
    navigate(`/project/${newProject.id}`);
  };

  const openProject = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const getProjectIcon = (projectId: string) => {
    switch (projectId) {
      case "customer-data":
        return <Users className="h-8 w-8 text-blue-600" />;
      case "agent-data":
        return <Building2 className="h-8 w-8 text-green-600" />;
      case "ecom-data":
        return <ShoppingCart className="h-8 w-8 text-purple-600" />;
      default:
        return <Database className="h-8 w-8 text-gray-600" />;
    }
  };

  const getEntityCount = (project: Project) => {
    return project.entities.length;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Entity Diagram Projects</h1>
          <p className="text-lg text-gray-600">Create and manage your database entity relationship diagrams</p>
        </div>

        {/* Create New Project Button */}
        <div className="mb-8">
          <Button onClick={createNewProject} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Create New Project
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              onClick={() => openProject(project.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getProjectIcon(project.id)}
                    <div>
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">Updated {project.updatedAt}</span>
                        {project.lastUpdatedBy && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <User className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{project.lastUpdatedBy.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 line-clamp-2">
                  {project.description}
                </CardDescription>
                
                {/* Project Stats */}
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="gap-1">
                    <Database className="h-3 w-3" />
                    {getEntityCount(project)} entities
                  </Badge>
                  
                  {project.contributors.length > 0 && (
                    <Badge variant="outline" className="gap-1">
                      <Users className="h-3 w-3" />
                      {project.contributors.length} contributors
                    </Badge>
                  )}
                </div>

                {/* Collaboration Indicators */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {project.isShared && (
                      <Badge variant="secondary" className="text-xs">
                        Shared
                      </Badge>
                    )}
                    {project.activeCollaborators && project.activeCollaborators.length > 0 && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-xs text-green-600 font-medium">
                          {project.activeCollaborators.length} active
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    Open Project →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-16">
            <Database className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">Create your first entity diagram project to get started</p>
            <Button onClick={createNewProject} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Create Your First Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsDashboard;
