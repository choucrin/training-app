export interface Exercise {
  id: string;
  name: string;
  part: string;
  createdAt: number;
}

export interface TrainingRecord {
  id: string;
  date: string; // YYYY-MM-DD
  exerciseId: string;
  exerciseName: string;
  part: string;
  reps: number;
  createdAt: number;
}
