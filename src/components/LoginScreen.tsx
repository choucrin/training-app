interface Props {
  onSignIn: () => void;
}

export function LoginScreen({ onSignIn }: Props) {
  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>筋トレ記録</h1>
        <p>Googleアカウントでログインすると、iPhone・iPad・Windowsなど複数の端末で記録を同期できます。</p>
        <button className="btn btn-primary" onClick={onSignIn}>
          Googleでログイン
        </button>
      </div>
    </div>
  );
}
