import { AnalysisResult, PostContent } from '@/lib/types';
import { apiClient } from './client';

export interface AnalyzeResponse extends AnalysisResult {}

export interface AnalyzeRequest {
  text?: string;
  platform: string;
  image_url?: string;
  image_base64?: string;
  video_url?: string;
}

export async function analyzeContent(content: FormData | PostContent): Promise<AnalysisResult> {
  try {
    if (content instanceof FormData) {
      const response = await apiClient.upload<AnalyzeResponse>('/analyze', content);
      return response;
    } else {
      const response = await apiClient.post<AnalyzeResponse>('/analyze', content);
      return response;
    }
  } catch (error) {
    console.error('Failed to analyze content:', error);
    throw error;
  }
}

export async function analyzeBatch(contents: PostContent[]): Promise<AnalysisResult[]> {
  const response = await apiClient.post<AnalysisResult[]>('/analyze/batch', { contents });
  return response;
}

export async function getAnalysisHistory(limit: number = 50): Promise<AnalysisResult[]> {
  const response = await apiClient.get<AnalysisResult[]>('/analyze/history', { limit });
  return response;
}