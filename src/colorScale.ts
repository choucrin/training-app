// その日の合計回数に応じたカレンダーセルの色の濃さレベル(0=未実施 ... 6=非常に多い、上限目安200)
export function getIntensityLevel(total: number): number {
  if (total <= 0) return 0;
  if (total < 15) return 1;
  if (total < 35) return 2;
  if (total < 70) return 3;
  if (total < 115) return 4;
  if (total < 160) return 5;
  return 6;
}
