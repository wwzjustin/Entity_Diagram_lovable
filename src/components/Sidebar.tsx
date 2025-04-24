
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  Database,
  FileCode,
  Upload,
  PlusCircle,
  Trash2,
  Link,
  Unlink,
  Key,
  Share2,
  Download,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface SidebarProps {
  selectedEntity: string | null;
}

const DATA_TYPES = [
  "INTEGER",
  "BIGINT",
  "FLOAT",
  "DOUBLE",
  "DECIMAL",
  "NUMERIC",
  "VARCHAR(255)",
  "TEXT",
  "CHAR",
  "DATE",
  "TIMESTAMP",
  "TIME",
  "BOOLEAN",
  "JSON",
  "JSONB",
  "UUID",
];

const RELATION_TYPES = [
  { value: "one-to-one", label: "One-to-One (1:1)" },
  { value: "one-to-many", label: "One-to-Many (1:N)" },
  { value: "many-to-many", label: "Many-to-Many (N:M)" },
];

const Sidebar = ({ selectedEntity }: SidebarProps) => {
  const [entityName, setEntityName] = useState("Entity Name");
  const [columns, setColumns] = useState<any[]>([
    { id: 1, name: "id", type: "INTEGER", isPrimaryKey: true },
    { id: 2, name: "name", type: "VARCHAR(255)" },
    { id: 3, name: "created_at", type: "TIMESTAMP" },
  ]);

  const addColumn = () => {
    const newColumn = { 
      id: Date.now(), 
      name: "new_column", 
      type: "VARCHAR(255)",
      isPrimaryKey: false,
      isForeignKey: false,
    };
    setColumns([...columns, newColumn]);
  };

  const removeColumn = (id: number) => {
    setColumns(columns.filter((c) => c.id !== id));
  };

  const updateColumn = (id: number, field: string, value: string | boolean) => {
    setColumns(
      columns.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  return (
    <div className="w-80 border-r overflow-y-auto h-full bg-white p-4">
      <Tabs defaultValue="entity" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="entity">Entity</TabsTrigger>
          <TabsTrigger value="relationship">Relationship</TabsTrigger>
          <TabsTrigger value="import">Import/Export</TabsTrigger>
        </TabsList>

        <TabsContent value="entity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                {selectedEntity ? "Edit Entity" : "New Entity"}
              </CardTitle>
              <CardDescription>
                {selectedEntity
                  ? "Modify the selected entity's properties"
                  : "Define a new entity for your diagram"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Entity Name</label>
                  <Input
                    placeholder="Enter entity name"
                    value={entityName}
                    onChange={(e) => setEntityName(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Columns</label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addColumn}
                      className="flex items-center gap-1"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Add
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {columns.map((column) => (
                      <div key={column.id} className="flex gap-2 items-start">
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="Column name"
                            value={column.name}
                            onChange={(e) => updateColumn(column.id, "name", e.target.value)}
                            className="w-full text-sm"
                          />
                          <Select
                            defaultValue={column.type}
                            onValueChange={(value) => updateColumn(column.id, "type", value)}
                          >
                            <SelectTrigger className="w-full text-sm">
                              <SelectValue placeholder="Data type" />
                            </SelectTrigger>
                            <SelectContent>
                              {DATA_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col gap-2 pt-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`w-6 h-6 ${column.isPrimaryKey ? "text-blue-600" : ""}`}
                            onClick={() => updateColumn(column.id, "isPrimaryKey", !column.isPrimaryKey)}
                            title={column.isPrimaryKey ? "Remove primary key" : "Set as primary key"}
                          >
                            <Key className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-6 h-6"
                            onClick={() => removeColumn(column.id)}
                            title="Remove column"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full">
                  {selectedEntity ? "Update Entity" : "Create Entity"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relationship">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Manage Relationships
              </CardTitle>
              <CardDescription>
                Define relationships between entities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Source Entity</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select entity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entity1">Users</SelectItem>
                      <SelectItem value="entity2">Orders</SelectItem>
                      <SelectItem value="entity3">Products</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Relationship Type</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select relationship type" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Target Entity</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select entity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entity1">Users</SelectItem>
                      <SelectItem value="entity2">Orders</SelectItem>
                      <SelectItem value="entity3">Products</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 flex items-center gap-1">
                    <Link className="h-4 w-4" />
                    Create
                  </Button>
                  <Button variant="outline" className="flex-1 flex items-center gap-1">
                    <Unlink className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                Import/Export
              </CardTitle>
              <CardDescription>
                Import from files or export your diagram
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1 block">Import Schema</p>
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drag & drop a SQL file or click to browse
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept=".sql,.json"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" size="sm" className="mt-4">
                        Browse Files
                      </Button>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Export Options</p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      SQL
                    </Button>
                    <Button variant="outline" className="flex-1 flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      PNG
                    </Button>
                    <Button variant="outline" className="flex-1 flex items-center gap-1">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sidebar;
