'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertTriangle, FileText, Image, Video, Volume2 } from 'lucide-react';
import { Violation, ViolationType } from '@/lib/types';
import { VIOLATION_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ViolationListProps {
  violations: Violation[];
  className?: string;
}

const SourceIcon = {
  text: FileText,
  image: Image,
  video: Video,
  audio: Volume2,
};

export function ViolationList({ violations, className }: ViolationListProps) {
  if (violations.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-success">
            <AlertTriangle className="h-5 w-5" />
            No Violations Detected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Great! No obvious policy violations were found in your content.
          </p>
        </CardContent>
      </Card>
    );
  }

  const groupedViolations = violations.reduce((acc, violation) => {
    if (!acc[violation.type]) {
      acc[violation.type] = [];
    }
    acc[violation.type].push(violation);
    return acc;
  }, {} as Record<ViolationType, Violation[]>);

  const sortedViolationTypes = Object.keys(groupedViolations).sort((a, b) => {
    const avgConfidenceA = groupedViolations[a].reduce((sum, v) => sum + v.confidence, 0) / groupedViolations[a].length;
    const avgConfidenceB = groupedViolations[b].reduce((sum, v) => sum + v.confidence, 0) / groupedViolations[b].length;
    return avgConfidenceB - avgConfidenceA;
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Detected Violations ({violations.length})
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Accordion type="multiple" className="space-y-4">
          {sortedViolationTypes.map((type) => {
            const violationType = VIOLATION_TYPES[type];
            const typeViolations = groupedViolations[type];
            const avgConfidence = typeViolations.reduce((sum, v) => sum + v.confidence, 0) / typeViolations.length;

            return (
              <AccordionItem key={type} value={type} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: violationType.color }}
                      />
                      <div className="text-left">
                        <div className="font-medium">{violationType.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {typeViolations.length} issue{typeViolations.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline"
                        className={cn("font-medium", {
                          'bg-red-50 text-red-700 border-red-200': avgConfidence > 0.8,
                          'bg-orange-50 text-orange-700 border-orange-200': avgConfidence > 0.5,
                          'bg-yellow-50 text-yellow-700 border-yellow-200': avgConfidence <= 0.5,
                        })}
                      >
                        {Math.round(avgConfidence * 100)}% confidence
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent>
                  <div className="space-y-4 pt-4 pb-2">
                    <p className="text-sm text-muted-foreground">
                      {violationType.description}
                    </p>
                    
                    {typeViolations.map((violation, index) => {
                      const SourceIconComponent = SourceIcon[violation.source];
                      
                      return (
                        <div key={index} className="border-l-2 pl-4 py-2" style={{ borderColor: violationType.color }}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <SourceIconComponent className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium capitalize">{violation.source}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round(violation.confidence * 100)}% sure
                            </Badge>
                          </div>
                          
                          {violation.highlighted_text && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-2">
                              <p className="text-sm">
                                <span className="font-medium">Problematic text: </span>
                                <span dangerouslySetInnerHTML={{ __html: violation.highlighted_text }} />
                              </p>
                            </div>
                          )}
                          
                          {violation.description && (
                            <p className="text-sm mb-2">{violation.description}</p>
                          )}
                          
                          {violation.suggestion && (
                            <div className="bg-green-50 border border-green-200 rounded p-3">
                              <p className="text-sm font-medium text-green-800 mb-1">💡 Suggestion:</p>
                              <p className="text-sm text-green-700">{violation.suggestion}</p>
                            </div>
                          )}
                          
                          {violation.platform_specific_rule && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              <span className="font-medium">Platform rule: </span>
                              {violation.platform_specific_rule}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}