"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from '@supabase/ssr';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Show welcome screen for 2 seconds for better UX and testing
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false);
    }, 2000);

    const checkAuthAndRedirect = async () => {
      try {
        // Wait for welcome screen
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Use environment variables for the new Supabase project
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nnxfzhxqzmriggulsudr.supabase.co';
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ueGZ6aHhxem1yaWdndWxzdWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNjg3NjgsImV4cCI6MjA2NzY0NDc2OH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
        
        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          console.error('Auth check error:', error);
          // Redirect to login on error
          router.replace("/auth/signin");
          return;
        }

        if (user) {
          // User is authenticated, redirect to dashboard
          router.replace("/dashboard");
        } else {
          // User is not authenticated, redirect to login
          router.replace("/auth/signin");
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Redirect to login on any error
        router.replace("/auth/signin");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndRedirect();

    return () => {
      clearTimeout(welcomeTimer);
    };
  }, [router]);

  // Show welcome/loading state
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <span className="text-3xl font-bold text-white">eW</span>
        </div>
        
        {showWelcome ? (
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">eWasl</h1>
            <p className="text-xl text-gray-700 mb-2">منصة إدارة وسائل التواصل الاجتماعي</p>
            <p className="text-lg text-gray-600 mb-6">Social Media Management Platform</p>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>
        ) : (
          <div className="animate-pulse">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">eWasl</h2>
            <p className="text-gray-600 mt-2">جاري التحقق من المصادقة...</p>
            <p className="text-sm text-gray-500 mt-1">🔐 Authentication Required</p>
          </div>
        )}
      </div>
    </div>
  );
}