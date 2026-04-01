import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_TRANSACTIONS } from '../data/mockData';

let nextId = INITIAL_TRANSACTIONS.length + 1;

const useStore = create(
  persist(
    (set) => ({
      transactions: INITIAL_TRANSACTIONS,
      role: 'viewer', // 'viewer' | 'admin'
      darkMode: true,
      filters: {
        search: '',
        category: '',
        type: '',
        sortBy: 'date',
        sortDir: 'desc',
      },

      // Role
      setRole: (role) => set({ role }),

      // Dark mode
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      // Filters
      setFilter: (key, value) =>
        set((s) => ({ filters: { ...s.filters, [key]: value } })),
      resetFilters: () =>
        set({ filters: { search: '', category: '', type: '', sortBy: 'date', sortDir: 'desc' } }),

      // CRUD
      addTransaction: (tx) => {
        const newTx = { ...tx, id: nextId++ };
        set((s) => ({ transactions: [newTx, ...s.transactions] }));
      },
      editTransaction: (id, updates) =>
        set((s) => ({
          transactions: s.transactions.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx)),
        })),
      deleteTransaction: (id) =>
        set((s) => ({ transactions: s.transactions.filter((tx) => tx.id !== id) })),


    }),
    { name: 'finance-dashboard-store' }
  )
);

export default useStore;
