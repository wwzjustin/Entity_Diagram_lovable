
import { Entity } from "./Entity";

export interface ProjectContributor {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  lastActive: string;
  role: 'owner' | 'editor' | 'viewer';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  entities: Entity[];
  createdAt: string;
  updatedAt: string;
  createdBy?: ProjectContributor;
  lastUpdatedBy?: ProjectContributor;
  contributors: ProjectContributor[];
  isShared: boolean;
  shareCode?: string;
  activeCollaborators?: string[]; // IDs of currently active users
}
