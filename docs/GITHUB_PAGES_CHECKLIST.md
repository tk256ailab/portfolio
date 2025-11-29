# GitHub Pages 公開前チェックリスト

このドキュメントは、GitHub Pagesで公開する前に修正・確認すべき項目をまとめたものです。

**最終更新日:** 2025-11-29

---

## ✅ 重要度：高（完了済み）

### 1. ✅ OGP画像の設定 【完了】

**実施内容:**
- OGP画像を `assets/images/profile/og-image.png` に配置
- 推奨サイズ 1200x630px に最適化（元6MBから1.2MBに削減）
- すべてのHTMLファイルでパスを更新
- オリジナルファイルを `og-image-original.png` としてバックアップ

**影響範囲:** すべてのHTMLファイル
**完了日:** 2025-11-30

---

### 2. ✅ 外部リンクのセキュリティ強化 【完了】

**実施内容:**
- すべての `target="_blank"` リンクに `rel="noopener noreferrer"` を追加
- 対象: ソーシャルリンク、ブログ記事リンク、プロジェクトリンク

**修正ファイル:**
- `index.html` - ソーシャルリンク6箇所
- `pages/about.html` - ソーシャルリンク6箇所
- `assets/js/filters.js` - 動的生成リンク（ブログ、プロジェクト）

**完了日:** 2025-11-30

---

## ✅ 重要度：中（完了済み）

### 3. ✅ console.logの制御 【完了】

**実施内容:**
- `assets/js/logger.js` を新規作成
- DEBUG フラグによるログ制御機能を実装
- 全JavaScriptファイル（7ファイル、86箇所）の console 呼び出しを logger に置換:
  - `console.log` → `logger.log`
  - `console.warn` → `logger.warn`
  - `console.error` → `logger.error` (常に表示)

**本番環境での無効化方法:**
```javascript
// assets/js/logger.js の先頭
const DEBUG = false; // false に設定するとログが無効化
```

**完了日:** 2025-11-30

---

### 4. ✅ README.mdの更新 【完了】

**実施内容:**
- ディレクトリ構造を最新版に更新（`data/`フォルダを追加、`main.js`削除）
- JavaScriptファイル一覧を正確に記載（`logger.js`, `app-initializer.js` など）
- コンテンツ編集方法をJSON編集ベースに変更
- `data/README.md` への参照を追加

**主な変更点:**
```markdown
## ✏️ コンテンツの編集方法

**重要**: すべてのコンテンツは `data/` フォルダ内のJSONファイルで管理されています。

- プロジェクト追加: `data/projects.json` を編集
- ブログ記事追加: `data/blogs.json` を編集
- 統計情報更新: `data/stats.json` を編集

詳細な更新手順は `data/README.md` を参照してください。
```

**完了日:** 2025-11-30

---

### 5. ✅ 画像のalt属性追加 【確認済み】

**確認結果:**
すべての画像に適切なalt属性が設定されていることを確認

**設定内容:**
- プロフィール画像: `alt="Profile Image"`
- ブログ画像 (filters.js): `alt="${blog.title}"`
- プロジェクト画像 (filters.js): `alt="${project.title}"`

**影響ファイル:**
- `index.html`
- `pages/about.html`
- `assets/js/filters.js` (動的生成)

**確認日:** 2025-11-30

---

## 📝 追加実装機能

### タグフィルターの改善

**実装内容:**
- タグフィルターボタンに件数を表示する機能を追加
- 例: 「AI (3)」「Python (5)」「すべて (12)」

**影響ファイル:**
- `assets/js/filters.js` - `generateTagFilters()` メソッドを更新

**完了日:** 2025-11-30

---

## ⚠️ 重要度：中（推奨修正）

---

## 📝 重要度：低（改善推奨）

### 6. ブラウザキャッシュの最適化が未設定

**問題:**
- 静的リソース（CSS、JS、画像）にキャッシュヘッダーが設定されていない
- GitHub Pagesのデフォルト設定に依存

**影響:**
- 初回以降の読み込み速度が最適化されていない可能性

**解決方法:**
GitHub Pagesは自動的にキャッシュヘッダーを設定しますが、より細かい制御が必要な場合:
1. Service Workerの導入を検討
2. HTMLファイルにリソースヒントを追加:
```html
<link rel="preconnect" href="https://cdnjs.cloudflare.com">
<link rel="preload" href="assets/css/base.css" as="style">
<link rel="preload" href="assets/js/app-initializer.js" as="script">
```

---

### 7. Faviconが設定されていない

**問題:**
- サーバーログに404エラーが記録されている: `GET /favicon.ico HTTP/1.1" 404`
- ブラウザタブにデフォルトアイコンが表示される

**解決方法:**
1. favicon.icoを作成（16x16, 32x32, 48x48の複数サイズ）
2. ルートディレクトリに配置
3. HTMLの`<head>`に以下を追加:
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
```

---

### 8. 言語設定の明示化

**問題:**
- HTMLの`lang`属性が`en`だが、コンテンツは日本語優先
- 検索エンジンが正しい言語を判定できない可能性

**現状:**
```html
<html lang="en">  <!-- すべてのページ -->
```

**推奨:**
```html
<html lang="ja">  <!-- 日本語優先の場合 -->

<!-- または多言語対応を明示 -->
<html lang="ja">
<head>
  <link rel="alternate" hreflang="en" href="https://tk256ailab.github.io/portfolio/?lang=en">
  <link rel="alternate" hreflang="ja" href="https://tk256ailab.github.io/portfolio/?lang=ja">
</head>
```

---

### 9. 404ページが未作成

**問題:**
- 存在しないページにアクセスした際のユーザー体験が悪い
- GitHub Pagesのデフォルト404ページが表示される

**解決方法:**
`404.html` をルートディレクトリに作成:
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>404 - ページが見つかりません | TK256 Portfolio</title>
    <link rel="stylesheet" href="assets/css/base.css">
</head>
<body>
    <div class="error-page">
        <h1>404</h1>
        <p>お探しのページが見つかりませんでした</p>
        <a href="/">トップページに戻る</a>
    </div>
</body>
</html>
```

---

### 10. robots.txt が未設定

**問題:**
- 検索エンジンのクロール制御ができていない
- 不要なページがインデックスされる可能性

**解決方法（任意）:**
`robots.txt` をルートディレクトリに作成:
```txt
User-agent: *
Allow: /
Disallow: /components/
Disallow: /data/
Disallow: /.claude/

Sitemap: https://tk256ailab.github.io/portfolio/sitemap.xml
```

---

## ✅ 確認済み（問題なし）

以下の項目は確認済みで、問題ありませんでした：

### セキュリティ
- ✅ APIキーやシークレットの露出なし
- ✅ 環境変数ファイルが.gitignoreに含まれている
- ✅ localhostやローカルパスへの参照なし

### データ整合性
- ✅ すべてのJSONファイルが有効な形式
- ✅ data/stats.json
- ✅ data/projects.json
- ✅ data/blogs.json
- ✅ data/metadata.json

### 設定ファイル
- ✅ .gitignoreが適切に設定されている
- ✅ 不要なファイル（.DS_Store等）が除外されている

### リソース
- ✅ 必要な画像ファイルが存在（12ファイル）
- ✅ CSSファイルサイズが適切（合計3,042行）

### エラーハンドリング
- ✅ try-catchブロックが適切に使用されている（14箇所）
- ✅ error-handler.jsで全体的なエラーキャッチを実装

---

## 🚀 公開前の最終チェックリスト

公開する前に、以下を確認してください：

- [ ] **必須**: OGP画像（og-image.png）を作成・配置
- [ ] **必須**: すべての外部リンクに `rel="noopener noreferrer"` を追加
- [ ] **推奨**: console.logを削除または環境変数で制御
- [ ] **推奨**: README.mdを最新版に更新
- [ ] **推奨**: 画像にalt属性を追加
- [ ] **任意**: favicon.icoを作成・配置
- [ ] **任意**: 404.htmlを作成
- [ ] **任意**: robots.txtを作成

### テスト手順

1. **ローカルテスト**
   ```bash
   python3 -m http.server 8000
   ```
   - すべてのページが正しく表示されるか
   - リンクが機能するか
   - 画像が読み込まれるか
   - JavaScriptエラーがないか（F12 → Console）

2. **GitHub Pagesテスト**
   - リポジトリにプッシュ後、数分待つ
   - `https://tk256ailab.github.io/portfolio/` にアクセス
   - すべてのページを確認
   - モバイルデバイスでも確認

3. **OGP確認**
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - OGP画像が正しく表示されるか

4. **パフォーマンステスト**
   - [PageSpeed Insights](https://pagespeed.web.dev/)
   - [Lighthouse](https://developer.chrome.com/docs/lighthouse/)

---

## 📚 参考リンク

- [GitHub Pages Documentation](https://docs.github.com/pages)
- [Open Graph Protocol](https://ogp.me/)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

---

**作成日:** 2025-11-29
**レビュー実施者:** Claude Code
