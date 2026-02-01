'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, Shield } from 'lucide-react';
import { RiskLevel, AnalysisResult } from '@/lib/types';
import { RISK_LEVELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface RiskScoreProps {
  result: AnalysisResult;
  showDetailed?: boolean;
  className?: string;
}

export function RiskScore({ result, showDetailed = true, className }: RiskScoreProps) {
  const riskConfig = RISK_LEVELS[result.risk_level];
  
  const getRiskIcon = () => {
    switch (result.risk_level) {
      case 'low':
        return <CheckCircle className="h-6 w-6 text-risk-low" />;
      case 'medium':
        return <AlertTriangle className="h-6 w-6 text-risk-medium" />;
      case 'high':
        return <XCircle className="h-6 w-6 text-risk-high" />;
      case 'critical':
        return <Shield className="h-6 w-6 text-risk-critical" />;
    }
  };

  const getRecommendation = () => {
    switch (result.risk_level) {
      case 'low':
        return '✅ Safe to post! Your content complies with platform guidelines.';
      case 'medium':
        return '⚠️ Consider reviewing. Some elements might trigger reduced reach.';
      case 'high':
        return '🚨 High risk of removal. Significant changes recommended.';
      case 'critical':
        return '⛔ Do not post. This content violates platform rules and may result in account suspension.';
    }
  };

  return (
    <Card className={cn("border-l-4", `border-l-${riskConfig.color.replace('#', '')}`, className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getRiskIcon()}
            <span>Risk Analysis</span>
          </div>
          <Badge 
            variant="outline" 
            className={cn("text-sm font-semibold", riskConfig.bgColor, `text-${riskConfig.color.replace('#', '')}`)}
          >
            {riskConfig.label} {riskConfig.emoji}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Risk Score</span>
            <span className="font-semibold">{result.risk_score}/100</span>
          </div>
          <Progress 
            value={result.risk_score} 
            className="h-3"
            indicatorClassName={cn({
              'bg-risk-low': result.risk_level === 'low',
              'bg-risk-medium': result.risk_level === 'medium',
              'bg-risk-high': result.risk_level === 'high',
              'bg-risk-critical': result.risk_level === 'critical',
            })}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low Risk</span>
            <span>Critical Risk</span>
          </div>
        </div>

        {/* Recommendation */}
        <div className={cn("p-4 rounded-lg", riskConfig.bgColor)}>
          <p className="font-medium mb-1">Recommendation:</p>
          <p className="text-sm">{getRecommendation()}</p>
        </div>

        {/* Confidence */}
        {showDetailed && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Analysis Confidence</span>
              <span className="font-semibold">{Math.round(result.confidence * 100)}%</span>
            </div>
            <Progress value={result.confidence * 100} className="h-2" />
          </div>
        )}

        {/* Platform Info */}
        {showDetailed && (
          <div className="text-sm space-y-1">
            <p className="text-muted-foreground">Platform:</p>
            <div className="flex items-center gap-2">
              <span className="font-semibold capitalize">{result.platform}</span>
              <Badge variant="outline" className="text-xs">
                Analyzed {new Date(result.analyzed_at).toLocaleTimeString()}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}