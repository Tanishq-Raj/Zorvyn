import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import './SummaryCard.css';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function SummaryCard({ icon: Icon, label, value, trend, trendLabel, color, delay = 0 }) {
  const isPercent = typeof value === 'string' && value.includes('%');
  const displayValue = isPercent ? value : fmt(value);

  return (
    <motion.div 
      className="card summary-card"
      whileHover={{ y: -4, scale: 1.02, boxShadow: 'var(--shadow)' }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="summary-card-header">
        <div className="summary-icon" style={{ '--card-color': color }}>
          <Icon size={18} />
        </div>
        <span className="summary-label">{label}</span>
      </div>
      <div className="summary-value">{displayValue}</div>
      {trendLabel && (
        <div className={`summary-trend ${trend > 0 ? 'positive' : trend < 0 ? 'negative' : 'neutral'}`}>
          {trend > 0 ? <TrendingUp size={13} /> : trend < 0 ? <TrendingDown size={13} /> : <Minus size={13} />}
          <span>{trendLabel}</span>
        </div>
      )}
    </motion.div>
  );
}
