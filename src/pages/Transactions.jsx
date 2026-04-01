import { useState, useMemo } from 'react';
import { Search, Plus, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Filter, X, Download } from 'lucide-react';
import useStore from '../store/useStore';
import TransactionModal from '../components/TransactionModal';
import { CATEGORIES } from '../data/mockData';
import './Transactions.css';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

function SortIcon({ col, sortBy, sortDir }) {
  if (sortBy !== col) return <ArrowUpDown size={13} className="sort-icon-neutral" />;
  return sortDir === 'asc' ? <ArrowUp size={13} className="sort-icon-active" /> : <ArrowDown size={13} className="sort-icon-active" />;
}

export default function Transactions() {
  const role = useStore((s) => s.role);
  const filters = useStore((s) => s.filters);
  const setFilter = useStore((s) => s.setFilter);
  const resetFilters = useStore((s) => s.resetFilters);
  const deleteTransaction = useStore((s) => s.deleteTransaction);
  const transactionsData = useStore((s) => s.transactions);
  const transactions = useMemo(() => {
    let result = [...transactionsData];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (tx) => tx.description.toLowerCase().includes(q) || tx.category.toLowerCase().includes(q)
      );
    }
    if (filters.category) result = result.filter((tx) => tx.category === filters.category);
    if (filters.type) result = result.filter((tx) => tx.type === filters.type);

    result.sort((a, b) => {
      let av = a[filters.sortBy];
      let bv = b[filters.sortBy];
      if (filters.sortBy === 'date') {
        av = new Date(av);
        bv = new Date(bv);
      }
      if (av < bv) return filters.sortDir === 'asc' ? -1 : 1;
      if (av > bv) return filters.sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactionsData, filters]);

  const [modal, setModal] = useState(null); // null | 'add' | {tx}
  const [showFilters, setShowFilters] = useState(false);

  const isAdmin = role === 'admin';

  const toggleSort = (col) => {
    if (filters.sortBy === col) {
      setFilter('sortDir', filters.sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setFilter('sortBy', col);
      setFilter('sortDir', 'desc');
    }
  };

  const exportCSV = () => {
    const header = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = transactions.map((tx) => [tx.date, tx.description, tx.category, tx.type, tx.amount]);
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasFilters = filters.search || filters.category || filters.type;

  return (
    <div className="transactions-page">
      <div className="page-header animate-fadeUp">
        <h1>Transactions</h1>
        <p>Manage and explore your financial activity</p>
      </div>

      {/* Controls */}
      <div className="tx-controls card animate-fadeUp animate-delay-1">
        <div className="tx-search-row">
          <div className="search-wrap">
            <Search size={15} className="search-icon" />
            <input
              id="tx-search"
              className="input search-input"
              placeholder="Search description or category..."
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
            />
            {filters.search && (
              <button className="btn btn-ghost btn-icon search-clear" onClick={() => setFilter('search', '')}>
                <X size={13} />
              </button>
            )}
          </div>
          <div className="tx-action-row">
            <button
              className={`btn btn-ghost ${showFilters ? 'filter-active' : ''}`}
              onClick={() => setShowFilters((v) => !v)}
            >
              <Filter size={14} />
              Filters {hasFilters && <span className="filter-dot" />}
            </button>
            <button className="btn btn-ghost" onClick={exportCSV}>
              <Download size={14} /> Export CSV
            </button>
            {isAdmin && (
              <button id="add-transaction-btn" className="btn btn-primary" onClick={() => setModal('add')}>
                <Plus size={15} /> Add Transaction
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="filter-row animate-fadeUp">
            <select id="filter-category" className="select filter-select" value={filters.category} onChange={(e) => setFilter('category', e.target.value)}>
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select id="filter-type" className="select filter-select" value={filters.type} onChange={(e) => setFilter('type', e.target.value)}>
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            {hasFilters && (
              <button className="btn btn-ghost btn-sm" onClick={resetFilters}>
                <X size={12} /> Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card animate-fadeUp animate-delay-2" style={{ marginTop: 16 }}>
        <div className="tx-count">
          <span>{transactions.length} transaction{transactions.length !== 1 ? 's' : ''}</span>
        </div>
        {transactions.length === 0 ? (
          <div className="empty-state">
            <Search size={40} />
            <p>No transactions match your filters</p>
            <button className="btn btn-ghost btn-sm" onClick={resetFilters}>Reset filters</button>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th onClick={() => toggleSort('date')}>
                    Date <SortIcon col="date" sortBy={filters.sortBy} sortDir={filters.sortDir} />
                  </th>
                  <th onClick={() => toggleSort('description')}>
                    Description <SortIcon col="description" sortBy={filters.sortBy} sortDir={filters.sortDir} />
                  </th>
                  <th>Category</th>
                  <th>Type</th>
                  <th onClick={() => toggleSort('amount')} style={{ textAlign: 'right', cursor: 'pointer' }}>
                    Amount <SortIcon col="amount" sortBy={filters.sortBy} sortDir={filters.sortDir} />
                  </th>
                  {isAdmin && <th style={{ textAlign: 'center' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13, whiteSpace: 'nowrap' }}>
                      {new Date(tx.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td style={{ fontWeight: 500 }}>{tx.description}</td>
                    <td><span className="category-pill">{tx.category}</span></td>
                    <td><span className={`badge badge-${tx.type}`}>{tx.type}</span></td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: tx.type === 'income' ? 'var(--income)' : 'var(--expense)' }}>
                      {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                    </td>
                    {isAdmin && (
                      <td>
                        <div className="action-btns">
                          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(tx)} title="Edit">
                            <Pencil size={13} />
                          </button>
                          <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteTransaction(tx.id)} title="Delete">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <TransactionModal
          onClose={() => setModal(null)}
          existing={modal === 'add' ? null : modal}
        />
      )}
    </div>
  );
}
