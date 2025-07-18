import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnalysisResult } from '../types';

export interface HistoryRecord {
  id: string;
  name: string;
  timestamp: string;
  imageSrc: string;
  results: AnalysisResult[];
}

interface HistoryState {
  records: HistoryRecord[];
  addRecord: (record: HistoryRecord) => void;
  clearHistory: () => void;
  deleteRecord: (id: string) => void;
  updateRecordName: (id: string, name: string) => void;
  setRecords: (records: HistoryRecord[]) => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      records: [],
      addRecord: (record) => set(state => ({ records: [record, ...state.records] })),
      clearHistory: () => set({ records: [] }),
      deleteRecord: (id) => set(state => ({ records: state.records.filter(r => r.id !== id) })),
      updateRecordName: (id, name) => set(state => ({
        records: state.records.map(r => r.id === id ? { ...r, name } : r)
      })),
      setRecords: (records) => set({ records }),
    }),
    { name: 'history-store' }
  )
);
