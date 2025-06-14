
import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Key, Database } from "lucide-react";
import { Entity } from "@/types/Entity";

interface EntityCardProps {
  id: string;
  data: Entity;
  selected: boolean;
}

const EntityCard = ({ id, data, selected }: EntityCardProps) => {
  return (
    <div className={`
      bg-white rounded-lg shadow-sm border transition-all duration-200
      ${selected ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}
      min-w-[250px] max-w-[320px]
    `}>
      {/* Entity Header */}
      <div className={`
        px-4 py-3 border-b border-gray-100 rounded-t-lg
        ${selected ? 'bg-blue-50' : 'bg-gray-50'}
      `}>
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-gray-600" />
          <h3 className="font-semibold text-gray-900 truncate">{data.name}</h3>
        </div>
      </div>

      {/* Columns List */}
      <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
        {data.columns.map((column) => (
          <div key={column.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              {column.isPrimaryKey && (
                <div title="Primary Key">
                  <Key className="h-3 w-3 text-amber-600 flex-shrink-0" />
                </div>
              )}
              {column.isForeignKey && (
                <div title="Foreign Key">
                  <Key className="h-3 w-3 text-blue-600 flex-shrink-0" />
                </div>
              )}
              <span className="font-medium text-gray-900 text-sm truncate">{column.name}</span>
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded flex-shrink-0">
              {column.dataType}
            </span>
          </div>
        ))}
        {data.columns.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No columns defined
          </div>
        )}
      </div>

      {/* Connection Handles */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ right: -6 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ left: -6 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ bottom: -6 }}
      />
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ top: -6 }}
      />
    </div>
  );
};

export default memo(EntityCard);
