import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { TrainingRecord } from '../types';
import { getWeekday } from '../dateUtils';
import { WEEKDAY_PARTS, partOrderIndex } from '../constants';

export function useRecords(uid: string | null) {
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setRecords([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(collection(db, 'users', uid, 'records'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecords(
        snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<TrainingRecord, 'id'>),
        })),
      );
      setLoading(false);
    });
    return unsubscribe;
  }, [uid]);

  // 日付 -> その日のレコード配列(登録順)
  const byDate = useMemo(() => {
    const map = new Map<string, TrainingRecord[]>();
    for (const r of records) {
      const list = map.get(r.date) ?? [];
      list.push(r);
      map.set(r.date, list);
    }
    return map;
  }, [records]);

  // 日付 -> その日の合計回数(カレンダーの色分け用)
  const totalsByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of records) {
      map.set(r.date, (map.get(r.date) ?? 0) + r.reps);
    }
    return map;
  }, [records]);

  function getSortedRecordsForDate(dateStr: string): TrainingRecord[] {
    const list = byDate.get(dateStr) ?? [];
    const assignedPart = WEEKDAY_PARTS[getWeekday(dateStr)];
    const primary = assignedPart ? list.filter((r) => r.part === assignedPart) : [];
    const rest = list
      .filter((r) => !(assignedPart && r.part === assignedPart))
      .slice()
      .sort((a, b) => partOrderIndex(a.part) - partOrderIndex(b.part));
    return [...primary, ...rest];
  }

  async function addRecord(input: {
    date: string;
    exerciseId: string;
    exerciseName: string;
    part: string;
    reps: number;
  }) {
    if (!uid) return;
    await addDoc(collection(db, 'users', uid, 'records'), {
      ...input,
      createdAt: Date.now(),
    });
  }

  async function deleteRecord(id: string) {
    if (!uid) return;
    await deleteDoc(doc(db, 'users', uid, 'records', id));
  }

  return { records, loading, byDate, totalsByDate, getSortedRecordsForDate, addRecord, deleteRecord };
}
