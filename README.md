# メモアプリ開発プロジェクト

このプロジェクトは、Next.jsという最新のWebアプリケーション開発技術を使って作られたメモアプリです。
パソコンやスマートフォンで使える、シンプルで使いやすいメモアプリを目指しています。

## このプロジェクトについて

- メモの作成、編集、削除が簡単にできます
- インターネットに接続していなくても使えます
- スマートフォンでもパソコンでも同じように使えます
- デザインがシンプルで見やすいです

## 開発環境の準備

このアプリを動かすには、以下のものが必要です：

1. パソコン（Windows、Mac、Linuxのどれでも大丈夫です）
2. Node.js（プログラムを動かすための環境）
3. pnpm（プログラムの部品を管理するツール）

## 環境変数の設定

このアプリを動かすには、Supabaseというデータベースサービスとの連携が必要です。
以下の手順で環境変数を設定してください：

1. プロジェクトのルートディレクトリに`.env.local`ファイルを作成
2. 以下の内容を追加（実際の値に置き換えてください）：

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 環境変数の取得方法

1. [Supabase](https://supabase.com)にログイン
2. プロジェクトを選択
3. 左側のメニューから「Project Settings」をクリック
4. 「API」セクションで以下の情報を確認：
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`の値として使用
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`の値として使用
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`の値として使用

### 重要な注意点

- `SUPABASE_SERVICE_ROLE_KEY`は**絶対に公開してはいけません**
- このキーはサーバー側でのみ使用し、クライアント側（ブラウザ）では使用しないでください
- `.env.local`ファイルがGitにコミットされないように注意してください
- `.gitignore`に`.env.local`が含まれていることを確認してください

## はじめ方

まず、開発サーバーを起動します：

```bash
pnpm dev
```

ブラウザで[http://localhost:3000](http://localhost:3000)を開くと結果が表示されます。

`app/page.tsx`を編集することでページの内容を変更できます。ファイルを編集すると、ページは自動的に更新されます。

このプロジェクトでは[`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)を使用して、Vercelの新しいフォントファミリーである[Geist](https://vercel.com/font)を自動的に最適化して読み込んでいます。

## アプリをインターネットに公開する方法（デプロイ）

このアプリを他の人も使えるようにするには、インターネット上に公開する必要があります。
これを「デプロイ」といいます。以下の手順で簡単に公開できます：

### 1. Vercelにアカウントを作る
1. [Vercel](https://vercel.com)のウェブサイトにアクセス
2. 「Sign Up」をクリックして、GitHubアカウントでログイン
   - GitHubアカウントがない場合は、先にGitHubでアカウントを作成してください

### 2. プロジェクトをアップロード
1. Vercelのダッシュボードで「New Project」をクリック
2. GitHubのリポジトリを選択
3. 環境変数の設定
   - 「Environment Variables」セクションで、以下の変数を設定：
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - 値は`.env.local`ファイルと同じものを使用
4. 設定はそのままで「Deploy」をクリック

### 3. デプロイ完了
- 数分待つと、アプリがインターネット上に公開されます
- 表示されるURLをクリックすると、あなたのアプリにアクセスできます
- このURLは他の人と共有できます

### 注意点
- 無料プランでも十分に使えます
- アプリの更新は、GitHubに変更をプッシュするだけで自動的に反映されます
- デプロイしたアプリは24時間365日、常に動いています
- 環境変数はVercelのダッシュボードでいつでも更新できます

## 詳細情報

Next.jsについてさらに学ぶには、以下のリソースをご覧ください：

- [Next.js ドキュメント](https://nextjs.org/docs) - Next.jsの機能とAPIについて学ぶ
- [Next.js チュートリアル](https://nextjs.org/learn) - インタラクティブなNext.jsチュートリアル

[Next.jsのGitHubリポジトリ](https://github.com/vercel/next.js)もご確認いただけます - フィードバックや貢献を歓迎します！

## Vercelへのデプロイ

Next.jsアプリをデプロイする最も簡単な方法は、Next.jsの開発元である[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)を使用することです。

詳細については[Next.jsのデプロイメントドキュメント](https://nextjs.org/docs/app/building-your-application/deploying)をご覧ください。
