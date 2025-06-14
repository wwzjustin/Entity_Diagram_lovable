
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Users, UserPlus, Mail } from "lucide-react";
import { Project, ProjectContributor } from "@/types/Project";
import { useToast } from "@/hooks/use-toast";

interface ShareProjectDialogProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onProjectUpdate: (updatedProject: Project) => void;
}

const ShareProjectDialog = ({ project, isOpen, onClose, onProjectUpdate }: ShareProjectDialogProps) => {
  const [emailToInvite, setEmailToInvite] = useState("");
  const { toast } = useToast();

  const generateShareCode = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const enableSharing = () => {
    const shareCode = generateShareCode();
    const updatedProject = {
      ...project,
      isShared: true,
      shareCode,
    };
    onProjectUpdate(updatedProject);
    toast({
      title: "Project sharing enabled",
      description: "Share code generated successfully",
    });
  };

  const disableSharing = () => {
    const updatedProject = {
      ...project,
      isShared: false,
      shareCode: undefined,
    };
    onProjectUpdate(updatedProject);
    toast({
      title: "Project sharing disabled",
      description: "Share code has been revoked",
    });
  };

  const copyShareCode = () => {
    if (project.shareCode) {
      navigator.clipboard.writeText(project.shareCode);
      toast({
        title: "Share code copied",
        description: "Share code has been copied to clipboard",
      });
    }
  };

  const inviteByEmail = () => {
    if (!emailToInvite.trim()) return;

    // In a real app, this would send an actual email invitation
    const newContributor: ProjectContributor = {
      id: `contributor-${Date.now()}`,
      name: emailToInvite.split('@')[0],
      email: emailToInvite,
      lastActive: new Date().toISOString(),
      role: 'editor',
    };

    const updatedProject = {
      ...project,
      contributors: [...project.contributors, newContributor],
    };
    
    onProjectUpdate(updatedProject);
    setEmailToInvite("");
    
    toast({
      title: "Invitation sent",
      description: `Invitation sent to ${emailToInvite}`,
    });
  };

  const removeContributor = (contributorId: string) => {
    const updatedProject = {
      ...project,
      contributors: project.contributors.filter(c => c.id !== contributorId),
    };
    onProjectUpdate(updatedProject);
    
    toast({
      title: "Contributor removed",
      description: "Contributor has been removed from the project",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Share Project
          </DialogTitle>
          <DialogDescription>
            Collaborate with others on this entity diagram project
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Share Code Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quick Share</Label>
            {!project.isShared ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Generate a share code for quick access
                </p>
                <Button onClick={enableSharing} className="w-full">
                  Enable Sharing
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input 
                    value={project.shareCode || ''} 
                    readOnly 
                    className="font-mono"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={copyShareCode}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={disableSharing}
                    className="text-xs"
                  >
                    Disable Sharing
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Email Invitation Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Invite by Email</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter email address"
                value={emailToInvite}
                onChange={(e) => setEmailToInvite(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && inviteByEmail()}
              />
              <Button 
                onClick={inviteByEmail}
                disabled={!emailToInvite.trim()}
                size="icon"
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Contributors List */}
          {project.contributors.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Contributors</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {project.contributors.map((contributor) => (
                  <div key={contributor.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white">
                        {contributor.name[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{contributor.name}</span>
                        <span className="text-xs text-gray-500">{contributor.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {contributor.role}
                      </Badge>
                      {contributor.role !== 'owner' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeContributor(contributor.id)}
                          className="text-xs p-1 h-6"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareProjectDialog;
