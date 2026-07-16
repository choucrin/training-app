interface Props {
  userLabel: string;
  activeTab: 'calendar' | 'exercises';
  onTabChange: (tab: 'calendar' | 'exercises') => void;
  onSignOut: () => void;
}

export function Header({ userLabel, activeTab, onTabChange, onSignOut }: Props) {
  return (
    <header className="app-header">
      <h1>筋トレ記録</h1>
      <nav className="tabs">
        <button
          type="button"
          className={activeTab === 'calendar' ? 'tab active' : 'tab'}
          onClick={() => onTabChange('calendar')}
        >
          カレンダー
        </button>
        <button
          type="button"
          className={activeTab === 'exercises' ? 'tab active' : 'tab'}
          onClick={() => onTabChange('exercises')}
        >
          トレーニング管理
        </button>
      </nav>
      <div className="user-area">
        <span className="user-label">{userLabel}</span>
        <button type="button" className="btn btn-small" onClick={onSignOut}>
          ログアウト
        </button>
      </div>
    </header>
  );
}
