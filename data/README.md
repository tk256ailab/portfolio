# データファイル編集ガイド

このフォルダには、ポートフォリオサイトで使用する動的データが格納されています。
**毎月1日にこれらのファイルを更新してください。**

## 📋 目次

- [更新の流れ](#更新の流れ)
- [stats.json（統計データ）](#statsjson統計データ)
- [metadata.json（メタデータ）](#metadatajsonメタデータ)
- [projects.json（プロジェクト）](#projectsjsonプロジェクト)
- [blogs.json（ブログ）](#blogsjsonブログ)

---

## 🔄 更新の流れ

毎月1日に以下の手順で更新を行ってください：

1. **統計データの確認**
   - AtCoderのレーティング・参加回数を確認
   - Kaggleのランク・コンペ参加数を確認

2. **ファイルの更新**
   - `stats.json` - AtCoder/Kaggleの最新統計を入力
   - `projects.json` - 新しいプロジェクトがあれば追加
   - `blogs.json` - 新しいブログ記事があれば追加
   - `metadata.json` - 更新日とチェックリストを更新

3. **動作確認**
   - ローカルサーバーで表示を確認
   - すべての統計が正しく表示されているか確認

---

## 📊 stats.json（統計データ）

AtCoder、Kaggle、GitHubの統計情報を管理します。

### ファイル構造

```json
{
  "lastUpdated": "2025-01-14",
  "atcoder": {
    "username": "tk256ailab",
    "maxRating": 708,
    "contests": 27
  },
  "kaggle": {
    "username": "tk256ailab",
    "rank": "Contributor",
    "competitions": 8,
    "medals": {
      "gold": 0,
      "silver": 0,
      "bronze": 0
    }
  },
  "github": {
    "username": "tk256ailab",
    "note": "APIで自動取得。手動更新不要"
  }
}
```

### 更新方法

#### 1. AtCoderセクション

**確認先:** https://atcoder.jp/users/tk256ailab

更新項目：
- `maxRating` - 最高レーティング（過去最高）
- `contests` - 参加コンテスト数

**注意:** レーティングカラー（色）は最高レーティングから自動的に計算されるため、手動で設定する必要はありません。

**レーティングカラー対応表（自動計算）:**
| レート範囲 | 色 (JP) | 色 (EN) |
|-----------|---------|---------|
| < 400 | 灰色 | Gray |
| 400-799 | 茶色 | Brown |
| 800-1199 | 緑色 | Green |
| 1200-1599 | 水色 | Cyan |
| 1600-1999 | 青色 | Blue |
| 2000-2399 | 黄色 | Yellow |
| 2400-2799 | 橙色 | Orange |
| 2800+ | 赤色 | Red |

**更新例:**
```json
"atcoder": {
  "username": "tk256ailab",
  "maxRating": 850,        // 最高レート（プロフィールから確認）
  "contests": 30           // 参加回数（プロフィールから確認）
}
```

最高レートが850の場合、自動的に「緑色 (Green)」と表示されます。

#### 2. Kaggleセクション

**確認先:** https://www.kaggle.com/tk256ailab

更新項目：
- `rank` - 現在のランク（Novice/Contributor/Expert/Master/Grandmaster）
- `competitions` - 参加コンペティション数
- `medals.gold` - 金メダル数
- `medals.silver` - 銀メダル数
- `medals.bronze` - 銅メダル数

**更新例:**
```json
"kaggle": {
  "username": "tk256ailab",
  "rank": "Expert",        // プロフィールのランクを確認
  "competitions": 12,      // 参加コンペ数を確認
  "medals": {
    "gold": 0,
    "silver": 1,           // 銀メダルを1つ獲得した場合
    "bronze": 2            // 銅メダルを2つ獲得した場合
  }
}
```

#### 3. GitHubセクション

**⚠️ 注意:** GitHubの統計はAPIで自動取得されるため、**手動更新は不要です。**

```json
"github": {
  "username": "tk256ailab",
  "note": "APIで自動取得。手動更新不要"
}
```

#### 4. lastUpdatedフィールド

ファイルの先頭にある`lastUpdated`を更新日に変更してください。この日付はAtCoder統計の「最終更新」欄に自動的に表示されます。

```json
{
  "lastUpdated": "2025-02-01",  // 更新した日付（YYYY-MM-DD形式）
  ...
}
```

**表示形式:**
- 日本語: 2025年2月1日
- 英語: Feb 1, 2025

---

## 🗂️ metadata.json（メタデータ）

サイトのバージョン情報と更新チェックリストを管理します。

### ファイル構造

```json
{
  "site": {
    "version": "2.0.0",
    "lastUpdated": "2025-01-14",
    "description": "TK256のポートフォリオサイト - 毎月1日更新"
  },
  "dataUpdates": {
    "projects": "2025-01-14",
    "blogs": "2025-01-14",
    "stats": "2025-01-14"
  },
  "updateChecklist": {
    "statsUpdated": true,
    "projectsReviewed": true,
    "blogsAdded": true,
    "note": "毎月1日にこのチェックリストを確認してください"
  }
}
```

### 更新方法

#### 1. siteセクション

通常は`lastUpdated`のみ更新します。

```json
"site": {
  "version": "2.0.0",              // 大きな変更がない限り変更不要
  "lastUpdated": "2025-02-01",     // 更新日を変更
  "description": "TK256のポートフォリオサイト - 毎月1日更新"
}
```

**バージョン番号のルール:**
- メジャーバージョン (X.0.0) - サイト全体の大規模なリニューアル
- マイナーバージョン (2.X.0) - 新機能の追加、大きな改善
- パッチバージョン (2.0.X) - バグ修正、小さな改善

#### 2. dataUpdatesセクション

各データファイルを更新した日付を記録します。

```json
"dataUpdates": {
  "projects": "2025-02-01",  // projects.jsonを更新した場合
  "blogs": "2025-02-01",     // blogs.jsonを更新した場合
  "stats": "2025-02-01"      // stats.jsonを更新した場合
}
```

#### 3. updateChecklistセクション

毎月1日の更新チェックリストです。すべて完了したら`true`に設定してください。

```json
"updateChecklist": {
  "statsUpdated": true,        // stats.jsonを更新したらtrue
  "projectsReviewed": true,    // projects.jsonを確認したらtrue
  "blogsAdded": true,          // blogs.jsonを確認したらtrue
  "note": "毎月1日にこのチェックリストを確認してください"
}
```

---

## 🚀 projects.json（プロジェクト）

ポートフォリオに掲載するプロジェクト情報を管理します。

### 追加・更新方法

新しいプロジェクトを追加する場合、以下の形式で配列に追加してください：

```json
{
  "id": "unique-project-id",
  "title": "プロジェクトのタイトル",
  "description": "プロジェクトの説明文（2-3行程度）",
  "image": "assets/images/projects/project-name.jpg",
  "tags": ["Python", "Machine Learning", "Web"],
  "date": "2025-01",
  "github": "https://github.com/tk256ailab/project-name",
  "demo": "https://demo-url.com",
  "status": "active"
}
```

**フィールド説明:**
- `id` - 一意のID（英数字とハイフン）
- `title` - プロジェクト名
- `description` - 簡潔な説明
- `image` - サムネイル画像のパス（`assets/images/projects/`に配置）
- `tags` - 使用技術のタグ配列
- `date` - 作成年月（YYYY-MM形式）
- `github` - GitHubリポジトリURL（任意）
- `demo` - デモサイトURL（任意）
- `status` - `active`（進行中）または`completed`（完成）

---

## 📝 blogs.json（ブログ）

外部ブログサービス（Qiita、note）の記事情報を管理します。

### 追加方法

新しいブログ記事を追加する場合、以下の形式で配列に追加してください：

```json
{
  "id": "unique-blog-id",
  "title": "ブログ記事のタイトル",
  "description": "記事の概要（2-3行程度）",
  "image": "assets/images/blogs/thumbnail.jpg",
  "tags": ["Python", "Tutorial"],
  "date": "2025-01-15",
  "platform": "qiita",
  "url": "https://qiita.com/tk256ailab/items/xxxxx",
  "qiitaId": "xxxxx",
  "likes": 0
}
```

**プラットフォーム別の設定:**

### Qiitaの場合
```json
{
  "platform": "qiita",
  "url": "https://qiita.com/tk256ailab/items/xxxxx",
  "qiitaId": "xxxxx",  // URLの最後の部分
  "likes": 0           // 初期値は0（自動取得される）
}
```

### noteの場合
```json
{
  "platform": "note",
  "url": "https://note.com/tk256ailab/n/xxxxx",
  "noteId": "xxxxx",   // URLのn/以降の部分
  "likes": 0           // 初期値は0（自動取得される）
}
```

**フィールド説明:**
- `id` - 一意のID（英数字とハイフン）
- `title` - 記事タイトル
- `description` - 記事の概要
- `image` - サムネイル画像（任意）
- `tags` - 記事のタグ配列
- `date` - 公開日（YYYY-MM-DD形式）
- `platform` - `qiita`または`note`
- `url` - 記事のURL
- `qiitaId`/`noteId` - 記事ID
- `likes` - いいね数（初期値0、自動更新される）

---

## ⚠️ 注意事項

### JSON形式について

1. **カンマの配置に注意**
   ```json
   {
     "field1": "value1",  // ← カンマ必要
     "field2": "value2"   // ← 最後はカンマ不要
   }
   ```

2. **文字列は必ずダブルクォート**
   ```json
   "title": "正しい"     // ✅ 正しい
   'title': '間違い'     // ❌ 間違い
   ```

3. **数値はクォート不要**
   ```json
   "rating": 708        // ✅ 正しい
   "rating": "708"      // ❌ 間違い（文字列になる）
   ```

4. **真偽値は小文字**
   ```json
   "statsUpdated": true   // ✅ 正しい
   "statsUpdated": True   // ❌ 間違い
   ```

### 編集後の確認

ファイル編集後は必ず以下を確認してください：

1. **JSONフォーマットの確認**
   ```bash
   python3 -m json.tool data/stats.json
   ```
   エラーが出なければOKです。

2. **ローカルサーバーで動作確認**
   ```bash
   cd /Users/takeru/Desktop/portfolio
   python3 -m http.server 8000
   ```
   ブラウザで http://localhost:8000 を開いて表示を確認

3. **特に確認すべきページ**
   - トップページ: http://localhost:8000/
   - 自己紹介: http://localhost:8000/pages/about.html
   - プロジェクト: http://localhost:8000/pages/projects.html
   - ブログ: http://localhost:8000/pages/blogs.html

---

## 📅 月次更新チェックリスト

毎月1日に以下を実施してください：

- [ ] AtCoderの統計を更新（stats.json）
- [ ] Kaggleの統計を更新（stats.json）
- [ ] 新しいプロジェクトがあれば追加（projects.json）
- [ ] 新しいブログ記事があれば追加（blogs.json）
- [ ] metadata.jsonの更新日を変更
- [ ] metadata.jsonのチェックリストをすべてtrueに設定
- [ ] JSONフォーマットの確認（エラーがないか）
- [ ] ローカルサーバーで表示確認
- [ ] 問題なければGitHubにプッシュ

---

## 🆘 トラブルシューティング

### 統計が表示されない

1. JSONファイルの形式が正しいか確認
   ```bash
   python3 -m json.tool data/stats.json
   ```

2. ブラウザのコンソールでエラーを確認
   - F12キーでデベロッパーツールを開く
   - Consoleタブでエラーメッセージを確認

3. キャッシュをクリアして再読み込み
   - Cmd + Shift + R (Mac)
   - Ctrl + Shift + R (Windows/Linux)

### JSONフォーマットエラー

よくあるエラーと解決方法：

```
Error: Expecting ',' delimiter
→ カンマが不足しています。オブジェクトの各フィールドの間にカンマを入れてください。

Error: Expecting property name enclosed in double quotes
→ キーがダブルクォートで囲まれていません。すべてのキーを"key"の形式にしてください。

Error: Invalid escape character
→ 文字列内の特殊文字が正しくエスケープされていません。
```

### それでも解決しない場合

GitHubでIssueを作成するか、前回のバージョンに戻してください。

```bash
git log --oneline  # コミット履歴を確認
git checkout <前回のコミットID> data/stats.json  # 前回のバージョンに戻す
```

---

## 📚 参考リンク

- [JSON形式の基本](https://www.json.org/json-ja.html)
- [AtCoder](https://atcoder.jp/)
- [Kaggle](https://www.kaggle.com/)
- [GitHub](https://github.com/)

---

**最終更新日:** 2025-11-30

---

## 🆕 最近の変更

### 2025-11-30
- **タグフィルター機能改善**: タグボタンに件数表示を追加（例: "AI (3)"）
- **デバッグモード実装**: `assets/js/logger.js` による開発/本番環境の切り替え
- **セキュリティ強化**: 全外部リンクに `rel="noopener noreferrer"` を追加
- **画像最適化**: OGP画像を1200x630pxに最適化（1.2MBに圧縮）

---

**最終更新日:** 2025-11-30
