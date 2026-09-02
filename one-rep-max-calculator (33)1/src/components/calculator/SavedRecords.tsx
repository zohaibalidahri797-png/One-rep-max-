import React, { useState, useEffect } from 'react';
import { SavedRecord, CalculationResult, WeightUnit } from '../../types';
import { BookmarkCheck, Trash2, Download, ArrowUpRight, Calendar, Plus } from 'lucide-react';

interface SavedRecordsProps {
  onLoadRecord: (record: SavedRecord) => void;
}

const STORAGE_KEY = 'one_rep_max_saved_prs_v1';

export const SavedRecords: React.FC<SavedRecordsProps> = ({ onLoadRecord }) => {
  const [records, setRecords] = useState<SavedRecord[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecords(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved records', e);
    }
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save records to storage', e);
    }
  };

  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = ['Date', 'Exercise', '1RM', 'Weight', 'Reps', 'Unit', 'Formula', 'Notes'];
    const rows = records.map((r) => [
      r.date,
      `"${r.exercise}"`,
      r.oneRepMax,
      r.weight,
      r.reps,
      r.unit,
      `"${r.formula}"`,
      `"${r.notes || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `1rm-records-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (records.length === 0) {
    return null;
  }

  return (
    <div id="saved-records-section" className="bg-[#111317] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
            <BookmarkCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Saved Strength Log</h2>
            <p className="text-xs text-[#94a3b8]">Personal records preserved in browser storage</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#181b20] border border-white/10 text-xs font-mono text-[#94a3b8] hover:text-white hover:border-[#22c55e]/40 transition-all self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#22c55e]" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {records.map((rec) => (
          <div
            key={rec.id}
            onClick={() => onLoadRecord(rec)}
            className="p-4 rounded-xl bg-[#181b20] border border-white/5 hover:border-[#22c55e]/40 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#64748b] flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(rec.date).toLocaleDateString()}</span>
                </span>
                <button
                  type="button"
                  onClick={(e) => handleDelete(rec.id, e)}
                  className="text-[#64748b] hover:text-rose-400 p-1 transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="font-heading font-bold text-sm text-white group-hover:text-[#22c55e] transition-colors mt-2">
                {rec.exercise}
              </h4>
              <p className="text-xs text-[#94a3b8] font-mono mt-0.5">
                Set: {rec.weight} {rec.unit} × {rec.reps} reps ({rec.formula})
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-white/5 flex items-baseline justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">
                Estimated 1RM
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="font-heading font-extrabold text-xl text-white font-mono-num">
                  {rec.oneRepMax}
                </span>
                <span className="text-xs font-mono text-[#22c55e]">{rec.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
