
import { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Key, Database, ChevronDown, ChevronUp } from "lucide-react";
import { Entity } from "@/types/Entity";

interface EntityCardProps {
  id: string;
  data: Entity;
  selected: boolean;
}

const EntityCard = ({ id, data, selected }: EntityCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Separate primary keys, foreign keys, and regular columns
  const primaryKeys = data.columns.filter(col => col.isPrimaryKey);
  const foreignKeys = data.columns.filter(col => col.isForeignKey && !col.isPrimaryKey);
  const regularColumns = data.columns.filter(col => !col.isPrimaryKey && !col.isForeignKey);

  const getDataTypeColor = (dataType: string) => {
    if (dataType.includes('INT') || dataType.includes('BIGINT')) return 'bg-blue-100 text-blue-800';
    if (dataType.includes('VARCHAR') || dataType.includes('TEXT')) return 'bg-green-100 text-green-800';
    if (dataType.includes('DATE') || dataType.includes('TIMESTAMP')) return 'bg-purple-100 text-purple-800';
    if (dataType.includes('BOOLEAN')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`
      bg-white rounded-xl shadow-lg border-2 transition-all duration-200 overflow-hidden
      ${selected ? 'border-blue-500 shadow-xl ring-4 ring-blue-100' : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'}
      min-w-[280px] max-w-[320px]
    `}>
      {/* Entity Header */}
      <div className={`
        px-4 py-3 border-b-2 border-gray-100
        ${selected ? 'bg-gradient-to-r from-blue-50 to-blue-100' : 'bg-gradient-to-r from-gray-50 to-gray-100'}
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`
              p-2 rounded-lg
              ${selected ? 'bg-blue-500' : 'bg-gray-600'}
            `}>
              <Database className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base truncate">{data.name}</h3>
              <p className="text-xs text-gray-500">{data.columns.length} columns</p>
            </div>
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-white/50 rounded transition-colors"
          >
            {isExpanded ? 
              <ChevronUp className="h-4 w-4 text-gray-600" /> : 
              <ChevronDown className="h-4 w-4 text-gray-600" />
            }
          </button>
        </div>
      </div>

      {/* Columns List */}
      <div className={`transition-all duration-200 ${isExpanded ? 'max-h-80' : 'max-h-16'} overflow-hidden`}>
        <div className="p-3 space-y-1 max-h-80 overflow-y-auto">
          {/* Primary Keys */}
          {primaryKeys.map((column) => (
            <div key={column.id} className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200">
              <Key className="h-3 w-3 text-amber-600 flex-shrink-0" />
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="font-semibold text-gray-900 text-sm truncate">{column.name}</span>
                <span className="text-xs font-medium text-amber-700">PK</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${getDataTypeColor(column.dataType)}`}>
                {column.dataType}
              </span>
            </div>
          ))}

          {/* Foreign Keys */}
          {foreignKeys.map((column) => (
            <div key={column.id} className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 border border-blue-200">
              <Key className="h-3 w-3 text-blue-600 flex-shrink-0" />
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="font-medium text-gray-900 text-sm truncate">{column.name}</span>
                <span className="text-xs font-medium text-blue-700">FK</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${getDataTypeColor(column.dataType)}`}>
                {column.dataType}
              </span>
            </div>
          ))}

          {/* Regular Columns */}
          {(isExpanded ? regularColumns : regularColumns.slice(0, 2)).map((column) => (
            <div key={column.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-3 h-3 flex-shrink-0" /> {/* Spacer for alignment */}
              <span className="font-medium text-gray-700 text-sm truncate flex-1">{column.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${getDataTypeColor(column.dataType)}`}>
                {column.dataType}
              </span>
            </div>
          ))}

          {!isExpanded && regularColumns.length > 2 && (
            <div className="text-center py-2 text-xs text-gray-500">
              +{regularColumns.length - 2} more columns
            </div>
          )}

          {data.columns.length === 0 && (
            <div className="text-center py-6 text-gray-500 text-sm">
              No columns defined
            </div>
          )}
        </div>
      </div>

      {/* Connection Handles */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white shadow-md"
        style={{ right: -6 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white shadow-md"
        style={{ left: -6 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2 border-white shadow-md"
        style={{ bottom: -6 }}
      />
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white shadow-md"
        style={{ top: -6 }}
      />
    </div>
  );
};

export default memo(EntityCard);
