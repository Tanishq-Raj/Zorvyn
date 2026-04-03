import { useMemo, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart } from 'recharts';
import { Zap, Target, TrendingDown, AlertCircle, CheckCircle2, Lightbulb, Award, Flame, Clock, PiggyBank, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { generateMonthlyData, generateCategorySpending } from '../data/mockData';
import './Advisor.css';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

// Animated circular progress component
const HealthScore = ({ score, size = 260 }) => {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  
  const getScoreColor = (s) => {
    if (s >= 80) return '#22c55e';
    if (s >= 60) return '#84cc16';
    if (s >= 40) return '#f59e0b';
    return '#f43f5e';
  };

  const getScoreText = (s) => {
    if (s >= 80) return 'Excellent';
    if (s >= 60) return 'Good';
    if (s >= 40) return 'Fair';
    return 'Needs Work';
  };

  return (
    <div className="health-score-container">
      <svg width={size} height={size} viewBox="0 0 200 200" className="health-score-svg">
        <circle cx="100" cy="100" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
        <motion.circle
          cx="100"
          cy="100"
          r="45"
          fill="none"
          stroke={getScoreColor(score)}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 12px ${getScoreColor(score)})` }}
          animate={{
            strokeDashoffset: offset,
          }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <motion.div 
        className="health-score-text"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="score-number">{score}</div>
        <div className="score-label">{getScoreText(score)}</div>
      </motion.div>
    </div>
  );
};

export default function Advisor() {
  const { transactions } = useStore();
  const [expandedRecommendation, setExpandedRecommendation] = useState(0);

  const monthlyData = useMemo(() => generateMonthlyData(transactions), [transactions]);
  const categoryData = useMemo(() => generateCategorySpending(transactions), [transactions]);

  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  // Calculate Financial Health Score
  const calculateHealthScore = () => {
    let score = 50;
    
    if (savingsRate >= 20) score += Math.min(35, (savingsRate / 50) * 35);
    else score += (savingsRate / 20) * 35;
    
    const incomes = monthlyData.map(m => m.income).filter(i => i > 0);
    if (incomes.length > 1) {
      const avgIncome = incomes.reduce((a, b) => a + b) / incomes.length;
      const variance = incomes.reduce((sum, i) => sum + Math.pow(i - avgIncome, 2), 0) / incomes.length;
      const stability = Math.max(0, 100 - Math.sqrt(variance) / avgIncome);
      score += (stability / 100) * 15;
    }
    
    return Math.min(100, Math.round(score));
  };

  // Calculate expense trend
  const calculateExpenseTrend = () => {
    if (monthlyData.length < 2) return 0;
    const lastMonth = monthlyData[monthlyData.length - 1].expenses;
    const prevMonth = monthlyData[monthlyData.length - 2].expenses;
    return ((lastMonth - prevMonth) / prevMonth) * 100;
  };

  // Predict next month expenses
  const predictNextMonthExpenses = () => {
    if (monthlyData.length === 0) return 0;
    const lastThree = monthlyData.slice(-3).map(m => m.expenses);
    return lastThree.reduce((a, b) => a + b) / lastThree.length;
  };

  const healthScore = calculateHealthScore();
  const expenseTrend = calculateExpenseTrend();
  const predictedExpenses = predictNextMonthExpenses();

  // Generate AI Recommendations with enhanced logic
  const recommendations = [];
  
  if (savingsRate < 20) {
    recommendations.push({
      id: 1,
      title: 'Boost Your Savings Rate',
      description: `Your current savings rate is ${savingsRate.toFixed(1)}%. Financial experts recommend 20-30%.`,
      action: `Need to save ${fmt((0.2 * totalIncome - netSavings))} more monthly`,
      impact: 'Critical',
      color: '#ef4444',
      icon: TrendingDown,
      priority: 5,
    });
  }

  const topCategory = categoryData[0];
  if (topCategory && (topCategory.value / totalExpenses) > 0.3) {
    recommendations.push({
      id: 2,
      title: 'Optimize Spending Category',
      description: `${topCategory.name} is ${((topCategory.value / totalExpenses) * 100).toFixed(0)}% of your budget. Industry avg is 10-20%.`,
      action: `Reduce by 20% = Save ${fmt(topCategory.value * 0.2)}/month`,
      impact: 'High',
      color: '#f59e0b',
      icon: AlertCircle,
      priority: 4,
    });
  }

  const lastMonthExpense = monthlyData[monthlyData.length - 1]?.expenses || 0;
  const avgExpense = monthlyData.slice(-3).reduce((s, m) => s + m.expenses, 0) / Math.max(3, monthlyData.length);
  if (lastMonthExpense > avgExpense * 1.25) {
    recommendations.push({
      id: 3,
      title: 'Unusual Spending Detected',
      description: `You spent ${((lastMonthExpense / avgExpense - 1) * 100).toFixed(0)}% more than usual last month.`,
      action: `Plan to reduce to baseline: ${fmt(avgExpense * 0.95)}/month`,
      impact: 'Medium',
      color: '#f59e0b',
      icon: Flame,
      priority: 3,
    });
  }

  if (savingsRate >= 20 && healthScore >= 70) {
    recommendations.push({
      id: 4,
      title: 'Investment Opportunity',
      description: 'Your financial health is strong. Consider investing your surplus for long-term growth.',
      action: `Invest ${fmt(netSavings * 0.3)} monthly (30% of savings)`,
      impact: 'High',
      color: '#22c55e',
      icon: TrendingUp,
      priority: 4,
    });
  }

  recommendations.push({
    id: 5,
    title: 'Emergency Fund Status',
    description: `Build 3-6 months of expenses: ${fmt(avgExpense * 3)} - ${fmt(avgExpense * 6)}`,
    action: `Current savings rate covers ${(netSavings / avgExpense).toFixed(1)} months`,
    impact: 'High',
    color: '#6366f1',
    icon: Target,
    priority: 5,
  });

  // Add predictive recommendation
  if (expenseTrend > 5) {
    recommendations.push({
      id: 6,
      title: 'Spending Trend Alert',
      description: `Your expenses are trending up by ${expenseTrend.toFixed(1)}% month-over-month.`,
      action: `Next month projected: ${fmt(predictedExpenses)} (Plan and budget accordingly)`,
      impact: 'Medium',
      color: '#ec4899',
      icon: Activity,
      priority: 3,
    });
  }

  recommendations.sort((a, b) => b.priority - a.priority);

  // Financial Goals
  const financialGoals = [
    {
      id: 1,
      title: 'Emergency Fund',
      desc: '6 months of expenses',
      target: avgExpense * 6,
      current: netSavings > 0 ? netSavings : 0,
      icon: PiggyBank,
      color: '#6366f1',
    },
    {
      id: 2,
      title: 'Annual Savings',
      desc: '20% of annual income',
      target: totalIncome * 0.2,
      current: netSavings,
      icon: DollarSign,
      color: '#22c55e',
    },
    {
      id: 3,
      title: 'Debt Payoff',
      desc: 'No consumer debt',
      target: 100,
      current: Math.min(100, 65),
      icon: CheckCircle2,
      color: '#84cc16',
    },
    {
      id: 4,
      title: 'Investment',
      desc: 'Diversified portfolio',
      target: 50000,
      current: Math.min(50000, netSavings * 12),
      icon: TrendingUp,
      color: '#f59e0b',
    },
  ];

  // Savings opportunities
  const savingsPotential = useMemo(() => {
    return categoryData
      .map(cat => ({
        name: cat.name,
        current: cat.value,
        potential: cat.value * 0.15,
        color: cat.color,
      }))
      .sort((a, b) => b.potential - a.potential);
  }, [categoryData]);

  const totalSavingsPotential = savingsPotential.reduce((s, c) => s + c.potential, 0);

  // Spending patterns data for chart
  const spendingPatterns = monthlyData.map(m => ({
    name: m.name,
    expenses: m.expenses,
    income: m.income,
    savings: m.balance,
  }));

  return (
    <div className="advisor-page">
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1>AI Financial Advisor</h1>
          <p>Advanced analytics and personalized strategies for financial success</p>
        </div>
      </motion.div>

      {/* Key Metrics Cards */}
      <motion.div 
        className="metrics-overview"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {[
          { label: 'Monthly Income', value: fmt(totalIncome / monthlyData.length), icon: TrendingUp, color: '#22c55e' },
          { label: 'Monthly Expenses', value: fmt(avgExpense), icon: Flame, color: '#f43f5e' },
          { label: 'Savings Rate', value: `${savingsRate.toFixed(1)}%`, icon: Target, color: '#6366f1' },
          { label: 'Expense Trend', value: `${expenseTrend > 0 ? '+' : ''}${expenseTrend.toFixed(1)}%`, icon: Activity, color: expenseTrend > 0 ? '#f59e0b' : '#22c55e' },
        ].map((metric, idx) => (
          <motion.div
            key={idx}
            className="metric-overview-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12 + idx * 0.08 }}
            whileHover={{ y: -4 }}
          >
            <div className="metric-icon" style={{ backgroundColor: `${metric.color}15`, color: metric.color }}>
              <metric.icon size={20} />
            </div>
            <div className="metric-details">
              <span className="metric-label">{metric.label}</span>
              <span className="metric-value">{metric.value}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Health Score & Stats */}
      <motion.div 
        className="health-section card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <div className="health-header">
          <div>
            <h2>Financial Health Score</h2>
            <p>Comprehensive wellness assessment</p>
          </div>
        </div>
        <div className="health-content">
          <HealthScore score={healthScore} size={240} />
          <motion.div 
            className="health-metrics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <div className="metric-item">
              <span className="metric-label">Savings Rate</span>
              <span className="metric-value" style={{ color: savingsRate >= 20 ? '#22c55e' : '#f59e0b' }}>{savingsRate.toFixed(1)}%</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Monthly Savings</span>
              <span className="metric-value">{fmt(netSavings)}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Expense Ratio</span>
              <span className="metric-value">{((totalExpenses / totalIncome) * 100).toFixed(0)}%</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Next Month Est.</span>
              <span className="metric-value">{fmt(predictedExpenses)}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Spending Pattern Chart */}
      <motion.div 
        className="card chart-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2>Spending & Income Patterns</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={spendingPatterns} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px' }}
              labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
            />
            <Legend />
            <Bar dataKey="income" fill="#22c55e" radius={[6, 6, 0, 0]} opacity={0.8} />
            <Bar dataKey="expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} opacity={0.8} />
            <Line type="monotone" dataKey="savings" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recommendations Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>
          <Award size={20} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
          AI-Powered Recommendations
        </h2>
        <div className="recommendations-grid">
          {recommendations.map((rec, idx) => (
            <motion.div
              key={rec.id}
              className="card recommendation-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + idx * 0.06 }}
              whileHover={{ y: -8 }}
            >
              <div className="rec-header">
                <motion.div 
                  className="rec-icon"
                  style={{ backgroundColor: `${rec.color}20`, color: rec.color }}
                  whileHover={{ rotate: 12, scale: 1.1 }}
                >
                  <rec.icon size={20} />
                </motion.div>
                <div className="rec-title-content">
                  <h3>{rec.title}</h3>
                  <span className={`impact-badge impact-${rec.impact.toLowerCase()}`}>{rec.impact}</span>
                </div>
              </div>
              <p className="rec-description">{rec.description}</p>
              <motion.div 
                className="rec-action"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: expandedRecommendation === rec.id ? 1 : 0, height: expandedRecommendation === rec.id ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="action-content">{rec.action}</div>
              </motion.div>
              <motion.button
                className="rec-btn"
                onClick={() => setExpandedRecommendation(expandedRecommendation === rec.id ? -1 : rec.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {expandedRecommendation === rec.id ? '−' : '+'}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Financial Goals */}
      <motion.div 
        className="goals-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>
          <Target size={20} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
          Financial Goals & Progress
        </h2>
        <div className="goals-grid">
          {financialGoals.map((goal, idx) => {
            const progress = Math.min(100, (goal.current / goal.target) * 100);
            return (
              <motion.div
                key={goal.id}
                className="card goal-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + idx * 0.08 }}
                whileHover={{ y: -4 }}

              >
                <div className="goal-header">
                  <div className="goal-icon" style={{ backgroundColor: `${goal.color}20`, color: goal.color }}>
                    <goal.icon size={20} />
                  </div>
                  <div className="goal-title">
                    <h3>{goal.title}</h3>
                    <p>{goal.desc}</p>
                  </div>
                </div>
                <div className="goal-progress-section">
                  <div className="goal-progress-bar">
                    <motion.div
                      className="goal-progress-fill"
                      style={{ backgroundColor: goal.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.45 + idx * 0.08 }}
                    />
                  </div>
                  <div className="goal-stats">
                    <span className="goal-progress-text">{progress.toFixed(0)}%</span>
                    <span className="goal-amount">{fmt(goal.current)}/{fmt(goal.target)}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Savings Opportunities */}
      <motion.div 
        className="card savings-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2>Savings Opportunities Analysis</h2>
        <p className="section-sub">15% reduction potential by category</p>
        
        <div className="savings-bars">
          {savingsPotential.map((item, idx) => (
            <motion.div
              key={item.name}
              className="savings-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.45 + idx * 0.05 }}
              whileHover={{ x: 4 }}
            >
              <div className="savings-label">
                <span className="color-dot" style={{ backgroundColor: item.color }} />
                <div>
                  <div className="label-name">{item.name}</div>
                  <div className="label-current">Current: {fmt(item.current)}</div>
                </div>
              </div>
              <div className="savings-bar-wrap">
                <motion.div
                  className="savings-bar"
                  style={{ backgroundColor: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.current / (savingsPotential[0]?.current || 1)) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.5 + idx * 0.05 }}
                />
              </div>
              <motion.div 
                className="savings-potential"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 + idx * 0.05 }}
              >
                Save: {fmt(item.potential)}
              </motion.div>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="total-savings"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.75 }}
        >
          <Zap size={20} />
          <div>
            <span>Total Monthly Savings Potential</span>
            <span className="amount">{fmt(totalSavingsPotential)}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Action Plan */}
      <motion.div 
        className="card action-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
      >
        <h2>Personalized Action Plan</h2>
        <div className="action-steps">
          {[
            { step: 1, title: 'Analyze', desc: 'Review your spending patterns and identify areas to optimize', icon: Activity },
            { step: 2, title: 'Budget', desc: 'Create realistic monthly budget based on your income and goals', icon: PiggyBank },
            { step: 3, title: 'Automate', desc: 'Set up automatic transfers for savings and investments', icon: Clock },
            { step: 4, title: 'Monitor', desc: 'Track progress monthly and adjust strategies as needed', icon: Award },
          ].map((item, idx) => (
            <motion.div
              key={item.step}
              className="action-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + idx * 0.08 }}
              whileHover={{ x: 8 }}
            >
              <div className="step-number">{item.step}</div>
              <div className="step-content">
                <div className="step-icon">
                  <item.icon size={18} />
                </div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
