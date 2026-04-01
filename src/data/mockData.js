export const CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Entertainment',
  'Health',
  'Shopping',
  'Utilities',
  'Salary',
  'Freelance',
  'Investment',
  'Education',
];

export const CATEGORY_COLORS = {
  'Food & Dining': '#f97316',
  'Transport': '#3b82f6',
  'Entertainment': '#a855f7',
  'Health': '#22c55e',
  'Shopping': '#ec4899',
  'Utilities': '#eab308',
  'Salary': '#06b6d4',
  'Freelance': '#14b8a6',
  'Investment': '#8b5cf6',
  'Education': '#f59e0b',
};

let idCounter = 1;
const mkTx = (date, desc, category, amount, type) => ({
  id: idCounter++,
  date,
  description: desc,
  category,
  amount,
  type, // 'income' | 'expense'
});

export const INITIAL_TRANSACTIONS = [
  // January
  mkTx('2026-01-05', 'Monthly Salary', 'Salary', 5500, 'income'),
  mkTx('2026-01-07', 'Grocery Store', 'Food & Dining', 120, 'expense'),
  mkTx('2026-01-10', 'Netflix Subscription', 'Entertainment', 15, 'expense'),
  mkTx('2026-01-12', 'Bus Pass', 'Transport', 40, 'expense'),
  mkTx('2026-01-15', 'Freelance Project A', 'Freelance', 800, 'income'),
  mkTx('2026-01-18', 'Pharmacy', 'Health', 35, 'expense'),
  mkTx('2026-01-20', 'Online Shopping', 'Shopping', 200, 'expense'),
  mkTx('2026-01-22', 'Electricity Bill', 'Utilities', 90, 'expense'),
  mkTx('2026-01-28', 'Restaurant Dinner', 'Food & Dining', 75, 'expense'),

  // February
  mkTx('2026-02-05', 'Monthly Salary', 'Salary', 5500, 'income'),
  mkTx('2026-02-08', 'Coffee Shop', 'Food & Dining', 45, 'expense'),
  mkTx('2026-02-10', 'Spotify Premium', 'Entertainment', 10, 'expense'),
  mkTx('2026-02-12', 'Uber Rides', 'Transport', 60, 'expense'),
  mkTx('2026-02-14', 'Valentines Dinner', 'Food & Dining', 140, 'expense'),
  mkTx('2026-02-18', 'Gym Membership', 'Health', 50, 'expense'),
  mkTx('2026-02-20', 'Freelance Project B', 'Freelance', 1200, 'income'),
  mkTx('2026-02-22', 'Internet Bill', 'Utilities', 60, 'expense'),
  mkTx('2026-02-25', 'Clothing Store', 'Shopping', 180, 'expense'),
  mkTx('2026-02-27', 'Stock Dividend', 'Investment', 150, 'income'),

  // March
  mkTx('2026-03-05', 'Monthly Salary', 'Salary', 5500, 'income'),
  mkTx('2026-03-07', 'Grocery Store', 'Food & Dining', 145, 'expense'),
  mkTx('2026-03-09', 'Cinema Tickets', 'Entertainment', 30, 'expense'),
  mkTx('2026-03-11', 'Petrol', 'Transport', 80, 'expense'),
  mkTx('2026-03-14', 'Doctor Visit', 'Health', 120, 'expense'),
  mkTx('2026-03-16', 'Freelance Project C', 'Freelance', 600, 'income'),
  mkTx('2026-03-18', 'Amazon Shopping', 'Shopping', 320, 'expense'),
  mkTx('2026-03-20', 'Water Bill', 'Utilities', 45, 'expense'),
  mkTx('2026-03-22', 'Online Course', 'Education', 99, 'expense'),
  mkTx('2026-03-24', 'Investment Return', 'Investment', 250, 'income'),
  mkTx('2026-03-28', 'Restaurant Lunch', 'Food & Dining', 55, 'expense'),
  mkTx('2026-03-30', 'Takeaway Food', 'Food & Dining', 35, 'expense'),
];

export const generateMonthlyData = (transactions) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = {};

  transactions.forEach((tx) => {
    const d = new Date(tx.date);
    const key = months[d.getMonth()] + ' ' + d.getFullYear();
    if (!data[key]) data[key] = { name: months[d.getMonth()], income: 0, expenses: 0 };
    if (tx.type === 'income') data[key].income += tx.amount;
    else data[key].expenses += tx.amount;
  });

  return Object.values(data).map((m) => ({
    ...m,
    balance: m.income - m.expenses,
  }));
};

export const generateCategorySpending = (transactions) => {
  const data = {};
  transactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      data[tx.category] = (data[tx.category] || 0) + tx.amount;
    });

  return Object.entries(data)
    .map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] || '#6b7280' }))
    .sort((a, b) => b.value - a.value);
};
