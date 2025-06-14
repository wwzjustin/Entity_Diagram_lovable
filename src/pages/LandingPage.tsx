
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  Database, 
  Zap, 
  Users, 
  ArrowRight, 
  Check,
  Lightbulb,
  Layout,
  Share2
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Database className="h-8 w-8 text-blue-600" />,
      title: "Visual ERD Designer",
      description: "Create beautiful entity relationship diagrams with our intuitive drag-and-drop interface."
    },
    {
      icon: <Sparkles className="h-8 w-8 text-purple-600" />,
      title: "AI-Powered Recommendations",
      description: "Get intelligent suggestions for dimensional modeling, normalization, and database optimization."
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Auto Layout & Organization",
      description: "Automatically arrange your entities for optimal visibility and relationship clarity."
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Collaboration Ready",
      description: "Share your diagrams and collaborate with your team in real-time."
    }
  ];

  const aiFeatures = [
    "Analyzes your schema for optimization opportunities",
    "Suggests dimensional modeling best practices",
    "Identifies missing relationships and foreign keys",
    "Recommends proper normalization strategies",
    "Generates performance optimization suggestions",
    "Creates missing dimension tables automatically"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Database className="h-12 w-12 text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ERD Tool
            </h1>
          </div>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create professional Entity Relationship Diagrams with the power of AI. 
            Design, optimize, and collaborate on your database schemas like never before.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-3 text-lg border-blue-300 hover:bg-blue-50"
            >
              View Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Features Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-20 border border-purple-100">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900">AI-Powered Intelligence</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI analyzes your database schema and provides intelligent recommendations 
              to improve structure, performance, and maintainability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-yellow-600" />
                What Our AI Does
              </h3>
              <div className="space-y-3">
                {aiFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Layout className="h-6 w-6 text-blue-600" />
                Smart Recommendations
              </h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-purple-900 mb-2">Dimensional Modeling</h4>
                  <p className="text-sm text-gray-600">
                    Automatically identify fact and dimension tables, suggest star schema improvements.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-purple-900 mb-2">Relationship Analysis</h4>
                  <p className="text-sm text-gray-600">
                    Detect missing foreign keys and suggest proper relationship mappings.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-purple-900 mb-2">Performance Optimization</h4>
                  <p className="text-sm text-gray-600">
                    Recommend indexing strategies and normalization improvements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Design Better Databases?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers who trust ERD Tool for their database design needs.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/dashboard')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Start Creating
              <Database className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
            >
              <Share2 className="mr-2 h-5 w-5" />
              Share with Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
