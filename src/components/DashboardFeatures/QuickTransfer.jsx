import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, User, CheckCircle2, X, Phone, Mail, MapPin, CreditCard, TrendingUp, Calendar } from 'lucide-react';
import useStore from '../../store/useStore';
import './QuickTransfer.css';

const USERS = [
  { 
    id: 1, 
    name: 'Alex Johnson', 
    initial: 'A', 
    color: '#a5b4fc', 
    account: 'Visa •••• 4591',
    fullAccount: 'Visa Credit Card - 4591',
    balance: 12450.50,
    phone: '+1 (555) 123-4567',
    email: 'alex.johnson@email.com',
    address: '123 Main St, New York, NY 10001',
    accountType: 'Premium',
    joinDate: 'Jan 2022',
    transfers: [
      { date: '2024-03-28', amount: 500, status: 'completed' },
      { date: '2024-03-22', amount: 1250, status: 'completed' },
      { date: '2024-03-15', amount: 750, status: 'completed' },
      { date: '2024-03-08', amount: 2000, status: 'completed' },
    ]
  },
  { 
    id: 2, 
    name: 'Sarah Miller', 
    initial: 'S', 
    color: '#fca5a5', 
    account: 'Mastercard •••• 8214',
    fullAccount: 'Mastercard - 8214',
    balance: 8920.75,
    phone: '+1 (555) 234-5678',
    email: 'sarah.miller@email.com',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    accountType: 'Standard',
    joinDate: 'Jun 2023',
    transfers: [
      { date: '2024-03-26', amount: 350, status: 'completed' },
      { date: '2024-03-19', amount: 890, status: 'completed' },
      { date: '2024-03-12', amount: 1500, status: 'completed' },
    ]
  },
  { 
    id: 3, 
    name: 'Mike Brown', 
    initial: 'M', 
    color: '#86efac', 
    account: 'Checking •••• 1022',
    fullAccount: 'Checking Account - 1022',
    balance: 25630.25,
    phone: '+1 (555) 345-6789',
    email: 'mike.brown@email.com',
    address: '789 Pine Rd, Chicago, IL 60601',
    accountType: 'Premium Plus',
    joinDate: 'Mar 2021',
    transfers: [
      { date: '2024-03-27', amount: 2500, status: 'completed' },
      { date: '2024-03-20', amount: 1200, status: 'completed' },
      { date: '2024-03-13', amount: 3000, status: 'completed' },
      { date: '2024-03-06', amount: 1800, status: 'completed' },
    ]
  },
];

// Account Details Modal Component - Defined outside to avoid re-creation during render
const AccountDetailsModal = ({ user, onClose, onSendMoney }) => {
  const totalTransferred = user.transfers.reduce((sum, t) => sum + t.amount, 0);
  
  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="account-details-card"
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Professional Bank Card Header */}
          <div className="card-header">
            <motion.div 
              className="card-avatar"
              style={{ background: user.color }}
              whileHover={{ scale: 1.08 }}
            >
              {user.initial}
            </motion.div>
            <div className="card-header-content">
              <h2>{user.fullAccount}</h2>
              <p className="account-type">{user.accountType}</p>
            </div>
            <motion.button 
              className="close-btn"
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} />
            </motion.button>
          </div>

          {/* Scrollable Content Area */}
          <div className="card-content">
            {/* Balance Section - Premium styled */}
            <motion.div 
              className="balance-section"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="balance-label">Account Balance</span>
              <p className="balance-amount">${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </motion.div>

            {/* Account Details Grid - Professional layout */}
            <motion.div 
              className="details-grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <motion.div className="detail-item" whileHover={{ y: -4 }}>
                <div className="detail-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
                  <CreditCard size={20} />
                </div>
                <div className="detail-content">
                  <label className="detail-label">Account</label>
                  <span className="detail-value">{user.account}</span>
                </div>
              </motion.div>

              <motion.div className="detail-item" whileHover={{ y: -4 }}>
                <div className="detail-icon" style={{ background: 'rgba(249, 115, 22, 0.2)', color: '#f97316' }}>
                  <Phone size={20} />
                </div>
                <div className="detail-content">
                  <label className="detail-label">Phone</label>
                  <span className="detail-value">{user.phone}</span>
                </div>
              </motion.div>

              <motion.div className="detail-item" whileHover={{ y: -4 }}>
                <div className="detail-icon" style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#ec4899' }}>
                  <Mail size={20} />
                </div>
                <div className="detail-content">
                  <label className="detail-label">Email</label>
                  <span className="detail-value">{user.email}</span>
                </div>
              </motion.div>

              <motion.div className="detail-item" whileHover={{ y: -4 }}>
                <div className="detail-icon" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}>
                  <MapPin size={20} />
                </div>
                <div className="detail-content">
                  <label className="detail-label">Address</label>
                  <span className="detail-value">{user.address}</span>
                </div>
              </motion.div>

              <motion.div className="detail-item" whileHover={{ y: -4 }}>
                <div className="detail-icon" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#a855f7' }}>
                  <Calendar size={20} />
                </div>
                <div className="detail-content">
                  <label className="detail-label">Member Since</label>
                  <span className="detail-value">{user.joinDate}</span>
                </div>
              </motion.div>

              <motion.div className="detail-item" whileHover={{ y: -4 }}>
                <div className="detail-icon" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4' }}>
                  <TrendingUp size={20} />
                </div>
                <div className="detail-content">
                  <label className="detail-label">Total Transferred</label>
                  <span className="detail-value">${totalTransferred.toLocaleString('en-US')}</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Transfer History - Elegant list */}
            <motion.div 
              className="transfer-history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4>Recent Transfers</h4>
              <div className="history-list">
                {user.transfers.map((transfer, idx) => (
                  <motion.div 
                    key={idx}
                    className="history-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + idx * 0.05 }}
                    whileHover={{ x: 6 }}
                  >
                    <div className="history-date">
                      <span className="date-text">{new Date(transfer.date).toLocaleDateString()}</span>
                      <span className="status-badge">{transfer.status}</span>
                    </div>
                    <span className="history-amount">${transfer.amount.toLocaleString('en-US')}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="modal-actions">
            <motion.button 
              className="btn btn-primary"
              onClick={() => {
                onSendMoney(user.id);
                onClose();
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98, y: 0 }}
            >
              <Send size={18} />
              Send Money
            </motion.button>
            <motion.button 
              className="btn btn-secondary"
              onClick={onClose}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98, y: 0 }}
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function QuickTransfer() {
  const [selectedId, setSelectedId] = useState(1);
  const [detailsUserId, setDetailsUserId] = useState(null);
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success
  const addTransaction = useStore((s) => s.addTransaction);

  const handleTransfer = () => {
    const numAmount = parseFloat(amount);
    if (!selectedId || isNaN(numAmount) || numAmount <= 0) return;

    setStatus('loading');
    setTimeout(() => {
      const user = USERS.find((u) => u.id === selectedId);
      addTransaction({
        id: Date.now().toString(),
        description: `Transfer to ${user.name}`,
        amount: numAmount,
        category: 'Transfer',
        type: 'expense',
        date: new Date().toISOString(),
      });
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setAmount('');
      }, 2000);
    }, 600);
  };

  const handleSendMoneyFromModal = (userId) => {
    // Set the selected user and show a quick transfer prompt
    setSelectedId(userId);
    // You could also implement a different flow here if needed
  };

  return (
    <>
      <div className="card quick-transfer">
        <div className="chart-header" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: 15 }}>Quick Transfer</h3>
          <span className="chart-sub">Send money</span>
        </div>
        
        <div className="recent-users">
          {USERS.map((user) => {
            const isSelected = selectedId === user.id;
            return (
              <motion.div 
                key={user.id} 
                className={`user-avatar ${isSelected ? 'selected' : ''}`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedId(user.id)}
                onDoubleClick={() => setDetailsUserId(user.id)}
                title="Click to select, Double-click for details"
                style={{ 
                  backgroundColor: '#6366f1',
                  color: user.color, 
                  boxShadow: isSelected ? `0 4px 12px rgba(99, 102, 241, 0.4)` : '0 2px 4px rgba(0,0,0,0.1)',
                  border: isSelected ? '2px solid #fff' : '2px solid transparent',
                  opacity: isSelected ? 1 : 0.8,
                  cursor: 'pointer'
                }}
              >
                {user.initial}
              </motion.div>
            );
          })}
          <motion.div 
            className="user-avatar add-new"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{ backgroundColor: '#6366f1', color: '#a5b4fc', opacity: 0.8 }}
          >
            <User size={14} />
          </motion.div>
        </div>

        {/* Selected User Details */}
        <div style={{ minHeight: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {selectedId ? (
            <>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                To: {USERS.find((u) => u.id === selectedId)?.name}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', lineHeight: 1.3 }}>
                {USERS.find((u) => u.id === selectedId)?.account}
              </div>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#6366f1', marginTop: '4px' }}>
                💡 Double-click avatar to view full account details
              </div>
            </>
          ) : (
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>Select a recipient</div>
          )}
        </div>

        <div className="transfer-form">
          <label className="transfer-label">Amount</label>
          <div className="amount-input-wrap">
            <span className="currency-symbol">$</span>
            <input 
              type="number" 
              placeholder="0.00" 
              className="amount-input" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <motion.button 
            className="btn btn-primary w-full btn-pill"
            whileHover={{ scale: 1.02, boxShadow: '0 4px 16px rgba(99, 102, 241, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTransfer}
            disabled={status !== 'idle' || !amount}
            style={{ marginTop: '4px' }}
          >
            {status === 'loading' ? 'Processing...' : status === 'success' ? <><CheckCircle2 size={15} /> Sent!</> : <><Send size={15} /> Send Money</>}
          </motion.button>
        </div>
      </div>

      {/* Account Details Modal */}
      {detailsUserId && (
        <AccountDetailsModal 
          user={USERS.find(u => u.id === detailsUserId)} 
          onClose={() => setDetailsUserId(null)}
          onSendMoney={handleSendMoneyFromModal}
        />
      )}
    </>
  );
}
