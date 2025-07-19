"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">eW</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            لوحة التحكم
          </h1>
          <p className="text-gray-600 mt-2">Dashboard</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">المنشورات</h3>
            <p className="text-3xl font-bold text-blue-600">
              {loading ? "..." : metrics?.data?.system?.totalPosts || 0}
            </p>
            <p className="text-sm text-gray-500">Total Posts</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">الحسابات</h3>
            <p className="text-3xl font-bold text-green-600">
              {loading ? "..." : metrics?.data?.system?.totalAccounts || 0}
            </p>
            <p className="text-sm text-gray-500">Social Accounts</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">المجدولة</h3>
            <p className="text-3xl font-bold text-purple-600">
              {loading ? "..." : metrics?.data?.system?.scheduledPosts || 0}
            </p>
            <p className="text-sm text-gray-500">Scheduled Posts</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">المكتملة</h3>
            <p className="text-3xl font-bold text-orange-600">
              {loading ? "..." : metrics?.data?.system?.completedPosts || 0}
            </p>
            <p className="text-sm text-gray-500">Completed Posts</p>
          </div>
        </div>

        {/* API Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">حالة النظام</h2>
          <p className="text-gray-600 mb-4">System Status</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">قاعدة البيانات / Database</span>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">API المقاييس / Metrics API</span>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">اختبار المرحلة 1 / Phase 1 Test</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">روابط سريعة</h2>
          <p className="text-gray-600 mb-4">Quick Links</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/api/test-phase1" 
              target="_blank"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-blue-600">اختبار المرحلة 1</h3>
              <p className="text-sm text-gray-500">Phase 1 Test API</p>
            </a>
            
            <a 
              href="/api/metrics" 
              target="_blank"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-green-600">مقاييس النظام</h3>
              <p className="text-sm text-gray-500">System Metrics API</p>
            </a>
            
            <a 
              href="/api/oauth/instagram/refresh-token" 
              target="_blank"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-purple-600">تحديث الرموز</h3>
              <p className="text-sm text-gray-500">Token Refresh API</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}