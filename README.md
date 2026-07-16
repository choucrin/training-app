# 筋トレ記録アプリ

日々の筋トレ内容(種目・部位・回数)を記録し、カレンダーで振り返ることができるWebアプリです。
React + TypeScript + Vite で構築し、データの保存にはFirebase(Authentication / Firestore)を使用します。
ホスティングはGitHub Pagesを想定しています。

## 主な機能

- トレーニング内容(種目名・部位)の登録。部位は既存のものから選ぶか、新規追加できます
- その日行ったトレーニングを、種目と回数を選んで記録(1日に複数登録可能)
- 記録追加時の日付は当日がデフォルトですが、任意の日付に変更可能
- カレンダー表示。その日の合計回数に応じてマスの色の濃さが変化し、トレーニング量が多い日がひと目でわかります
- カレンダーの日付をタップすると、その日の記録一覧を確認できます
- 日付欄の「+」から直接その日の記録を追加できます
- その日の記録をテキスト形式(下記フォーマット)で出力し、ワンタップでコピーできます

```
7/13
・ショルダープレス(肩) 10
・サイドレイズ(肩) 5
・シュラッグ(肩) 15
```

- 曜日ごとにトレーニング部位を割り当て、記録一覧・テキスト出力の並び順に反映します

| 曜日 | 日 | 月 | 火 | 水 | 木 | 金 | 土 |
|---|---|---|---|---|---|---|---|
| 部位 | 腕 | 肩 | 胸 | 腹 | 背中 | 下半身 | 自由 |

  並び順は「①その曜日に割り当てられた部位 → ②日曜始まりの部位順」です。

- Googleアカウントでログインするため、iPhone・iPad・Windowsなど複数端末で同じ記録を同期できます

## 技術構成

- React 19 / TypeScript / Vite
- Firebase Authentication(Googleログイン)
- Cloud Firestore(データ保存、`users/{uid}/exercises` と `users/{uid}/records` にユーザーごとに保存)
- ホスティング: GitHub Pages(GitHub Actionsで自動ビルド・デプロイ)

## セットアップ手順

### 1. リポジトリの準備

まだGitリポジトリになっていない場合は初期化し、GitHubにリポジトリを作成してpushします。

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create <リポジトリ名> --public --source=. --push
```

### 2. Firebaseプロジェクトの作成

1. [Firebaseコンソール](https://console.firebase.google.com/)で新規プロジェクトを作成します。
2. 左メニューの「Authentication」→「Sign-in method」で **Google** プロバイダを有効化します。
3. 左メニューの「Firestore Database」から **Firestoreを作成**します(ロケーションは任意、本番モードで開始して問題ありません)。
4. 「プロジェクトの設定」→「全般」の下部にある「マイアプリ」で **ウェブアプリを追加**します(アプリのニックネームは任意、Firebase Hostingの設定は不要です)。
5. 表示される `firebaseConfig` の値(`apiKey` / `authDomain` / `projectId` / `storageBucket` / `messagingSenderId` / `appId`)を控えておきます。

### 3. Firestoreセキュリティルールの設定

このリポジトリの [`firestore.rules`](./firestore.rules) は、ログインユーザーが自分自身の `users/{uid}` 配下のデータのみ読み書きできるように制限しています。Firebaseコンソールの「Firestore Database」→「ルール」タブに、このファイルの内容を貼り付けて公開してください(Firebase CLIを使う場合は `firebase deploy --only firestore:rules` でも反映できます)。

### 4. Authenticationの承認済みドメインの追加

「Authentication」→「Settings」→「承認済みドメイン」に、GitHub Pagesの公開ドメイン(例: `<ユーザー名>.github.io`)を追加してください。これを行わないと、GitHub Pages上でGoogleログインが失敗します。

### 5. ローカル環境変数の設定

`.env.example` を `.env` にコピーし、手順2で控えた値を入力します(`.env` はコミットされません)。

```bash
cp .env.example .env
```

### 6. ローカルでの起動

```bash
npm install
npm run dev
```

`http://localhost:5173` にアクセスして動作を確認できます。

### 7. GitHub Pagesへのデプロイ設定

1. GitHubリポジトリの「Settings」→「Pages」で、Source を **GitHub Actions** に設定します。
2. 「Settings」→「Secrets and variables」→「Actions」で、以下のRepository secretsを登録します(値は手順2で控えたもの)。
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
3. `main` ブランチにpushすると、[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) が自動的にビルドしてGitHub Pagesへ公開します。手動で実行したい場合は「Actions」タブから `Deploy to GitHub Pages` を `Run workflow` してください。
4. 公開URL(`https://<ユーザー名>.github.io/<リポジトリ名>/`)は手順4の承認済みドメインに含まれている必要があります。

## 端末ごとの注意点

- **iPhone / iPad(Safari)**: ポップアップでのGoogleログインがブロックされた場合は、自動的にリダイレクト方式でのログインにフォールバックします。
- **Windows(Chrome / Edge)**: ポップアップでのログインが標準で利用できます。
- テキストのコピー機能は `navigator.clipboard` を優先的に使用し、利用できない環境では自動的に代替手段(`execCommand`)にフォールバックします。
- ホーム画面・デスクトップへの追加に対応しています。iPhone/iPadのSafariでは共有メニューから「ホーム画面に追加」、Windows(Chrome/Edge)ではアドレスバーのインストールアイコンから追加すると、専用アイコンで起動できます。

## ディレクトリ構成の補足

- `src/firebase.ts`: Firebaseの初期化・認証まわりの処理
- `src/hooks/`: Firestoreとのデータ連携(種目一覧・記録一覧)
- `src/components/`: カレンダー、日次詳細、記録追加、種目管理などのUIコンポーネント
- `src/constants.ts`: 曜日と部位の対応表などの定数
- `firestore.rules`: Firestoreセキュリティルール
- `public/manifest.webmanifest` / `public/pwa/`: ホーム画面・デスクトップ追加用のWebアプリマニフェストとアイコン画像。アイコンの元データは `design/icon-src/` のSVGで、`imagemagick` の `convert` コマンドで書き出しています
