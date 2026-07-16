export function FirebaseSetupNotice() {
  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>Firebaseの設定が必要です</h1>
        <p>
          <code>.env</code> にFirebaseプロジェクトの設定値が入力されていません。
          <code>.env.example</code> を参考に、FirebaseコンソールのWebアプリ設定から
          各値をコピーして <code>.env</code> に貼り付けてください。設定後、開発サーバーの再起動が必要です。
        </p>
        <p className="muted">詳しい手順はREADME.mdの「Firebaseプロジェクトの作成」を参照してください。</p>
      </div>
    </div>
  );
}
