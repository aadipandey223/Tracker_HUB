// Mock database using localStorage
const DB_KEY = 'tracker_hub_db';

const getDb = () => {
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    const initialDb = {
      habits: [],
      habitLogs: [],
      tasks: [],
      transactions: [],
      debts: [],
      categories: [],
      monthlyBudgets: [],
      mentalStates: [],
    };
    localStorage.setItem(DB_KEY, JSON.stringify(initialDb));
    return initialDb;
  }
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to parse database from localStorage, resetting:', error);
    localStorage.removeItem(DB_KEY);
    const initialDb = {
      habits: [],
      habitLogs: [],
      tasks: [],
      transactions: [],
      debts: [],
      categories: [],
      monthlyBudgets: [],
      mentalStates: [],
    };
    localStorage.setItem(DB_KEY, JSON.stringify(initialDb));
    return initialDb;
  }
};

const saveDb = (db) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const mockDb = {
  // Generic CRUD operations
  list: (entityName, sortField = null, limit = 1000) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const db = getDb();
        let items = db[entityName] || [];

        if (sortField) {
          const isDescending = sortField.startsWith('-');
          const field = isDescending ? sortField.slice(1) : sortField;
          items = [...items].sort((a, b) => {
            if (isDescending) {
              return b[field] > a[field] ? 1 : -1;
            }
            return a[field] > b[field] ? 1 : -1;
          });
        }

        resolve(items.slice(0, limit));
      }, 100);
    });
  },

  get: (entityName, id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const db = getDb();
        const item = db[entityName]?.find((i) => i.id === id);
        if (item) {
          resolve(item);
        } else {
          reject(new Error('Item not found'));
        }
      }, 100);
    });
  },

  create: (entityName, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const db = getDb();
        const newItem = { ...data, id: generateId() };
        db[entityName] = [...(db[entityName] || []), newItem];
        saveDb(db);
        resolve(newItem);
      }, 100);
    });
  },

  update: (entityName, id, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const db = getDb();
        const index = db[entityName]?.findIndex((i) => i.id === id);
        if (index !== -1) {
          db[entityName][index] = { ...db[entityName][index], ...data };
          saveDb(db);
          resolve(db[entityName][index]);
        } else {
          reject(new Error('Item not found'));
        }
      }, 100);
    });
  },

  delete: (entityName, id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const db = getDb();
        const index = db[entityName]?.findIndex((i) => i.id === id);
        if (index !== -1) {
          db[entityName].splice(index, 1);
          saveDb(db);
          resolve({ success: true });
        } else {
          reject(new Error('Item not found'));
        }
      }, 100);
    });
  },
};

// Initialize with sample data if empty
export const initializeSampleData = () => {
  const db = getDb();

  if (db.habits.length === 0) {
    // Sample habits
    db.habits = [
      {
        id: '1',
        name: 'Morning Exercise',
        description: 'Start the day with 30 minutes of exercise',
        icon: 'Dumbbell',
        target_value: 30,
        unit: 'minutes',
        frequency: 'daily',
        color: '#ff6b35',
      },
      {
        id: '2',
        name: 'Read Books',
        description: 'Read for at least 20 minutes',
        icon: 'Book',
        target_value: 20,
        unit: 'minutes',
        frequency: 'daily',
        color: '#4ecdc4',
      },
      {
        id: '3',
        name: 'Meditation',
        description: 'Practice mindfulness meditation',
        icon: 'Brain',
        target_value: 15,
        unit: 'minutes',
        frequency: 'daily',
        color: '#95e1d3',
      },
    ];

    // Sample habit logs
    const today = new Date().toISOString().split('T')[0];
    db.habitLogs = [
      {
        id: 'log1',
        habit_id: '1',
        date: today,
        completed: true,
        actual_value: 30,
        mood: 8,
        motivation: 9,
      },
      {
        id: 'log2',
        habit_id: '2',
        date: today,
        completed: false,
        actual_value: 0,
        mood: 7,
        motivation: 6,
      },
    ];

    // Sample tasks
    db.tasks = [
      {
        id: 'task1',
        title: 'Complete project proposal',
        description: 'Finish the Q4 project proposal document',
        due_date: today,
        priority: 'High',
        status: 'In Progress',
        category: 'Work',
        is_recurring: false,
      },
      {
        id: 'task2',
        title: 'Grocery shopping',
        description: 'Buy weekly groceries',
        due_date: today,
        priority: 'Medium',
        status: 'Not Started',
        category: 'Personal',
        is_recurring: true,
        recurrence_pattern: 'weekly',
      },
    ];

    // No sample transactions - user starts with clean slate
    db.transactions = [];

    // No sample debts - user starts with clean slate
    db.debts = [];

    saveDb(db);
  }
};
