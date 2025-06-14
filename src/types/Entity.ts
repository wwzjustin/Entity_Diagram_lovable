
export interface Column {
  id: string;
  name: string;
  dataType: string;
  description?: string;
  sampleValue?: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
}

export interface Entity {
  id: string;
  name: string;
  columns: Column[];
  position: { x: number; y: number };
  visible?: boolean;
}

export interface Relationship {
  id: string;
  fromEntityId: string;
  toEntityId: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  fromColumn?: string;
  toColumn?: string;
}
