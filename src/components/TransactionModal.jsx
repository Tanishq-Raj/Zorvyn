import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import useStore from '../store/useStore';
import { CATEGORIES } from '../data/mockData';

const EMPTY = { description: '', amount: '', category: CATEGORIES[0], type: 'expense', date: '' };

export default function TransactionModal({ onClose, existing }) {
  const { addTransaction, editTransaction } = useStore();
  const [form, setForm] = useState(existing || { ...EMPTY, date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    if (existing) setForm(existing);
  }, [existing]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const tx = { ...form, amount: parseFloat(form.amount) };
    if (existing) editTransaction(existing.id, tx);
    else addTransaction(tx);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{existing ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Description</label>
              <input
                className="input"
                required
                placeholder="e.g. Monthly Salary"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Amount ($)</label>
                <input
                  className="input"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => set('amount', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  className="input"
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => set('date', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select className="select" value={form.category} onChange={(e) => set('category', e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Type</label>
                <select className="select" value={form.type} onChange={(e) => set('type', e.target.value)}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {existing ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
