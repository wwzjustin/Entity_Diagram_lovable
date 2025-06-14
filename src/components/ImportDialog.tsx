
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Upload, FileText, Table, Sparkles } from "lucide-react";
import { Entity } from "@/types/Entity";
import { parseSQLScript, parseExcelData } from "@/utils/importParsers";
import { generateAIRecommendations } from "@/utils/aiRecommendations";

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEntitiesImported: (entities: Entity[]) => void;
}

const ImportDialog = ({ isOpen, onClose, onEntitiesImported }: ImportDialogProps) => {
  const [sqlScript, setSqlScript] = useState("");
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importedEntities, setImportedEntities] = useState<Entity[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<string>("");

  const handleSQLImport = async () => {
    if (!sqlScript.trim()) return;
    
    setIsProcessing(true);
    try {
      const entities = parseSQLScript(sqlScript);
      setImportedEntities(entities);
      const aiRecs = await generateAIRecommendations(entities);
      setRecommendations(aiRecs);
      setShowRecommendations(true);
    } catch (error) {
      console.error("Error parsing SQL:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExcelImport = async () => {
    if (!excelFile) return;
    
    setIsProcessing(true);
    try {
      const entities = await parseExcelData(excelFile);
      setImportedEntities(entities);
      const aiRecs = await generateAIRecommendations(entities);
      setRecommendations(aiRecs);
      setShowRecommendations(true);
    } catch (error) {
      console.error("Error parsing Excel:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = () => {
    onEntitiesImported(importedEntities);
    handleClose();
  };

  const handleClose = () => {
    setSqlScript("");
    setExcelFile(null);
    setImportedEntities([]);
    setShowRecommendations(false);
    setRecommendations("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Entities
          </DialogTitle>
        </DialogHeader>

        {!showRecommendations ? (
          <Tabs defaultValue="sql" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sql" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                SQL Script
              </TabsTrigger>
              <TabsTrigger value="excel" className="flex items-center gap-2">
                <Table className="h-4 w-4" />
                Excel Sheet
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sql" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Paste your SQL CREATE TABLE statements:
                </label>
                <Textarea
                  value={sqlScript}
                  onChange={(e) => setSqlScript(e.target.value)}
                  placeholder="CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total DECIMAL(10,2),
  order_date DATE
);"
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>
              <Button 
                onClick={handleSQLImport} 
                disabled={!sqlScript.trim() || isProcessing}
                className="w-full"
              >
                {isProcessing ? "Processing..." : "Import from SQL"}
              </Button>
            </TabsContent>

            <TabsContent value="excel" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Upload Excel file with entity definitions:
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="excel-upload"
                  />
                  <label htmlFor="excel-upload" className="cursor-pointer">
                    <Table className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {excelFile ? excelFile.name : "Click to upload Excel file"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Supports .xlsx, .xls, .csv files
                    </p>
                  </label>
                </div>
              </div>
              <Button 
                onClick={handleExcelImport} 
                disabled={!excelFile || isProcessing}
                className="w-full"
              >
                {isProcessing ? "Processing..." : "Import from Excel"}
              </Button>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">AI Recommendations</h3>
              </div>
              <div className="text-sm text-blue-800 whitespace-pre-wrap">
                {recommendations}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Imported Entities ({importedEntities.length})</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {importedEntities.map((entity) => (
                  <div key={entity.id} className="border rounded p-3 bg-gray-50">
                    <h4 className="font-medium">{entity.name}</h4>
                    <p className="text-sm text-gray-600">
                      {entity.columns.length} columns
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleConfirmImport} className="flex-1">
                Import All Entities
              </Button>
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImportDialog;
