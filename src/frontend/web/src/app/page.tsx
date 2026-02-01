'use client';

import { useState } from 'react';
import { AnalyzerForm } from '@/components/analyzer/analyzer-form';
import { RiskScore } from '@/components/results/risk-score';
import { ViolationList } from '@/components/results/violation-list';
import { SuggestionsPanel } from '@/components/analyzer/suggestions-panel';
import { FeedbackModal } from '@/components/feedback/feedback-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalysisResult } from '@/lib/types';
import { HistoryChart } from '@/components/dashboard/history-chart';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { useAnalyzer } from '@/hooks/useAnalyzer';
import { Download, Share2, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function HomePage() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState('analyze');
  
  const { recentResults, clearResults } = useAnalyzer();

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setActiveTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportResults = () => {
    if (!analysisResult) return;
    
    const dataStr = JSON.stringify(analysisResult, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `pre-post-analysis-${analysisResult.id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Results exported successfully!');
  };

  const handleShareResults = async () => {
    if (!analysisResult) return;
    
    const shareData = {
      title: 'Pre-Post Analysis Results',
      text: `My content got a ${analysisResult.risk_level} risk score on ${analysisResult.platform}`,
      url: window.location.href,
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setActiveTab('analyze');
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Post with <span className="text-primary">Confidence</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          AI-powered content analysis to prevent violations, avoid bans, and maximize your social media reach.
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analyze">Analyze</TabsTrigger>
          <TabsTrigger value="results" disabled={!analysisResult}>
            Results
          </TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>

        {/* Analyze Tab */}
        <TabsContent value="analyze">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnalyzerForm 
                onAnalysisComplete={handleAnalysisComplete}
                initialPlatform="instagram"
              />
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Why Use This Tool?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">🚫 Avoid Account Bans</h3>
                    <p className="text-sm text-muted-foreground">
                      Detect policy violations before you post
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">📈 Maximize Reach</h3>
                    <p className="text-sm text-muted-foreground">
                      Identify content that gets limited distribution
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">💡 Get Suggestions</h3>
                    <p className="text-sm text-muted-foreground">
                      AI-powered rewrites to improve your content
                    </p>
                  </div>
                </CardContent>
              </Card>

              {recentResults.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Analyses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentResults.slice(0, 3).map((result) => (
                        <div 
                          key={result.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                          onClick={() => {
                            setAnalysisResult(result);
                            setActiveTab('results');
                          }}
                        >
                          <div>
                            <div className="font-medium capitalize">{result.platform}</div>
                            <div className="text-sm text-muted-foreground truncate">
                              {result.analyzed_at}
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            result.risk_level === 'low' ? 'bg-risk-low/20 text-risk-low' :
                            result.risk_level === 'medium' ? 'bg-risk-medium/20 text-risk-medium' :
                            'bg-risk-high/20 text-risk-high'
                          }`}>
                            {result.risk_score}/100
                          </div>
                        </div>
                      ))}
                      {recentResults.length > 3 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full"
                          onClick={() => setActiveTab('dashboard')}
                        >
                          View all {recentResults.length} analyses
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results">
          {analysisResult && (
            <div className="space-y-6">
              {/* Action Bar */}
              <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <span className="font-medium">
                    Analysis completed for {analysisResult.platform}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportResults}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShareResults}
                    className="gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNewAnalysis}
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    New Analysis
                  </Button>
                </div>
              </div>

              {/* Results Grid */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <RiskScore result={analysisResult} showDetailed />
                </div>
                
                <div className="lg:col-span-2 space-y-6">
                  <ViolationList violations={analysisResult.violations} />
                  
                  {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                    <SuggestionsPanel 
                      suggestions={analysisResult.suggestions}
                      violations={analysisResult.violations}
                      platform={analysisResult.platform}
                    />
                  )}
                </div>
              </div>

              {/* Feedback Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Help Improve Our Models</CardTitle>
                  <CardDescription>
                    Report what actually happened when you posted this content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setShowFeedback(true)}>
                    Report Posting Outcome
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <div className="space-y-6">
            <StatsCards results={recentResults} />
            <HistoryChart results={recentResults} />
            
            {recentResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Analysis History</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearResults}
                    >
                      Clear History
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentResults.map((result) => (
                      <div 
                        key={result.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                        onClick={() => {
                          setAnalysisResult(result);
                          setActiveTab('results');
                        }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-medium capitalize">{result.platform}</span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(result.analyzed_at).toLocaleDateString()}
                            </span>
                          </div>
                          {result.text && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {result.text.substring(0, 200)}...
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className={`text-lg font-bold ${
                              result.risk_level === 'low' ? 'text-risk-low' :
                              result.risk_level === 'medium' ? 'text-risk-medium' :
                              'text-risk-high'
                            }`}>
                              {result.risk_score}
                            </div>
                            <div className="text-xs text-muted-foreground">Risk Score</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">
                              {result.violations.length}
                            </div>
                            <div className="text-xs text-muted-foreground">Issues</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Feedback Modal */}
      {showFeedback && analysisResult && (
        <FeedbackModal
          analysisId={analysisResult.id}
          onClose={() => setShowFeedback(false)}
        />
      )}
    </div>
  );
}