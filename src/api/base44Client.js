const DB_KEY = 'tracker_hub_db';

// Helper to get local DB
const getLocalDB = () => {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : {};
};

// Helper to save local DB
const saveLocalDB = (data) => {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
};

// Generic LocalStorage Entity Factory
const createEntity = (tableName) => ({
    list: async (sortField = null, limit = 1000) => {
        const db = getLocalDB();
        let items = db[tableName] || [];

        // Simple sorting
        if (sortField) {
            const isDescending = sortField.startsWith('-');
            const field = isDescending ? sortField.slice(1) : sortField;
            items.sort((a, b) => {
                if (a[field] < b[field]) return isDescending ? 1 : -1;
                if (a[field] > b[field]) return isDescending ? -1 : 1;
                return 0;
            });
        }

        if (limit) {
            items = items.slice(0, limit);
        }

        return items;
    },

    get: async (id) => {
        const db = getLocalDB();
        const items = db[tableName] || [];
        const item = items.find(i => i.id === id);
        if (!item) throw new Error('Item not found');
        return item;
    },

    create: async (data) => {
        const db = getLocalDB();
        const items = db[tableName] || [];

        const newItem = {
            ...data,
            id: data.id || crypto.randomUUID(),
            created_at: new Date().toISOString(),
            user_id: 'local-user' // Dummy user ID
        };

        items.push(newItem);
        db[tableName] = items;
        saveLocalDB(db);

        return newItem;
    },

    update: async (id, data) => {
        const db = getLocalDB();
        const items = db[tableName] || [];
        const index = items.findIndex(i => i.id === id);

        if (index === -1) throw new Error('Item not found');

        const updatedItem = { ...items[index], ...data };
        items[index] = updatedItem;
        db[tableName] = items;
        saveLocalDB(db);

        return updatedItem;
    },

    delete: async (id) => {
        const db = getLocalDB();
        const items = db[tableName] || [];
        const newItems = items.filter(i => i.id !== id);

        db[tableName] = newItems;
        saveLocalDB(db);

        return { success: true };
    },

    deleteBy: async (field, value) => {
        const db = getLocalDB();
        const items = db[tableName] || [];
        const newItems = items.filter(i => i[field] !== value);

        db[tableName] = newItems;
        saveLocalDB(db);

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
            return {
                id: 'local-user',
                email: 'user@local.app',
                full_name: 'Local User'
            };
        },
        updateMe: async (data) => {
            return {
                id: 'local-user',
                email: 'user@local.app',
                ...data
            };
        },
        logout: async (redirectPath = '/') => {
            window.location.href = redirectPath;
        },
        redirectToLogin: () => {
            // No-op for local mode
        }
    },
    integrations: {
        Core: {
            UploadFile: async ({ file }) => {
                // For local mode, we can't easily upload files. 
                // We could use FileReader to get a data URL, but that might be heavy for LS.
                // For now, return a placeholder or try to use a data URL if small.
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve({ file_url: reader.result });
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            },
            SendEmail: async ({ to, subject, body }) => {
                console.log('Mock sending email:', { to, subject, body });
                return { success: true };
            }
        }
    }
};
