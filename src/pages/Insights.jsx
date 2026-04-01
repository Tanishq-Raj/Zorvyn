import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';
import { Trophy, TrendingUp, TrendingDown, AlertCircle, Target, Zap } from 'lucide-react';
import useStore from '../store/useStore';
import { generateMonthlyData, generateCategorySpending, CATEGORY_COLORS } from '../data/mockData';
import './Insights.css';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

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
      <div className="page-header animate-fadeUp">
        <h1>Insights</h1>
        <p>Smart observations about your financial patterns</p>
      </div>

      {/* Observations */}
      <div className="grid-2 animate-fadeUp animate-delay-1">
        {observations.map((obs, i) => (
          <div key={i} className="card observation-card" style={{ '--obs-color': obs.color }}>
            <div className="obs-icon"><obs.icon size={18} /></div>
            <p>{obs.text}</p>
          </div>
        ))}
      </div>

      {/* Monthly Comparison Chart */}
      <div className="card chart-card animate-fadeUp animate-delay-2" style={{ marginTop: 20 }}>
        <div className="chart-header-row">
          <div>
            <h3>Monthly Income vs Expenses</h3>
            <p className="chart-sub">Side-by-side comparison per month</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(v) => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{v}</span>} />
            <Bar dataKey="income" name="Income" fill="#22c55e" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Net Savings Trend */}
      <div className="card chart-card animate-fadeUp animate-delay-3" style={{ marginTop: 16 }}>
        <div className="chart-header-row">
          <div>
            <h3>Net Savings Trend</h3>
            <p className="chart-sub">Monthly balance progression</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="balance" name="Net Balance" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1' }} activeDot={{ r: 7 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown Table */}
      <div className="card animate-fadeUp animate-delay-4" style={{ marginTop: 16, padding: 20 }}>
        <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>Category Breakdown</h3>
        <div className="category-bars">
          {categoryData.map((cat) => {
            const pct = ((cat.value / totalExpenses) * 100).toFixed(1);
            return (
              <div key={cat.name} className="cat-row">
                <div className="cat-label">
                  <span className="cat-dot" style={{ background: cat.color }} />
                  <span>{cat.name}</span>
                </div>
                <div className="cat-bar-wrap">
                  <div className="cat-bar" style={{ width: `${pct}%`, background: cat.color }} />
                </div>
                <div className="cat-values">
                  <span className="cat-pct">{pct}%</span>
                  <span className="cat-amt">{fmt(cat.value)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
