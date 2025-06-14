import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Database,
  Plus,
  Trash2,
  Key,
  Eye,
  EyeOff,
  Edit3,
  Upload,
} from "lucide-react";
import { Entity, Column } from "@/types/Entity";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import ImportDialog from "./ImportDialog";

interface EntitySidebarProps {
  entities: Entity[];
  selectedEntityId: string | null;
  onEntityUpdate: (entity: Entity) => void;
  onEntityDelete: (entityId: string) => void;
  onEntityAdd: (entity: Entity) => void;
  onEntitySelect: (entityId: string | null) => void;
}

const DATA_TYPES = [
  "INTEGER", "BIGINT", "FLOAT", "DOUBLE", "DECIMAL",
  "VARCHAR(255)", "TEXT", "CHAR", "DATE", "TIMESTAMP",
  "TIME", "BOOLEAN", "JSON", "UUID"
];

const EntitySidebar = ({
  entities,
  selectedEntityId,
  onEntityUpdate,
  onEntityDelete,
  onEntityAdd,
  onEntitySelect,
}: EntitySidebarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const selectedEntity = entities.find(e => e.id === selectedEntityId);

  const handleCreateEntity = () => {
    const newEntity: Entity = {
      id: `entity-${Date.now()}`,
      name: "New Entity",
      columns: [
        {
          id: `col-${Date.now()}`,
          name: "id",
          dataType: "INTEGER",
          isPrimaryKey: true,
        }
      ],
      position: { x: 100, y: 100 },
      visible: true,
    };
    onEntityAdd(newEntity);
    onEntitySelect(newEntity.id);
    setEditingEntity(newEntity);
    setIsEditing(true);
  };

  const handleImportEntities = (importedEntities: Entity[]) => {
    importedEntities.forEach(entity => {
      onEntityAdd(entity);
    });
  };

  const handleEditEntity = (entity: Entity) => {
    setEditingEntity({ ...entity });
    setIsEditing(true);
  };

  const handleSaveEntity = () => {
    if (editingEntity) {
      onEntityUpdate(editingEntity);
      setIsEditing(false);
      setEditingEntity(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingEntity(null);
  };

  const addColumn = () => {
    if (editingEntity) {
      const newColumn: Column = {
        id: `col-${Date.now()}`,
        name: "new_column",
        dataType: "VARCHAR(255)",
      };
      setEditingEntity({
        ...editingEntity,
        columns: [...editingEntity.columns, newColumn],
      });
    }
  };

  const updateColumn = (columnId: string, field: keyof Column, value: any) => {
    if (editingEntity) {
      setEditingEntity({
        ...editingEntity,
        columns: editingEntity.columns.map(col =>
          col.id === columnId ? { ...col, [field]: value } : col
        ),
      });
    }
  };

  const removeColumn = (columnId: string) => {
    if (editingEntity) {
      setEditingEntity({
        ...editingEntity,
        columns: editingEntity.columns.filter(col => col.id !== columnId),
      });
    }
  };

  const toggleEntityVisibility = (entityId: string) => {
    const entity = entities.find(e => e.id === entityId);
    if (entity) {
      onEntityUpdate({ ...entity, visible: !entity.visible });
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Entities</h2>
          <div className="flex gap-2">
            <Button onClick={handleCreateEntity} size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add
            </Button>
            <Button 
              onClick={() => setShowImportDialog(true)} 
              size="sm" 
              variant="outline" 
              className="gap-1"
            >
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </div>
        </div>
      </div>

      {/* Entity List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {entities.map((entity) => (
          <Card 
            key={entity.id} 
            className={`cursor-pointer transition-all ${
              selectedEntityId === entity.id ? 'ring-2 ring-blue-500 border-blue-200' : 'hover:border-gray-300'
            }`}
            onClick={() => onEntitySelect(entity.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  {entity.name}
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleEntityVisibility(entity.id);
                    }}
                  >
                    {entity.visible !== false ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditEntity(entity);
                    }}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEntityDelete(entity.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xs text-gray-500 mb-2">
                {entity.columns.length} column{entity.columns.length !== 1 ? 's' : ''}
              </div>
              <div className="space-y-1">
                {entity.columns.slice(0, 3).map((column) => (
                  <div key={column.id} className="flex items-center gap-1 text-xs">
                    {column.isPrimaryKey && <Key className="h-2 w-2 text-amber-600" />}
                    <span className="text-gray-700">{column.name}</span>
                    <Badge variant="secondary" className="text-xs py-0">
                      {column.dataType}
                    </Badge>
                  </div>
                ))}
                {entity.columns.length > 3 && (
                  <div className="text-xs text-gray-400">
                    +{entity.columns.length - 3} more
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {entities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">No entities yet</p>
            <p className="text-xs text-gray-400">Click "Add" or "Import" to get started</p>
          </div>
        )}
      </div>

      {/* Edit Panel */}
      {isEditing && editingEntity && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Entity Name</label>
              <Input
                value={editingEntity.name}
                onChange={(e) => setEditingEntity({ ...editingEntity, name: e.target.value })}
                placeholder="Enter entity name"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Columns</label>
                <Button size="sm" variant="outline" onClick={addColumn}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {editingEntity.columns.map((column) => (
                  <div key={column.id} className="p-2 bg-white rounded border">
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={column.name}
                        onChange={(e) => updateColumn(column.id, 'name', e.target.value)}
                        placeholder="Column name"
                        className="text-xs"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeColumn(column.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <Select
                      value={column.dataType}
                      onValueChange={(value) => updateColumn(column.id, 'dataType', value)}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DATA_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant={column.isPrimaryKey ? "default" : "outline"}
                        onClick={() => updateColumn(column.id, 'isPrimaryKey', !column.isPrimaryKey)}
                        className="text-xs"
                      >
                        <Key className="h-3 w-3" />
                        PK
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveEntity} size="sm" className="flex-1">
                Save
              </Button>
              <Button onClick={handleCancelEdit} size="sm" variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <ImportDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onEntitiesImported={handleImportEntities}
      />
    </div>
  );
};

export default EntitySidebar;
