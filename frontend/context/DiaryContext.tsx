
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DiaryEntry } from '../types';
import { mockDiaryEntries } from '../services/mockData';

interface DiaryContextType {
  entries: DiaryEntry[];
  addEntry: (entry: Omit<DiaryEntry, 'id'>) => void;
  deleteEntry: (id: string) => void;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const DiaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>(mockDiaryEntries);

  const addEntry = (newEntry: Omit<DiaryEntry, 'id'>) => {
    const entry: DiaryEntry = {
      ...newEntry,
      id: Math.random().toString(36).slice(2, 11),
    };
    // 日付順にソートして追加（新しい日付が先頭に来るように、またはグラフ描画時にソート）
    // ここでは単純に追加し、表示側でソートを任せる
    setEntries((prev) => [entry, ...prev]);
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter(e => e.id !== id));
  };

  return (
    <DiaryContext.Provider value={{ entries, addEntry, deleteEntry }}>
      {children}
    </DiaryContext.Provider>
  );
};

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (context === undefined) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
};
