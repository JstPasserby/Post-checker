import { useState, useEffect, useCallback } from 'react';
import { PlatformRule, Platform } from '@/lib/types';
import { fetchPlatformRules } from '@/services/api/rules';
import { useQuery } from 'react-query';

interface UsePlatformRulesReturn {
  rules: PlatformRule[];
  isLoading: boolean;
  error: Error | null;
  getRuleById: (id: string) => PlatformRule | undefined;
  getRulesByPlatform: (platform: Platform) => PlatformRule[];
  refreshRules: () => Promise<void>;
}

export function usePlatformRules(): UsePlatformRulesReturn {
  const [localRules, setLocalRules] = useState<PlatformRule[]>([]);
  
  const {
    data: rules,
    isLoading,
    error,
    refetch,
  } = useQuery<PlatformRule[]>(
    'platform-rules',
    async () => {
      const fetchedRules = await fetchPlatformRules();
      // Cache in localStorage for offline use
      localStorage.setItem('platform-rules-cache', JSON.stringify({
        data: fetchedRules,
        timestamp: Date.now(),
      }));
      return fetchedRules;
    },
    {
      staleTime: 1000 * 60 * 60, // 1 hour
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      initialData: () => {
        // Try to load from cache
        const cache = localStorage.getItem('platform-rules-cache');
        if (cache) {
          const { data, timestamp } = JSON.parse(cache);
          // Use cache if less than 1 day old
          if (Date.now() - timestamp < 1000 * 60 * 60 * 24) {
            return data;
          }
        }
        return undefined;
      },
    }
  );

  useEffect(() => {
    if (rules) {
      setLocalRules(rules);
    }
  }, [rules]);

  const getRuleById = useCallback((id: string) => {
    return localRules.find(rule => rule.id === id);
  }, [localRules]);

  const getRulesByPlatform = useCallback((platform: Platform) => {
    return localRules.filter(rule => rule.platform === platform);
  }, [localRules]);

  const refreshRules = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    rules: localRules,
    isLoading,
    error,
    getRuleById,
    getRulesByPlatform,
    refreshRules,
  };
}