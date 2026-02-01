import { useState, useCallback } from 'react';
import { AnalysisResult, PostContent } from '@/lib/types';
import { analyzeContent } from '@/services/api/analyzer';
import { useLocalStorage } from './useLocalStorage';
import { toast } from 'react-hot-toast';

interface UseAnalyzerReturn {
  analyze: (content: FormData | PostContent) => Promise<AnalysisResult>;
  isAnalyzing: boolean;
  error: Error | null;
  recentResults: AnalysisResult[];
  clearResults: () => void;
  saveResult: (result: AnalysisResult) => void;
}

export function useAnalyzer(): UseAnalyzerReturn {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [recentResults, setRecentResults] = useLocalStorage<AnalysisResult[]>('recent-results', []);

  const analyze = useCallback(async (content: FormData | PostContent): Promise<AnalysisResult> => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await analyzeContent(content);
      
      // Save to recent results (limit to 50)
      setRecentResults(prev => [result, ...prev.slice(0, 49)]);
      
      toast.success('Analysis complete!', {
        icon: '✅',
        duration: 3000,
      });
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Analysis failed');
      setError(error);
      
      toast.error('Analysis failed. Please try again.', {
        duration: 5000,
      });
      
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, [setRecentResults]);

  const clearResults = useCallback(() => {
    setRecentResults([]);
  }, [setRecentResults]);

  const saveResult = useCallback((result: AnalysisResult) => {
    setRecentResults(prev => [result, ...prev]);
  }, [setRecentResults]);

  return {
    analyze,
    isAnalyzing,
    error,
    recentResults,
    clearResults,
    saveResult,
  };
}