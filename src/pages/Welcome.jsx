import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client.supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, CheckSquare, DollarSign, Calendar, ArrowRight, Sparkles, Mail, Lock, Chrome, Loader2, Eye, EyeOff } from 'lucide-react';

export default function Welcome() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Login state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    // Signup state
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
    const [isNewUser, setIsNewUser] = useState(true); // Track if user is new

    // Check if user is already logged in
    useEffect(() => {
        const checkSession = async () => {
            try {
                const session = await base44.auth.getSession();
                if (session) {
                    console.log('User already has session, redirecting to dashboard');
                    // Add a small delay to ensure auth state is fully propagated
                    setTimeout(() => {
                        navigate('/dashboard', { replace: true });
                    }, 100);
                }
            } catch (err) {
                console.log('No active session, staying on welcome page');
            }
        };
        checkSession();
    }, [navigate]);

    // Check if user has existing data to determine if they're new or returning
    const checkIfReturningUser = async () => {
        try {
            const [habits, tasks, boards] = await Promise.all([
                base44.entities.Habit.list(),
                base44.entities.Task.list(),
                base44.entities.VisionBoard.list()
            ]);

            // If user has any data, they're a returning user
            const hasData = habits.length > 0 || tasks.length > 0 || boards.length > 0;
            setIsNewUser(!hasData);
        } catch (err) {
            // If error, assume new user
            setIsNewUser(true);
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            console.log('Attempting email login for:', loginEmail);
            const data = await base44.auth.signInWithEmail(loginEmail, loginPassword);
            console.log('Login successful:', data);
            
            if (data.session) {
                console.log('Session established, navigating to dashboard');
                // Wait a bit for auth state to propagate
                await new Promise(resolve => setTimeout(resolve, 500));
                navigate('/dashboard', { replace: true });
            } else {
                setError('Login successful but session not established. Please try again.');
                setIsLoading(false);
            }
        } catch (err) {
            console.error('Login error details:', err);
            setError(err.message || 'Login failed. Please check your credentials.');
            setIsLoading(false);
        }
    };

    const handleEmailSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (signupPassword !== signupConfirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (signupPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            console.log('Attempting email signup for:', signupEmail);
            const data = await base44.auth.signUpWithEmail(signupEmail, signupPassword);
            console.log('Signup response:', data);
            setError('');
            alert('Account created! Please check your email to verify your account.');
            // Switch to login tab
            document.querySelector('[value="login"]')?.click();
        } catch (err) {
            console.error('Signup error details:', err);
            setError(err.message || 'Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');

        try {
            console.log('Attempting Google OAuth login...');
            const data = await base44.auth.signInWithOAuth('google', '/dashboard');
            console.log('OAuth login response:', data);
            await checkIfReturningUser();
        } catch (err) {
            console.error('OAuth error details:', err);
            setError(err.message || 'Google login failed');
            setIsLoading(false);
        }
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

                        <p className="text-xl text-gray-400 max-w-lg text-center lg:text-left mx-auto lg:mx-0">
                            Manage habits, tasks, finances, and weekly planning all in one beautiful dashboard
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4 pt-6 max-w-xs mx-auto lg:mx-0 lg:max-w-none">
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
                                <CardTitle className="text-2xl font-bold text-white">{isNewUser ? 'Welcome to Tracker Hub' : 'Welcome Back'}</CardTitle>
                                <CardDescription className="text-gray-400">
                                    {isNewUser ? 'Create an account to get started' : 'Sign in to continue your journey'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {error && (
                                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <Tabs defaultValue="login" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 bg-gray-700/50">
                                        <TabsTrigger value="login" className="data-[state=active]:bg-orange-600">
                                            Login
                                        </TabsTrigger>
                                        <TabsTrigger value="signup" className="data-[state=active]:bg-orange-600">
                                            Sign Up
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Login Tab */}
                                    <TabsContent value="login" className="space-y-4 pt-6">
                                        <form onSubmit={handleEmailLogin} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                    <Input
                                                        id="login-email"
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        value={loginEmail}
                                                        onChange={(e) => setLoginEmail(e.target.value)}
                                                        className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="login-password" className="text-gray-300">Password</Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                    <Input
                                                        id="login-password"
                                                        type={showLoginPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        value={loginPassword}
                                                        onChange={(e) => setLoginPassword(e.target.value)}
                                                        className="pl-10 pr-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                                    >
                                                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white h-11"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                                        Logging in...
                                                    </>
                                                ) : (
                                                    <>
                                                        Login
                                                        <ArrowRight className="ml-2 w-4 h-4" />
                                                    </>
                                                )}
                                            </Button>
                                        </form>

                                        <div className="relative my-6">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-700"></div>
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-center">
                                            <Button
                                                type="button"
                                                onClick={handleGoogleLogin}
                                                disabled={isLoading}
                                                className="group relative w-14 h-14 rounded-full bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-white border-2 border-gray-200 hover:border-orange-300 shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-3 p-0 overflow-hidden"
                                                title="Sign in with Google"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/0 to-orange-500/0 group-hover:from-orange-400/10 group-hover:to-orange-500/10 transition-all duration-300"></div>
                                                <svg className="w-7 h-7 relative z-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                </svg>
                                            </Button>
                                        </div>
                                    </TabsContent>

                                    {/* Signup Tab */}
                                    <TabsContent value="signup" className="space-y-4 pt-6">
                                        <form onSubmit={handleEmailSignup} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                    <Input
                                                        id="signup-email"
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        value={signupEmail}
                                                        onChange={(e) => setSignupEmail(e.target.value)}
                                                        className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="signup-password" className="text-gray-300">Password</Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                    <Input
                                                        id="signup-password"
                                                        type={showSignupPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        value={signupPassword}
                                                        onChange={(e) => setSignupPassword(e.target.value)}
                                                        className="pl-10 pr-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                                                        required
                                                        minLength={6}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                                    >
                                                        {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="signup-confirm" className="text-gray-300">Confirm Password</Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                    <Input
                                                        id="signup-confirm"
                                                        type={showSignupConfirmPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        value={signupConfirmPassword}
                                                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                                                        className="pl-10 pr-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                                                        required
                                                        minLength={6}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                                    >
                                                        {showSignupConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white h-11"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                                        Creating account...
                                                    </>
                                                ) : (
                                                    <>
                                                        Create Account
                                                        <ArrowRight className="ml-2 w-4 h-4" />
                                                    </>
                                                )}
                                            </Button>
                                        </form>

                                        <div className="relative my-6">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-700"></div>
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-center">
                                            <Button
                                                type="button"
                                                onClick={handleGoogleLogin}
                                                disabled={isLoading}
                                                className="group relative w-14 h-14 rounded-full bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-white border-2 border-gray-200 hover:border-orange-300 shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-3 p-0 overflow-hidden"
                                                title="Sign in with Google"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/0 to-orange-500/0 group-hover:from-orange-400/10 group-hover:to-orange-500/10 transition-all duration-300"></div>
                                                <svg className="w-7 h-7 relative z-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                </svg>
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
