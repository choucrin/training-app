// その日の合計回数に応じたカレンダーセルの色の濃さレベル(0=未実施 ... 4=非常に多い)
export function getIntensityLevel(total: number): number {
  if (total <= 0) return 0;
  if (total < 20) return 1;
  if (total < 40) return 2;
  if (total < 70) return 3;
  return 4;
}
