"use client";

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
  };
  created_at: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  });

  useEffect(() => {
    // Simulate authentication check
    const checkAuth = async () => {
      try {
        // For demo purposes, create a mock user
        const mockUser: User = {
          id: 'mock-user-id',
          email: 'user@ewasl.com',
          user_metadata: {
            full_name: 'مستخدم eWasl',
            name: 'eWasl User',
            avatar_url: '/api/placeholder/40/40'
          },
          created_at: new Date().toISOString()
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        setAuthState({
          user: mockUser,
          isLoading: false,
          isAuthenticated: true
        });
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false
        });
      }
    };

    checkAuth();
  }, []);

  return authState;
}