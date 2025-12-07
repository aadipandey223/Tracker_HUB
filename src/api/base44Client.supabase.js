import { supabase } from './supabaseClient';

// Generic Supabase Entity Factory
const createEntity = (tableName) => ({
    list: async (sortField = null, limit = 1000) => {
        // Get current user ID
        const { data: { user } } = await supabase.auth.getUser();

        let query = supabase.from(tableName).select('*');

        // Filter by user_id if user is authenticated
        if (user) {
            query = query.eq('user_id', user.id);
        }

        // Apply sorting
        if (sortField) {
            const isDescending = sortField.startsWith('-');
            const field = isDescending ? sortField.slice(1) : sortField;
            query = query.order(field, { ascending: !isDescending });
        }

        if (limit) {
            query = query.limit(limit);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    },

    select: async (options = {}) => {
        const { data: { user } } = await supabase.auth.getUser();
        let query = supabase.from(tableName).select('*');

        if (user) {
            query = query.eq('user_id', user.id);
        }

        if (options.buildQuery) {
            query = options.buildQuery(query);
        }

        if (options.limit) {
            query = query.limit(options.limit);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    },

    get: async (id) => {
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    create: async (data) => {
        // Get current user ID
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
            console.error('Auth error in create:', authError);
            throw new Error('Authentication error: ' + authError.message);
        }

        if (!user) {
            console.error('No user found - user might not be logged in');
            throw new Error('You must be logged in to create items. Please log in and try again.');
        }

        // Add user_id to the data
        const dataWithUserId = { ...data, user_id: user.id };

        console.log(`Creating ${tableName} with user_id:`, user.id);

        const { data: newItem, error } = await supabase
            .from(tableName)
            .insert([dataWithUserId])
            .select()
            .single();

        if (error) {
            console.error(`Error creating ${tableName}:`, error);
            throw error;
        }

        return newItem;
    },

    update: async (id, data) => {
        const { data: updatedItem, error } = await supabase
            .from(tableName)
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return updatedItem;
    },

    upsert: async (data, onConflict = 'id') => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const dataWithUserId = { ...data, user_id: user.id };

        const { data: upsertedItem, error } = await supabase
            .from(tableName)
            .upsert(dataWithUserId, { onConflict })
            .select()
            .single();

        if (error) throw error;
        return upsertedItem;
    },

    delete: async (id) => {
        const { error } = await supabase
            .from(tableName)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    },

    deleteBy: async (field, value) => {
        const { error } = await supabase
            .from(tableName)
            .delete()
            .eq(field, value);

        if (error) throw error;
        return { success: true };
    }
});

export const base44 = {
    entities: {
        Habit: createEntity('habits'),
        HabitLog: createEntity('habit_logs'),
        Task: createEntity('tasks'),
        FinanceTransaction: createEntity('transactions'),
        Debt: createEntity('debts'),
        Category: createEntity('categories'),
        MonthlyBudget: createEntity('monthly_budgets'),
        MentalState: createEntity('mental_states'),
        VisionBoard: createEntity('vision_boards'),
        VisionBoardItem: createEntity('vision_board_items'),
    },
    auth: {
        me: async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) throw error;
            return data.user;
        },
        updateMe: async (updates) => {
            const { data, error } = await supabase.auth.updateUser(updates);
            if (error) throw error;
            return data.user;
        },
        logout: async (redirectPath = '/') => {
            await supabase.auth.signOut();
            window.location.href = redirectPath;
        },
        redirectToLogin: (redirectTo = '/dashboard') => {
            // Supabase UI will handle the full authentication flow
            const redirectUrl = `${window.location.origin}${redirectTo}`;
            window.location.href = `${supabase.auth.url}/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUrl)}`;
        },
        signInWithEmail: async (email, password) => {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            return data;
        },
        signUpWithEmail: async (email, password, metadata = {}) => {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: metadata
                }
            });
            if (error) throw error;
            return data;
        },
        signInWithOAuth: async (provider = 'google', redirectTo = '/dashboard') => {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}${redirectTo}`
                }
            });
            if (error) throw error;
            return data;
        },
        getSession: async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) throw error;
            return data.session;
        },
        onAuthStateChange: (callback) => {
            return supabase.auth.onAuthStateChange(callback);
        }
    },
    integrations: {
        Core: {
            UploadFile: async ({ file }) => {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `uploads/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('files')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from('files')
                    .getPublicUrl(filePath);

                return { file_url: data.publicUrl };
            },
            SendEmail: async ({ to, subject, body }) => {
                console.log('Email sending not implemented in Supabase mode:', { to, subject, body });
                return { success: true };
            }
        }
    }
};
