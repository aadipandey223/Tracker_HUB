import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client.supabase';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, Mail, Calendar, Target, CheckSquare, DollarSign, 
  Camera, Save, Loader2, Trophy, Flame, TrendingUp 
} from 'lucide-react';
import { format } from 'date-fns';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setEditedName(currentUser.full_name || '');
        setProfileImage(currentUser.profile_image || '');
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const { data: habits = [] } = useQuery({
    queryKey: ['habits'],
    queryFn: () => base44.entities.Habit.list(),
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.Task.list(),
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.FinanceTransaction.list(),
  });

  const { data: habitLogs = [] } = useQuery({
    queryKey: ['habitLogs'],
    queryFn: () => base44.entities.HabitLog.list(),
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setProfileImage(file_url);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await base44.auth.updateMe({
        full_name: editedName,
        profile_image: profileImage
      });
      setUser(prev => ({ ...prev, full_name: editedName, profile_image: profileImage }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const completedHabits = habitLogs.filter(l => l.completed).length;
  const totalTransactions = transactions.length;

  const stats = [
    { 
      icon: Target, 
      label: 'Active Habits', 
      value: habits.length, 
      color: 'orange',
      bgColor: 'bg-orange-500/20',
      textColor: 'text-orange-500'
    },
    { 
      icon: CheckSquare, 
      label: 'Tasks Completed', 
      value: completedTasks, 
      color: 'blue',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-500'
    },
    { 
      icon: Flame, 
      label: 'Habit Check-ins', 
      value: completedHabits, 
      color: 'green',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-500'
    },
    { 
      icon: DollarSign, 
      label: 'Transactions', 
      value: totalTransactions, 
      color: 'purple',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-500'
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your account and view your progress</p>
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar Section */}
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-white/30 shadow-2xl">
                <AvatarImage src={profileImage} />
                <AvatarFallback className="text-3xl bg-white/20 text-white font-bold">
                  {getInitials(user?.full_name)}
                </AvatarFallback>
              </Avatar>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="hidden" 
                />
              </label>
            </div>

            {/* Info Section */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-white">{user?.full_name || 'User'}</h2>
                <p className="text-orange-100 flex items-center justify-center md:justify-start gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-4 text-orange-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {user?.created_date ? format(new Date(user.created_date), 'MMM yyyy') : 'Recently'}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
                  <Trophy className="w-4 h-4" />
                  <span className="font-medium">{user?.role || 'Member'}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile */}
      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <User className="w-5 h-5 text-orange-500" />
            Edit Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
              <Input
                id="name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Enter your name"
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-500"
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          Your Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}