
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Users, Database } from "lucide-react";
import { Project } from "@/types/Project";

interface ProjectMetadataProps {
  project: Project;
}

const ProjectMetadata = ({ project }: ProjectMetadataProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Database className="h-5 w-5" />
          Project Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-gray-600">{formatDate(project.createdAt)}</p>
                {project.createdBy && (
                  <p className="text-xs text-gray-500">by {project.createdBy.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-gray-600">{formatDate(project.updatedAt)}</p>
                {project.lastUpdatedBy && (
                  <p className="text-xs text-gray-500">by {project.lastUpdatedBy.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Entities</p>
                <p className="text-sm text-gray-600">{project.entities.length} total</p>
              </div>
            </div>
          </div>

          {/* Contributors */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <p className="text-sm font-medium">Contributors ({project.contributors.length})</p>
            </div>
            
            {project.contributors.length > 0 ? (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {project.contributors.map((contributor) => (
                  <div key={contributor.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white">
                        {contributor.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{contributor.name}</p>
                        <p className="text-xs text-gray-500">{contributor.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {contributor.role}
                      </Badge>
                      {project.activeCollaborators?.includes(contributor.id) && (
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Currently active" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No collaborators yet</p>
            )}

            {project.isShared && (
              <div className="pt-2 border-t">
                <Badge variant="secondary" className="text-xs">
                  Sharing enabled • Code: {project.shareCode}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectMetadata;
