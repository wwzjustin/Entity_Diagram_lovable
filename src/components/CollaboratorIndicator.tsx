
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { ProjectContributor } from "@/types/Project";

interface CollaboratorIndicatorProps {
  contributors: ProjectContributor[];
  activeCollaborators?: string[];
}

const CollaboratorIndicator = ({ contributors, activeCollaborators = [] }: CollaboratorIndicatorProps) => {
  const activeContributors = contributors.filter(c => 
    activeCollaborators.includes(c.id)
  );

  if (activeContributors.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {activeContributors.slice(0, 3).map((contributor) => (
          <div
            key={contributor.id}
            className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-xs text-white border-2 border-white relative"
            title={`${contributor.name} is actively editing`}
          >
            {contributor.name[0].toUpperCase()}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white animate-pulse" />
          </div>
        ))}
      </div>
      {activeContributors.length > 3 && (
        <Badge variant="secondary" className="text-xs">
          +{activeContributors.length - 3} more
        </Badge>
      )}
      <Badge variant="outline" className="text-xs gap-1">
        <Users className="h-3 w-3" />
        {activeContributors.length} active
      </Badge>
    </div>
  );
};

export default CollaboratorIndicator;
