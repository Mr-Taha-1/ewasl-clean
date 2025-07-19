"use client";

import { useState } from "react";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    // For now, just show a message that this is a demo
    alert("تسجيل الدخول قيد التطوير - Sign in under development");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">eW</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            eWasl
          </h1>
          <p className="text-gray-600 mt-2">تسجيل الدخول إلى حسابك</p>
          <p className="text-sm text-gray-500">Sign in to your account</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني / Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور / Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              dir="ltr"
            />
          </div>

          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                جاري تسجيل الدخول...
              </div>
            ) : (
              "تسجيل الدخول / Sign In"
            )}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            🚧 هذه صفحة تجريبية - Demo page under development
          </p>
          <p className="text-xs text-gray-500 mt-2">
            API endpoints are working: /api/test-phase1, /api/metrics
          </p>
        </div>
      </div>
    </div>
  );
}