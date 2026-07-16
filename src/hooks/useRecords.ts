import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { TrainingRecord } from '../types';
import { getWeekday } from '../dateUtils';
import { WEEKDAY_PARTS, partOrderIndex } from '../constants';
import { toEquivalentReps } from '../recordFormat';

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
    const q = query(collection(db!, 'users', uid, 'records'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecords(
        snapshot.docs.map((d) => {
          const data = d.data() as Omit<TrainingRecord, 'id'>;
          return { ...data, unit: data.unit ?? 'reps', id: d.id };
        }),
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

  // 日付 -> その日の合計回数(カレンダーの色分け用)。時間記録は換算回数を用いる
  const totalsByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of records) {
      map.set(r.date, (map.get(r.date) ?? 0) + toEquivalentReps(r.reps, r.unit));
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
    unit: TrainingRecord['unit'];
  }) {
    if (!uid) return;
    // 同じ日付・同じ種目の記録が既にある場合は、新規登録せず回数を加算する
    const existing = (byDate.get(input.date) ?? []).find((r) => r.exerciseId === input.exerciseId);
    if (existing) {
      await updateDoc(doc(db!, 'users', uid, 'records', existing.id), {
        reps: existing.reps + input.reps,
      });
      return;
    }
    await addDoc(collection(db!, 'users', uid, 'records'), {
      ...input,
      createdAt: Date.now(),
    });
  }

  async function deleteRecord(id: string) {
    if (!uid) return;
    await deleteDoc(doc(db!, 'users', uid, 'records', id));
  }

  return { records, loading, byDate, totalsByDate, getSortedRecordsForDate, addRecord, deleteRecord };
}
