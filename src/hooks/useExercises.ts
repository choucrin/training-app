import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Exercise } from '../types';
import { DEFAULT_PARTS } from '../constants';

export function useExercises(uid: string | null) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setExercises([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(collection(db, 'users', uid, 'exercises'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setExercises(
        snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Exercise, 'id'>),
        })),
      );
      setLoading(false);
    });
    return unsubscribe;
  }, [uid]);

  const parts = useMemo(() => {
    const set = new Set<string>(DEFAULT_PARTS);
    exercises.forEach((e) => set.add(e.part));
    return Array.from(set);
  }, [exercises]);

  async function addExercise(name: string, part: string) {
    if (!uid) return;
    await addDoc(collection(db, 'users', uid, 'exercises'), {
      name,
      part,
      createdAt: Date.now(),
      createdAtServer: serverTimestamp(),
    });
  }

  async function deleteExercise(id: string) {
    if (!uid) return;
    await deleteDoc(doc(db, 'users', uid, 'exercises', id));
  }

  return { exercises, parts, loading, addExercise, deleteExercise };
}
