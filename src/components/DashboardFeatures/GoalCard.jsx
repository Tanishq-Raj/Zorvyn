import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

export default function GoalCard() {
  const current = 12500;
  const target = 20000;
  const percentage = Math.min(100, Math.round((current / target) * 100));

  // Circle math
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div 
      className="card"
      whileHover={{ y: -4, boxShadow: 'var(--shadow)' }}
      style={{ padding: '24px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Emergency Fund</h3>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Target: $20,000</span>
        </div>
        <div style={{ padding: '8px', borderRadius: '12px', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
          <Target size={18} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px' }}>
          <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="40" cy="40" r={radius} fill="none" stroke="var(--border)" strokeWidth="6" />
            <motion.circle 
              cx="40" 
              cy="40" 
              r={radius} 
              fill="none" 
              stroke="#22c55e" 
              strokeWidth="6"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{percentage}%</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>$12,500</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Saved so far</div>
        </div>
      </div>
    </motion.div>
  );
}
