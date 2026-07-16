import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useExercises } from './hooks/useExercises';
import { useRecords } from './hooks/useRecords';
import { isFirebaseConfigured } from './firebase';
import { LoginScreen } from './components/LoginScreen';
import { FirebaseSetupNotice } from './components/FirebaseSetupNotice';
import { Header } from './components/Header';
import { CalendarView } from './components/CalendarView';
import { DayDetailModal } from './components/DayDetailModal';
import { AddRecordModal } from './components/AddRecordModal';
import { ExerciseManager } from './components/ExerciseManager';
import { todayString } from './dateUtils';
import type { Exercise } from './types';

export default function App() {
  const { user, loading, signIn, signOut } = useAuth();
  const uid = user?.uid ?? null;
  const { exercises, parts, addExercise, deleteExercise } = useExercises(uid);
  const { byDate, totalsByDate, getSortedRecordsForDate, addRecord, deleteRecord } = useRecords(uid);

  const [activeTab, setActiveTab] = useState<'calendar' | 'exercises'>('calendar');
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [addModalDate, setAddModalDate] = useState<string | null>(null);

  function changeMonth(delta: number) {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  function goToday() {
    const d = new Date();
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  async function handleAddRecord(input: { date: string; exercise: Exercise; reps: number }) {
    await addRecord({
      date: input.date,
      exerciseId: input.exercise.id,
      exerciseName: input.exercise.name,
      part: input.exercise.part,
      reps: input.reps,
    });
  }

  if (!isFirebaseConfigured) {
    return <FirebaseSetupNotice />;
  }

  if (loading) {
    return <div className="loading-screen">読み込み中...</div>;
  }

  if (!user) {
    return <LoginScreen onSignIn={signIn} />;
  }

  return (
    <div className="app">
      <Header
        userLabel={user.displayName ?? user.email ?? 'ユーザー'}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSignOut={signOut}
      />

      <main className="app-main">
        {activeTab === 'calendar' ? (
          <CalendarView
            year={year}
            month={month}
            byDate={byDate}
            totalsByDate={totalsByDate}
            onPrevMonth={() => changeMonth(-1)}
            onNextMonth={() => changeMonth(1)}
            onToday={goToday}
            onSelectDate={setSelectedDate}
            onAddForDate={setAddModalDate}
          />
        ) : (
          <ExerciseManager
            exercises={exercises}
            parts={parts}
            onAdd={addExercise}
            onDelete={deleteExercise}
          />
        )}
      </main>

      {selectedDate && (
        <DayDetailModal
          date={selectedDate}
          records={getSortedRecordsForDate(selectedDate)}
          onClose={() => setSelectedDate(null)}
          onAddClick={() => setAddModalDate(selectedDate)}
          onDelete={deleteRecord}
        />
      )}

      {addModalDate && (
        <AddRecordModal
          date={addModalDate}
          exercises={exercises}
          onClose={() => setAddModalDate(null)}
          onSubmit={handleAddRecord}
        />
      )}

      {activeTab === 'calendar' && !selectedDate && !addModalDate && (
        <button
          type="button"
          className="fab"
          aria-label="トレーニングを追加"
          onClick={() => setAddModalDate(todayString())}
        >
          +
        </button>
      )}
    </div>
  );
}
