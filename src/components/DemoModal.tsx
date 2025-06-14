
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { 
  X, 
  Database, 
  Sparkles, 
  Wand2, 
  CheckCircle, 
  ArrowRight,
  Play,
  Pause
} from "lucide-react";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoModal = ({ isOpen, onClose }: DemoModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  const demoSteps = [
    {
      title: "Start with Your Database Schema",
      description: "Upload your existing database schema or create entities manually",
      visual: "schema",
      duration: 3000
    },
    {
      title: "AI Analyzes Your Structure",
      description: "Our AI examines relationships, naming patterns, and data types",
      visual: "analysis",
      duration: 4000
    },
    {
      title: "Smart Recommendations Generated",
      description: "Get suggestions for dimensional modeling, normalization, and optimization",
      visual: "recommendations",
      duration: 4000
    },
    {
      title: "Apply Changes Instantly",
      description: "One-click application of AI recommendations to improve your schema",
      visual: "apply",
      duration: 3000
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && isOpen) {
      interval = setInterval(() => {
        setAnimationProgress(prev => {
          const newProgress = prev + 100;
          const currentStepDuration = demoSteps[currentStep]?.duration || 3000;
          
          if (newProgress >= currentStepDuration) {
            setCurrentStep(prevStep => {
              const nextStep = prevStep + 1;
              if (nextStep >= demoSteps.length) {
                setIsPlaying(false);
                return 0;
              }
              return nextStep;
            });
            return 0;
          }
          return newProgress;
        });
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, isOpen]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setAnimationProgress(0);
    setIsPlaying(false);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setAnimationProgress(0);
    setIsPlaying(false);
  };

  const renderVisual = (visual: string) => {
    const progressPercent = Math.min((animationProgress / (demoSteps[currentStep]?.duration || 3000)) * 100, 100);
    
    switch (visual) {
      case "schema":
        return (
          <div className="relative bg-gray-50 rounded-lg p-6 h-64 overflow-hidden">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i}
                  className={`bg-white border-2 border-blue-300 rounded-lg p-3 transition-all duration-500 ${
                    progressPercent > i * 20 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                  style={{ transitionDelay: `${i * 200}ms` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Table {i}</span>
                  </div>
                  <div className="space-y-1">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-2 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case "analysis":
        return (
          <div className="relative bg-gray-50 rounded-lg p-6 h-64 flex items-center justify-center">
            <div className="relative">
              <div className={`w-32 h-32 rounded-full border-4 border-purple-300 flex items-center justify-center transition-all duration-1000 ${
                progressPercent > 30 ? 'animate-spin' : ''
              }`}>
                <Sparkles className={`h-12 w-12 text-purple-600 transition-all duration-500 ${
                  progressPercent > 60 ? 'animate-pulse' : ''
                }`} />
              </div>
              {progressPercent > 70 && (
                <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full p-2 animate-bounce">
                  <CheckCircle className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
        );
      
      case "recommendations":
        return (
          <div className="bg-gray-50 rounded-lg p-6 h-64 overflow-hidden">
            <div className="space-y-3">
              {[
                "🔗 Add foreign key relationship: orders.customer_id → customers.id",
                "📊 Create dimension table for product categories",
                "⚡ Add index on orders.created_date for better performance",
                "🔧 Normalize customer address into separate table"
              ].map((rec, i) => (
                <div 
                  key={i}
                  className={`bg-white border border-green-200 rounded-lg p-3 transition-all duration-500 ${
                    progressPercent > i * 25 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: `${i * 300}ms` }}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{rec}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case "apply":
        return (
          <div className="bg-gray-50 rounded-lg p-6 h-64 flex items-center justify-center">
            <div className="text-center">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center mb-4 transition-all duration-1000 ${
                progressPercent > 30 ? 'scale-110' : 'scale-100'
              }`}>
                <Wand2 className={`h-8 w-8 text-white ${progressPercent > 50 ? 'animate-pulse' : ''}`} />
              </div>
              {progressPercent > 70 && (
                <div className="animate-fade-in">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-800">Schema optimized successfully!</p>
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Recommendation Demo
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Step Navigation */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg mb-4">Demo Steps</h3>
            {demoSteps.map((step, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  currentStep === index
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === index ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{step.title}</p>
                    <p className="text-xs text-gray-600">{step.description}</p>
                  </div>
                </div>
                {currentStep === index && isPlaying && (
                  <div className="mt-2 bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full transition-all duration-100"
                      style={{ width: `${Math.min((animationProgress / (step.duration || 3000)) * 100, 100)}%` }}
                    ></div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Visual Demo */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h3 className="font-semibold text-xl mb-2">{demoSteps[currentStep]?.title}</h3>
              <p className="text-gray-600">{demoSteps[currentStep]?.description}</p>
            </div>
            
            {renderVisual(demoSteps[currentStep]?.visual)}

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                onClick={handlePlayPause}
                className="gap-2"
                variant={isPlaying ? "outline" : "default"}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              
              <Button onClick={resetDemo} variant="outline">
                Reset Demo
              </Button>

              <Button 
                onClick={() => window.open('/dashboard', '_blank')}
                className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Try It Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoModal;
