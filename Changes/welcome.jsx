import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, CheckSquare, DollarSign, Calendar, ArrowRight, Sparkles } from 'lucide-react';

export default function Welcome() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    base44.auth.redirectToLogin('/Dashboard');
  };

  const handleSignUp = () => {
    setIsLoading(true);
    base44.auth.redirectToLogin('/Dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Tracker Hub
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Hero */}
          <div className="text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 text-orange-400 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              All-in-One Productivity Hub
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Track Your Life,<br />
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Achieve Your Goals
              </span>
            </h2>
            
            <p className="text-xl text-gray-400 max-w-lg">
              Manage habits, tasks, finances, and weekly planning all in one beautiful dashboard
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-orange-500" />
                </div>
                <span>Habit Tracking</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-blue-500" />
                </div>
                <span>Task Manager</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <span>Finance Tracker</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-500" />
                </div>
                <span>Weekly Planner</span>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Card */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md bg-gray-800/50 backdrop-blur-xl border-gray-700">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
                <CardDescription className="text-gray-400">
                  Sign in to continue your journey
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-700/50">
                    <TabsTrigger value="login" className="data-[state=active]:bg-orange-600">
                      Login
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="data-[state=active]:bg-orange-600">
                      Sign Up
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="space-y-6 pt-6">
                    <div className="space-y-4">
                      <p className="text-sm text-gray-400 text-center">
                        Access your personal dashboard to track habits, manage tasks, and monitor your finances.
                      </p>
                      <Button 
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white h-12 text-lg"
                      >
                        {isLoading ? 'Redirecting...' : 'Login'}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="signup" className="space-y-6 pt-6">
                    <div className="space-y-4">
                      <p className="text-sm text-gray-400 text-center">
                        Join thousands of users building better habits and achieving their goals.
                      </p>
                      <Button 
                        onClick={handleSignUp}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white h-12 text-lg"
                      >
                        {isLoading ? 'Redirecting...' : 'Create Account'}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-8 pt-6 border-t border-gray-700">
                  <p className="text-xs text-gray-500 text-center">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-gray-500 text-sm">
        <p>© 2025 Tracker Hub. Build better habits, manage tasks, and track your finances.</p>
      </footer>
    </div>
  );
}