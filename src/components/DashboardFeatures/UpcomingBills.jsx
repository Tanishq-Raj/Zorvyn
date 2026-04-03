import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Home, Zap, Check } from 'lucide-react';
import useStore from '../../store/useStore';

const BILLS = [
  { id: 1, name: 'Internet Bill', amount: 89.99, date: 'Apr 12', icon: Wifi, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  { id: 2, name: 'Electricity', amount: 145.50, date: 'Apr 15', icon: Zap, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  { id: 3, name: 'Apartment Rent', amount: 1200.00, date: 'May 01', icon: Home, color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' },
];

export default function UpcomingBills() {
  const [bills, setBills] = useState(BILLS);
  const [payingId, setPayingId] = useState(null);
  const addTransaction = useStore((s) => s.addTransaction);

  const handlePay = (bill) => {
    setPayingId(bill.id);
    setTimeout(() => {
      addTransaction({
        id: Date.now().toString(),
        description: bill.name,
        amount: bill.amount,
        category: 'Bills',
        type: 'expense',
        date: new Date().toISOString(),
      });
      setBills((prev) => prev.filter((b) => b.id !== bill.id));
      setPayingId(null);
    }, 600);
  };

  return (
    <div className="card" style={{ padding: '24px' }}>
      <div className="chart-header" style={{ marginBottom: 20 }}>
        <h3>Upcoming Bills</h3>
        <span className="chart-sub">Due in next 30 days</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AnimatePresence>
          {bills.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: '12px 0' }}>
              All caught up! No upcoming bills.
            </motion.div>
          )}
          {bills.map((bill, i) => {
            const isPaying = payingId === bill.id;
            return (
              <motion.div 
                key={bill.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                transition={{ delay: i * 0.1 + 0.1 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: bill.bg, color: bill.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <bill.icon size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{bill.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Due {bill.date}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                    ${bill.amount.toFixed(2)}
                  </span>
                  <motion.button 
                    className="btn btn-primary btn-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePay(bill)}
                    disabled={payingId !== null}
                    style={{ padding: '6px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {isPaying ? <><Check size={12} /> Paid</> : 'Pay'}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
