// 曜日(0=日曜 ... 6=土曜)ごとの担当部位。土曜日は自由(担当部位なし)。
export const WEEKDAY_PARTS: (string | null)[] = [
  '腕', // 日
  '肩', // 月
  '胸', // 火
  '腹', // 水
  '背中', // 木
  '下半身', // 金
  null, // 土(自由)
];

export const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

// 新規ユーザーに最初から提示するデフォルトの部位候補。
export const DEFAULT_PARTS = ['腕', '肩', '胸', '腹', '背中', '下半身'];

// 部位の並び替え用インデックス(日曜始まりの曜日順)。未設定の部位は末尾。
export function partOrderIndex(part: string): number {
  const idx = WEEKDAY_PARTS.indexOf(part);
  return idx === -1 ? WEEKDAY_PARTS.length : idx;
}
