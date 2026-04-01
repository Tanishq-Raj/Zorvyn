import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { Wallet, ArrowUpCircle, ArrowDownCircle, PiggyBank, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import SummaryCard from '../components/SummaryCard';
import { generateMonthlyData, generateCategorySpending } from '../data/mockData';
import './Dashboard.css';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.stroke || p.fill }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const transactions = useStore((s) => s.transactions);
  
  const summary = useMemo(() => {
    const totalIncome = transactions.filter((tx) => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0);
    const totalExpenses = transactions.filter((tx) => tx.type === 'expense').reduce((s, tx) => s + tx.amount, 0);
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;
    return { totalIncome, totalExpenses, balance, savingsRate };
  }, [transactions]);
  const monthlyData = useMemo(() => generateMonthlyData(transactions), [transactions]);
  const categoryData = useMemo(() => generateCategorySpending(transactions), [transactions]);

  const topMonth = monthlyData.reduce((a, b) => (a.balance > b.balance ? a : b), monthlyData[0] || {});

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="dashboard"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Track your financial health at a glance</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={item} className="grid-4">
        <SummaryCard
          icon={Wallet}
          label="Total Balance"
          value={summary.balance}
          trend={summary.balance >= 0 ? 1 : -1}
          trendLabel="Net position"
          color="#6366f1"
          delay={1}
        />
        <SummaryCard
          icon={ArrowUpCircle}
          label="Total Income"
          value={summary.totalIncome}
          trend={1}
          trendLabel="All time"
          color="#22c55e"
          delay={2}
        />
        <SummaryCard
          icon={ArrowDownCircle}
          label="Total Expenses"
          value={summary.totalExpenses}
          trend={-1}
          trendLabel="All time"
          color="#f43f5e"
          delay={3}
        />
        <SummaryCard
          icon={PiggyBank}
          label="Savings Rate"
          value={`${summary.savingsRate}%`}
          trend={parseFloat(summary.savingsRate) >= 20 ? 1 : 0}
          trendLabel={parseFloat(summary.savingsRate) >= 20 ? 'Healthy' : 'Below target'}
          color="#f59e0b"
          delay={4}
        />
      </motion.div>

      {/* Charts */}
      <motion.div variants={item} className="grid-2" style={{ marginTop: 24 }}>
        {/* Balance Trend */}
        <motion.div 
          className="card chart-card"
          whileHover={{ boxShadow: 'var(--shadow)' }}
        >
          <div className="chart-header">
            <h3>Balance Trend</h3>
            <span className="chart-sub">{topMonth.name ? `Best month: ${topMonth.name} (${fmt(topMonth.balance)})` : ''}</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" name="Income" stroke="#22c55e" fill="url(#incomeGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" fill="none" strokeWidth={2} strokeDasharray="5 3" dot={false} />
              <Area type="monotone" dataKey="balance" name="Balance" stroke="#6366f1" fill="url(#balanceGrad)" strokeWidth={2.5} dot={{ r: 4, fill: '#6366f1' }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Spending Breakdown */}
        <motion.div 
          className="card chart-card"
          whileHover={{ boxShadow: 'var(--shadow)' }}
        >
          <div className="chart-header">
            <h3>Spending Breakdown</h3>
            <span className="chart-sub">By category</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={categoryData.slice(0, 7)}
                cx="42%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.slice(0, 7).map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip formatter={(v) => fmt(v)} />
              <Legend
                formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{value}</span>}
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div variants={item} className="card" style={{ marginTop: 24 }}>
        <div className="chart-header" style={{ padding: '20px 20px 0' }}>
          <h3>Recent Activity</h3>
          <Link to="/transactions" className="see-all-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 6).map((tx) => (
                <tr key={tx.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  <td style={{ fontWeight: 500 }}>{tx.description}</td>
                  <td><span className="category-chip">{tx.category}</span></td>
                  <td><span className={`badge badge-${tx.type}`}>{tx.type}</span></td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: tx.type === 'income' ? 'var(--income)' : 'var(--expense)' }}>
                    {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
