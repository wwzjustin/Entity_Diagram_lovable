
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Sparkles, Wand2, RefreshCw, CheckCircle, X } from "lucide-react";
import { Entity, Column } from "@/types/Entity";
import { generateAIRecommendations } from "@/utils/aiRecommendations";
import { applyAIRecommendations } from "@/utils/aiTransformations";

interface AIRecommendationPanelProps {
  entities: Entity[];
  onEntitiesUpdate: (entities: Entity[]) => void;
  onEntityAdd: (entity: Entity) => void;
}

const AIRecommendationPanel = ({ entities, onEntitiesUpdate, onEntityAdd }: AIRecommendationPanelProps) => {
  const [recommendations, setRecommendations] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const handleGenerateRecommendations = async () => {
    if (entities.length === 0) {
      setRecommendations("No entities found. Please add some entities first to get AI recommendations.");
      setShowRecommendations(true);
      return;
    }

    setIsGenerating(true);
    try {
      const aiRecs = await generateAIRecommendations(entities);
      setRecommendations(aiRecs);
      setShowRecommendations(true);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setRecommendations("Failed to generate recommendations. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyRecommendations = async () => {
    setIsApplying(true);
    try {
      const { updatedEntities, newEntities } = await applyAIRecommendations(entities);
      
      // Update existing entities
      onEntitiesUpdate(updatedEntities);
      
      // Add new entities
      newEntities.forEach(entity => {
        onEntityAdd(entity);
      });

      setShowRecommendations(false);
      setRecommendations("");
    } catch (error) {
      console.error("Error applying recommendations:", error);
    } finally {
      setIsApplying(false);
    }
  };

  if (!showRecommendations) {
    return (
      <Button
        onClick={handleGenerateRecommendations}
        disabled={isGenerating}
        className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        <Sparkles className="h-4 w-4" />
        {isGenerating ? "Analyzing..." : "AI Recommendations"}
      </Button>
    );
  }

  return (
    <div className="fixed top-20 right-4 z-20 w-80 max-h-[calc(100vh-6rem)] bg-white rounded-lg shadow-xl border border-purple-200">
      <div className="flex items-center justify-between p-4 border-b border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900">AI Recommendations</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setShowRecommendations(false);
            setRecommendations("");
          }}
          className="h-8 w-8 p-0 hover:bg-purple-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <div className="text-sm text-purple-800 whitespace-pre-wrap">
            {recommendations}
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleApplyRecommendations}
            disabled={isApplying}
            className="w-full gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {isApplying ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Applying Changes...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Apply Changes
              </>
            )}
          </Button>

          <div className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
            <CheckCircle className="h-3 w-3 mt-0.5 text-green-600 flex-shrink-0" />
            <span>
              Applying recommendations will automatically restructure your entities based on dimensional modeling best practices.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationPanel;
