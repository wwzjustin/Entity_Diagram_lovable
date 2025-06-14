
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Sparkles, Wand2, RefreshCw, CheckCircle } from "lucide-react";
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
    <Card className="w-96 max-h-[80vh] overflow-y-auto shadow-lg border-purple-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Sparkles className="h-5 w-5" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-sm text-purple-800 whitespace-pre-wrap">
            {recommendations}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleApplyRecommendations}
            disabled={isApplying}
            className="flex-1 gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {isApplying ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Applying...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Apply Changes
              </>
            )}
          </Button>
          <Button
            onClick={() => {
              setShowRecommendations(false);
              setRecommendations("");
            }}
            variant="outline"
            className="flex-1"
          >
            Close
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          <CheckCircle className="h-3 w-3 inline mr-1" />
          Applying recommendations will automatically restructure your entities based on dimensional modeling best practices.
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendationPanel;
