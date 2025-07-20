"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

interface UseDataCacheOptions {
  cacheTime?: number; // Cache duration in milliseconds
  staleTime?: number; // Time before data is considered stale
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
}

// Simple in-memory cache
const cache = new Map<string, CacheEntry<any>>();

export function useDataCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseDataCacheOptions = {}
) {
  const {
    cacheTime = 5 * 60 * 1000, // 5 minutes
    staleTime = 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus = true,
    refetchInterval
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isStale, setIsStale] = useState(false);
  
  const fetcherRef = useRef(fetcher);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Update fetcher ref when it changes
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const fetchData = useCallback(async (force = false) => {
    const now = Date.now();
    const cached = cache.get(key);

    // Return cached data if it's still valid and not forced
    if (!force && cached && now < cached.expiry) {
      setData(cached.data);
      setIsLoading(false);
      setIsStale(now > cached.timestamp + staleTime);
      return cached.data;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcherRef.current();
      
      // Cache the result
      cache.set(key, {
        data: result,
        timestamp: now,
        expiry: now + cacheTime
      });

      setData(result);
      setIsStale(false);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      
      // Return stale data if available
      if (cached) {
        setData(cached.data);
        setIsStale(true);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [key, cacheTime, staleTime]);

  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  const invalidate = useCallback(() => {
    cache.delete(key);
    return fetchData(true);
  }, [key, fetchData]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refetch on window focus
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      const cached = cache.get(key);
      if (cached && Date.now() > cached.timestamp + staleTime) {
        fetchData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [key, staleTime, refetchOnWindowFocus, fetchData]);

  // Periodic refetch
  useEffect(() => {
    if (!refetchInterval) return;

    intervalRef.current = setInterval(() => {
      fetchData();
    }, refetchInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refetchInterval, fetchData]);

  return {
    data,
    isLoading,
    error,
    isStale,
    refetch,
    invalidate
  };
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const [metrics, setMetrics] = useState({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    mountTime: 0
  });

  const renderStartTime = useRef<number>();
  const renderTimes = useRef<number[]>([]);

  useEffect(() => {
    const mountTime = performance.now();
    setMetrics(prev => ({ ...prev, mountTime }));
  }, []);

  useEffect(() => {
    renderStartTime.current = performance.now();
  });

  useEffect(() => {
    if (renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current;
      renderTimes.current.push(renderTime);
      
      // Keep only last 10 render times
      if (renderTimes.current.length > 10) {
        renderTimes.current.shift();
      }

      const averageRenderTime = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;

      setMetrics(prev => ({
        ...prev,
        renderCount: prev.renderCount + 1,
        lastRenderTime: renderTime,
        averageRenderTime
      }));

      // Log performance warnings
      if (renderTime > 16) { // More than one frame (60fps)
        console.warn(`${componentName}: Slow render detected (${renderTime.toFixed(2)}ms)`);
      }
    }
  });

  return metrics;
}

// Debounced value hook for performance
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Lazy loading hook
export function useLazyLoad(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, hasLoaded]);

  return { elementRef, isVisible, hasLoaded };
}

// Memory usage monitoring
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}

// Clear cache utility
export function clearCache(pattern?: string) {
  if (pattern) {
    const regex = new RegExp(pattern);
    for (const key of cache.keys()) {
      if (regex.test(key)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
}