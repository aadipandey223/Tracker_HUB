import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { base44 } from '@/api/base44Client.supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    User, Mail, Calendar, Edit2, Save, Target, CheckSquare,
    Flame, DollarSign, Award, Trophy, Camera, Upload, Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Profile() {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        activeHabits: 0,
        tasksCompleted: 0,
        habitCheckins: 0,
        transactions: 0
    });
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = React.useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await base44.auth.me();
                setUser(userData);
                setFormData({
                    full_name: userData?.user_metadata?.full_name || '',
                    email: userData?.email || '',
                });

                // Fetch Stats
                const [habits, tasks, logs, transactions] = await Promise.all([
                    base44.entities.Habit.list().catch(() => []),
                    base44.entities.Task.list().catch(() => []),
                    base44.entities.HabitLog.list().catch(() => []),
                    base44.entities.FinanceTransaction.list().catch(() => [])
                ]);

                setStats({
                    activeHabits: habits.filter(h => !h.is_archived).length,
                    tasksCompleted: tasks.filter(t => t.status === 'Done').length,
                    habitCheckins: logs.filter(l => l.completed).length,
                    transactions: transactions.length
                });

            } catch (error) {
                console.error('Error fetching profile data:', error);
                toast.error('Failed to load profile data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSave = async () => {
        if (!formData.full_name.trim()) {
            toast.error('Full name is required');
            return;
        }

        setIsSaving(true);
        try {
            await base44.auth.updateMe({
                data: {
                    full_name: formData.full_name,
                }
            });
            // Refresh local user data
            const updatedUser = await base44.auth.me();
            setUser(updatedUser);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (3MB = 3 * 1024 * 1024 bytes)
        if (file.size > 3 * 1024 * 1024) {
            toast.error('Image size must be less than 3MB');
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        handleUpload(file);
    };

    const handleUpload = async (file) => {
        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            // Upload to 'avatars' bucket
            await base44.storage.upload('avatars', fileName, file);

            // Get public URL
            const publicUrl = base44.storage.getPublicUrl('avatars', fileName);

            // Update user metadata
            await base44.auth.updateMe({
                data: {
                    avatar_url: publicUrl
                }
            });

            // Refresh user data
            const updatedUser = await base44.auth.me();
            setUser(updatedUser);
            toast.success('Profile photo updated!');
        } catch (error) {
            console.error('Error uploading photo:', error);
            toast.error('Failed to upload photo');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemovePhoto = async () => {
        if (!confirm('Are you sure you want to remove your profile photo?')) return;

        try {
            await base44.auth.updateMe({
                data: {
                    avatar_url: null
                }
            });

            // Refresh user data
            const updatedUser = await base44.auth.me();
            setUser(updatedUser);
            toast.success('Profile photo removed');
        } catch (error) {
            console.error('Error removing photo:', error);
            toast.error('Failed to remove photo');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    const joinDate = user ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
    const initials = formData.full_name
        ? formData.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';
    const avatarUrl = user?.user_metadata?.avatar_url;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 font-sans">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                {/* Header Card */}
                <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-700 p-8 shadow-xl text-white relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Trophy className="w-64 h-64 transform rotate-12" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                        {/* Avatar */}
                        <div className="relative group">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileSelect}
                            />

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className={`w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center text-3xl font-bold tracking-wider shadow-lg cursor-pointer transition-transform hover:scale-105 ${avatarUrl ? 'bg-white' : 'bg-white/20 backdrop-blur-sm'}`}>
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            initials
                                        )}
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 right-0 bg-white text-orange-600 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="w-4 h-4" />
                                        </div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="center">
                                    <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Photo
                                    </DropdownMenuItem>
                                    {avatarUrl && (
                                        <DropdownMenuItem onClick={handleRemovePhoto} className="text-red-600">
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Remove Photo
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex-1 pt-2">
                            <h1 className="text-3xl font-bold mb-1">{formData.full_name || 'User'}</h1>
                            <div className="flex flex-col md:flex-row items-center gap-4 text-orange-50 text-sm font-medium">
                                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full">
                                    <Mail className="w-4 h-4" />
                                    {formData.email}
                                </span>
                                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full">
                                    <Calendar className="w-4 h-4" />
                                    Joined {joinDate}
                                </span>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Profile Section */}
                <Card className="border-none shadow-sm bg-white dark:bg-gray-800">
                    <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-4">
                        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-500">
                            <User className="w-5 h-5" />
                            <h2 className="font-semibold text-lg">Edit Profile</h2>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="text-gray-500 dark:text-gray-400">Full Name</Label>
                            <Input
                                value={formData.full_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-500 dark:text-gray-400">Email</Label>
                            <Input
                                value={formData.email}
                                disabled
                                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-11 text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-400">Email cannot be changed</p>
                        </div>
                        <div className="md:col-span-2 pt-2">
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-8 h-11"
                            >
                                {isSaving ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                ) : (
                                    <Save className="w-4 h-4 mr-2" />
                                )}
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white mb-4">
                        <Target className="w-5 h-5 text-orange-500" />
                        <h2 className="font-bold text-xl">Your Stats</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatsCard
                            icon={Target}
                            value={stats.activeHabits}
                            label="Active Habits"
                            color="text-orange-500"
                            bg="bg-orange-50 dark:bg-orange-900/10"
                        />
                        <StatsCard
                            icon={CheckSquare}
                            value={stats.tasksCompleted}
                            label="Tasks Completed"
                            color="text-blue-500"
                            bg="bg-blue-50 dark:bg-blue-900/10"
                        />
                        <StatsCard
                            icon={Flame}
                            value={stats.habitCheckins}
                            label="Habit Check-ins"
                            color="text-green-500"
                            bg="bg-green-50 dark:bg-green-900/10"
                        />
                        <StatsCard
                            icon={DollarSign}
                            value={stats.transactions}
                            label="Transactions"
                            color="text-purple-500"
                            bg="bg-purple-50 dark:bg-purple-900/10"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ icon: Icon, value, label, color, bg }) {
    return (
        <Card className="border-none shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                <div className={`w-12 h-12 rounded-xl ${bg} ${color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <div className={`text-3xl font-bold ${color}`}>
                        {value}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
                </div>
            </CardContent>
        </Card>
    );
}