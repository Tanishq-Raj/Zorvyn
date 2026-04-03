import { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area,
} from 'recharts';
import { Trophy, TrendingUp, TrendingDown, AlertCircle, Target, Zap, DollarSign, Percent } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { generateMonthlyData, generateCategorySpending, CATEGORY_COLORS } from '../data/mockData';
import './Insights.css';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

// Animated Counter Component
const AnimatedCounter = ({ value, prefix = '', suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useMemo(() => {
    let isMounted = true;
    const numValue = typeof value === 'number' ? value : 0;
    const startTime = Date.now();
    const duration = 1200;
    
    const animate = () => {
      if (!isMounted) return;
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      setDisplayValue(Math.floor(numValue * easeOutQuad));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(numValue);
      }
    };
    
    animate();
    return () => { isMounted = false; };
  }, [value]);
  
  return <>{prefix}{displayValue.toLocaleString()}{suffix}</>;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.fill || p.stroke }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function Insights() {
  const { transactions } = useStore();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const monthlyData = useMemo(() => generateMonthlyData(transactions), [transactions]);
  const categoryData = useMemo(() => generateCategorySpending(transactions), [transactions]);

  const topCategory = categoryData[0];
  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalIncome  = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const netSavings   = totalIncome - totalExpenses;
  const savingsRate  = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0;

  // Month-over-month savings change
  const lastTwo = monthlyData.slice(-2);
  const momChange = lastTwo.length === 2
    ? (((lastTwo[1].balance - lastTwo[0].balance) / Math.abs(lastTwo[0].balance || 1)) * 100).toFixed(1)
    : null;

  // Observations
  const observations = [];
  if (topCategory) {
    const pct = ((topCategory.value / totalExpenses) * 100).toFixed(0);
    observations.push({
      icon: Trophy,
      text: `${topCategory.name} is your top expense at ${fmt(topCategory.value)} (${pct}% of total).`,
      color: '#f59e0b',
    });
  }
  if (momChange !== null) {
    const dir = parseFloat(momChange) >= 0;
    observations.push({
      icon: dir ? TrendingUp : TrendingDown,
      text: `Your net balance ${dir ? 'improved' : 'decreased'} by ${Math.abs(momChange)}% vs last month.`,
      color: dir ? '#22c55e' : '#f43f5e',
    });
  }
  if (parseFloat(savingsRate) < 20) {
    observations.push({
      icon: AlertCircle,
      text: `Your savings rate is ${savingsRate}%. Financial advisors recommend at least 20%.`,
      color: '#f43f5e',
    });
  } else {
    observations.push({
      icon: Target,
      text: `Great job! Your ${savingsRate}% savings rate exceeds the 20% recommendation.`,
      color: '#22c55e',
    });
  }
  const highestIncomeMonth = monthlyData.reduce((a, b) => (a.income > b.income ? a : b), monthlyData[0] || { income: 0 });
  if (highestIncomeMonth?.name) {
    observations.push({
      icon: Zap,
      text: `${highestIncomeMonth.name} was your highest income month at ${fmt(highestIncomeMonth.income)}.`,
      color: '#6366f1',
    });
  }

  return (
    <div className="insights-page">
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1>Financial Insights</h1>
          <p>Discover patterns and optimize your financial health</p>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div 
        className="metrics-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {[
          { icon: DollarSign, label: 'Total Income', value: totalIncome, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
          { icon: DollarSign, label: 'Total Expenses', value: totalExpenses, color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)' },
          { icon: TrendingUp, label: 'Net Savings', value: netSavings, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
          { icon: Percent, label: 'Savings Rate', value: parseFloat(savingsRate), color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', isPercent: true },
        ].map((metric, idx) => (
          <motion.div 
            key={idx}
            className="metric-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.12 + idx * 0.08 }}
            whileHover={{ y: -6, scale: 1.02, boxShadow: '0 12px 24px rgba(0,0,0,0.15)' }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="metric-icon" 
              style={{ backgroundColor: metric.bg, color: metric.color }}
              animate={{ rotate: 0 }}
              whileHover={{ rotate: 12, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            >
              <metric.icon size={20} />
            </motion.div>
            <div className="metric-content">
              <p className="metric-label">{metric.label}</p>
              <motion.h3 
                className="metric-value"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + idx * 0.08 }}
              >
                {metric.isPercent ? (
                  <><AnimatedCounter value={metric.value} suffix="%" /></>
                ) : (
                  <>${<AnimatedCounter value={Math.abs(metric.value)} />}</>
                )}
              </motion.h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Observations */}
      <motion.div 
        className="observations-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        <motion.h2 
          style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          Smart Observations
        </motion.h2>
        <div className="grid-2">
          {observations.map((obs, i) => (
            <motion.div 
              key={i} 
              className="card observation-card" 
              style={{ '--obs-color': obs.color }}
              initial={{ opacity: 0, y: 20, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              whileHover={{ y: -6, scale: 1.01, boxShadow: '0 12px 32px rgba(0,0,0,0.2)' }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.06, type: 'spring', stiffness: 100 }}
            >
              <motion.div 
                className="obs-icon"
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.15, rotate: 10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <obs.icon size={20} />
              </motion.div>
              <p>{obs.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Charts Grid */}
      <motion.div 
        className="charts-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {/* Monthly Comparison Chart */}
        <motion.div 
          className="card chart-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.45, type: 'spring', stiffness: 100 }}
          whileHover={{ y: -8, boxShadow: '0 16px 40px rgba(0,0,0,0.2)' }}
        >
          <motion.div 
            className="chart-header-row"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <div>
              <h3>Monthly Income vs Expenses</h3>
              <p className="chart-sub">Side-by-side comparison per month</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barGap={4}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.4} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(v) => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{v}</span>} />
                <Bar dataKey="income" name="Income" fill="url(#incomeGrad)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="url(#expenseGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Net Savings Trend */}
        <motion.div 
          className="card chart-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5, type: 'spring', stiffness: 100 }}
          whileHover={{ y: -8, boxShadow: '0 16px 40px rgba(0,0,0,0.2)' }}
        >
          <motion.div 
            className="chart-header-row"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.55 }}
          >
            <div>
              <h3>Net Savings Trend</h3>
              <p className="chart-sub">Monthly balance progression</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  name="Net Balance" 
                  stroke="#6366f1" 
                  strokeWidth={2.5}
                  fill="url(#balanceGradient)"
                  dot={{ r: 4, fill: '#6366f1' }} 
                  activeDot={{ r: 6 }}
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Category Breakdown Table */}
      <motion.div 
        className="card category-section"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6, type: 'spring', stiffness: 100 }}
        whileHover={{ y: -8, boxShadow: '0 16px 40px rgba(0,0,0,0.2)' }}
      >
        <motion.h3 
          style={{ marginBottom: 20, fontSize: 18, fontWeight: 600 }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.65 }}
        >
          Spending by Category
        </motion.h3>
        <div className="category-bars">
          {categoryData.map((cat, index) => {
            const pct = ((cat.value / totalExpenses) * 100).toFixed(1);
            return (
              <motion.div 
                key={cat.name} 
                className="cat-row"
                onHoverStart={() => setHoveredCategory(index)}
                onHoverEnd={() => setHoveredCategory(null)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.65 + index * 0.05 }}
                whileHover={{ x: 6, scale: 1.02 }}
              >
                <div className="cat-label">
                  <motion.span 
                    className="cat-dot" 
                    style={{ background: cat.color }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.3 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  />
                  <span>{cat.name}</span>
                </div>
                <div className="cat-bar-wrap">
                  <motion.div 
                    className="cat-bar" 
                    style={{ width: `${pct}%`, background: cat.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.7 + index * 0.08, ease: 'easeOut' }}
                    whileHover={{ 
                      opacity: 1,
                      boxShadow: `0 0 16px ${cat.color}`
                    }}
                  />
                </div>
                <div className="cat-values">
                  <motion.span 
                    className="cat-pct"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.75 + index * 0.08 }}
                  >
                    {pct}%
                  </motion.span>
                  <motion.span 
                    className="cat-amt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.08 }}
                  >
                    {fmt(cat.value)}
                  </motion.span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
