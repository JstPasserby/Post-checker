import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRiskScore(score: number): string {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 30) return 'Medium';
  return 'Low';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    instagram: '📸',
    tiktok: '🎵',
    youtube: '📺',
    twitter: '🐦',
    facebook: '👤',
    linkedin: '💼',
  };
  return icons[platform] || '🌐';
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function calculateConfidence(violations: any[]): number {
  if (violations.length === 0) return 1.0;
  
  const totalConfidence = violations.reduce((sum, violation) => {
    return sum + (violation.confidence || 0.5);
  }, 0);
  
  return Math.min(totalConfidence / violations.length, 1.0);
}

export function generateAnalysisId(): string {
  return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSizeMB = 10;
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `Image must be less than ${maxSizeMB}MB` };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Image must be JPEG, PNG, GIF, or WebP' };
  }
  
  return { valid: true };
}

export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  const maxSizeMB = 100;
  const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
  
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `Video must be less than ${maxSizeMB}MB` };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Video must be MP4, MOV, or AVI' };
  }
  
  return { valid: true };
}