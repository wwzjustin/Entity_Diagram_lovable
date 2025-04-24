
import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Key } from "lucide-react";

interface Column {
  id: string;
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  description?: string;
  sampleValue?: string;
}

interface EntityNodeData {
  label: string;
  columns: Column[];
}

interface EntityNodeProps {
  id: string;
  data: EntityNodeData;
  selected: boolean;
}

const EntityNode = ({ id, data, selected }: EntityNodeProps) => {
  return (
    <>
      <div className={`node-header ${selected ? "bg-blue-600" : ""}`}>
        {data.label}
      </div>
      <div className="node-content">
        {data.columns.map((column) => (
          <div key={column.id} className="column-row">
            {column.isPrimaryKey && (
              <span className="primary-key-indicator" title="Primary Key">
                <Key className="h-3 w-3" />
              </span>
            )}
            {column.isForeignKey && (
              <span className="foreign-key-indicator" title="Foreign Key">
                <Key className="h-3 w-3" />
              </span>
            )}
            <span className="column-name">{column.name}</span>
            <span className="column-type">{column.type}</span>
          </div>
        ))}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ right: -4 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ left: -4 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ bottom: -4 }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ top: -4 }}
      />
    </>
  );
};

export default memo(EntityNode);
