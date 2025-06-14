
import { Entity } from "./Entity";

export interface Project {
  id: string;
  name: string;
  description: string;
  entities: Entity[];
  createdAt: string;
  updatedAt: string;
}
