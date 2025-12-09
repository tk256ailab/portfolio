# タグカラー設定マニュアル

このマニュアルでは、ポートフォリオサイトのプロジェクトタグとブログタグに手動で色を設定する方法を説明します。

---

## 📋 目次

1. [概要](#概要)
2. [設定の流れ](#設定の流れ)
3. [手順1: タグ名の確認](#手順1-タグ名の確認)
4. [手順2: 色の選択](#手順2-色の選択)
5. [手順3: JavaScriptの編集](#手順3-javascriptの編集)
6. [手順4: CSSの編集](#手順4-cssの編集)
7. [手順5: 動作確認](#手順5-動作確認)
8. [実例](#実例)
9. [トラブルシューティング](#トラブルシューティング)

---

## 概要

タグに色を付けるには、以下の2つのファイルを編集する必要があります：

1. **`assets/js/filters.js`** - タグ名とCSSクラスのマッピングを定義
2. **`assets/css/components.css`** - タグの見た目（色、グラデーション）を定義

---

## 設定の流れ

```
タグ名の確認（JSONファイル）
    ↓
色の選択（TAG_COLOR_PALETTE.mdから）
    ↓
JavaScriptにマッピング追加（filters.js）
    ↓
CSSにスタイル追加（components.css）
    ↓
動作確認（ブラウザで確認）
```

---

## 手順1: タグ名の確認

### プロジェクトタグの確認

`data/projects.json`を開き、色を設定したいタグ名を確認します。

```json
{
  "id": 8,
  "title": "AtCoder",
  "tags": ["AtCoder", "Algorithm", "C++"],
  "category": "code"
}
```

この例では、`AtCoder`、`Algorithm`、`C++`の3つのタグがあります。

### ブログタグの確認

`data/blogs.json`を開き、色を設定したいタグ名を確認します。

```json
{
  "id": 1,
  "title": "FBX to VRMA Converter開発記",
  "tags": ["Blender", "Tool Development", "Animation"],
  "category": "blender"
}
```

### 注意事項

- タグ名は**大文字・小文字を区別しません**（内部で小文字に変換されます）
- 例: `"Python"`と`"python"`は同じタグとして扱われます
- スペースを含むタグ名も使用可能です（例: `"Machine Learning"`）

---

## 手順2: 色の選択

`docs/TAG_COLOR_PALETTE.md`を開き、30種類の色から適切なものを選びます。

**選択のポイント：**
- 技術の種類に応じた色を選ぶ
  - プログラミング言語: 青系、黄色系、緑系
  - AI/ML技術: 赤系、オレンジ系、パープル系
  - ツール/フレームワーク: グレー系、シアン系
- 既存のタグとのバランスを考える
- 読みやすさ（コントラスト）を確保する

---

## 手順3: JavaScriptの編集

### プロジェクトタグの場合

`assets/js/filters.js`を開き、**267行目付近**の`ProjectFilter`クラス内の`tagColorMap`を編集します。

#### 編集箇所

```javascript
class ProjectFilter extends BaseFilter {
  constructor() {
    super({
      gridSelector: '.projects-grid',
      searchInputId: 'project-search',
      tagFiltersId: 'project-tag-filters',
      dataUrl: 'data/projects.json',
      tagColorMap: {
        'python': 'tag-python',
        'javascript': 'tag-javascript',
        'react': 'tag-react',
        // ここに新しいタグを追加 ↓
        'atcoder': 'tag-atcoder',
        'algorithm': 'tag-algorithm',
        'c++': 'tag-cpp'
      }
    });
```

#### 追加ルール

1. **キー（左側）**: タグ名を**小文字**で記述
2. **値（右側）**: CSSクラス名（`tag-`で始める）
3. **区切り**: カンマで区切る（最後の行を除く）
4. **クォート**: シングルクォート`'`またはダブルクォート`"`で囲む

### ブログタグの場合

同じく`assets/js/filters.js`の**163行目付近**の`BlogFilter`クラス内の`tagColorMap`を編集します。

```javascript
class BlogFilter extends BaseFilter {
  constructor() {
    super({
      gridSelector: '.blog-grid',
      searchInputId: 'blog-search',
      tagFiltersId: 'blog-tag-filters',
      dataUrl: 'data/blogs.json',
      tagColorMap: {
        'ai': 'tag-ai',
        'machine learning': 'tag-ml',
        // ここに新しいタグを追加 ↓
        'blender': 'tag-blender'
      }
    });
```

---

## 手順4: CSSの編集

`assets/css/components.css`を開き、タグのスタイルを追加します。

### プロジェクトタグの場合

**953行目付近**（`/* Project Tag Colors */`コメントの下）に追加します。

#### 追加箇所

```css
/* Project Tag Colors - Vibrant Pastels with Gradients */
.project-tag.tag-python { background: linear-gradient(135deg, #a8d5ff 0%, #7fb3ff 100%); color: #2563eb; border: none; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.15); }
.project-tag.tag-javascript { background: linear-gradient(135deg, #fff7a8 0%, #ffed4e 100%); color: #d97706; border: none; box-shadow: 0 2px 4px rgba(217, 119, 6, 0.15); }

/* ここに新しいスタイルを追加 ↓ */
.project-tag.tag-atcoder { background: linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%); color: #4338ca; border: none; box-shadow: 0 2px 4px rgba(67, 56, 202, 0.15); }
.project-tag.tag-algorithm { background: linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%); color: #4338ca; border: none; box-shadow: 0 2px 4px rgba(67, 56, 202, 0.15); }
.project-tag.tag-cpp { background: linear-gradient(135deg, #d4d4d8 0%, #a1a1aa 100%); color: #18181b; border: none; box-shadow: 0 2px 4px rgba(24, 24, 27, 0.15); }
```

### ブログタグの場合

**2415行目付近**（`/* Blog Tag Colors */`コメントの下）に追加します。

```css
/* Blog Tag Colors - Vibrant Pastels (same as project tags) */
.blog-tag.tag-ai { background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%); color: #c2410c; box-shadow: 0 2px 4px rgba(194, 65, 12, 0.15); }

/* ここに新しいスタイルを追加 ↓ */
.blog-tag.tag-blender { background: linear-gradient(135deg, #d8b4fe 0%, #c084fc 100%); color: #7e22ce; box-shadow: 0 2px 4px rgba(126, 34, 206, 0.15); }
```

#### CSSの書き方

1. `.project-tag.`または`.blog-tag.`で始める
2. その後にJavaScriptで定義したCSSクラス名を続ける
3. `TAG_COLOR_PALETTE.md`からコピーしたCSSをそのまま貼り付ける
4. 1行にまとめる（改行しない）

---

## 手順5: 動作確認

### 1. ローカルサーバーの起動

```bash
cd /path/to/portfolio
python3 -m http.server 8000
```

### 2. ブラウザで確認

- プロジェクトページ: `http://127.0.0.1:8000/pages/projects.html`
- ブログページ: `http://127.0.0.1:8000/pages/blogs.html`

### 3. 確認ポイント

- [ ] タグが正しい色で表示されているか
- [ ] グラデーションが適用されているか
- [ ] テキストが読みやすいか
- [ ] ホバー時の挙動が正常か
- [ ] 他のタグとのバランスが取れているか

### 4. キャッシュのクリア

色が反映されない場合は、ブラウザのキャッシュをクリアします：

- **Chrome/Edge**: `Ctrl + Shift + R` (Windows) / `Cmd + Shift + R` (Mac)
- **Firefox**: `Ctrl + F5` (Windows) / `Cmd + Shift + R` (Mac)
- **Safari**: `Cmd + Option + E` → `Cmd + R`

---

## 実例

### 例1: AtCoderタグに色を付ける

#### ❶ タグ名の確認
`data/projects.json`:
```json
"tags": ["AtCoder", "Algorithm", "C++"]
```

#### ❷ 色の選択
`TAG_COLOR_PALETTE.md`から「16. Indigo Blue（インディゴブルー）」を選択。

#### ❸ JavaScriptの編集
`assets/js/filters.js`（274行目付近）:
```javascript
tagColorMap: {
  'python': 'tag-python',
  'javascript': 'tag-javascript',
  'atcoder': 'tag-atcoder',  // 追加
  'algorithm': 'tag-algorithm',  // 追加
  'c++': 'tag-cpp'  // 追加
}
```

#### ❹ CSSの編集
`assets/css/components.css`（953行目付近）:
```css
.project-tag.tag-atcoder { background: linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%); color: #4338ca; border: none; box-shadow: 0 2px 4px rgba(67, 56, 202, 0.15); }
.project-tag.tag-algorithm { background: linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%); color: #4338ca; border: none; box-shadow: 0 2px 4px rgba(67, 56, 202, 0.15); }
.project-tag.tag-cpp { background: linear-gradient(135deg, #d4d4d8 0%, #a1a1aa 100%); color: #18181b; border: none; box-shadow: 0 2px 4px rgba(24, 24, 27, 0.15); }
```

#### ❺ 動作確認
ブラウザで`http://127.0.0.1:8000/pages/projects.html`を開き、AtCoderプロジェクトのタグがインディゴブルーで表示されることを確認。

---

### 例2: Blenderタグに色を付ける

#### ❶ タグ名の確認
`data/blogs.json`:
```json
"tags": ["Blender", "Tool Development", "Animation"]
```

#### ❷ 色の選択
`TAG_COLOR_PALETTE.md`から「7. Violet Purple（バイオレットパープル）」を選択。

#### ❸ JavaScriptの編集
`assets/js/filters.js`（170行目付近）:
```javascript
tagColorMap: {
  'ai': 'tag-ai',
  'machine learning': 'tag-ml',
  'blender': 'tag-blender'  // 追加
}
```

#### ❹ CSSの編集
`assets/css/components.css`（2415行目付近）:
```css
.blog-tag.tag-blender { background: linear-gradient(135deg, #d8b4fe 0%, #c084fc 100%); color: #7e22ce; box-shadow: 0 2px 4px rgba(126, 34, 206, 0.15); }
```

#### ❺ 動作確認
ブラウザで`http://127.0.0.1:8000/pages/blogs.html`を開き、Blenderタグがバイオレットパープルで表示されることを確認。

---

## トラブルシューティング

### ❌ タグの色が変わらない

#### 原因1: JavaScriptのマッピングミス
- **確認**: `filters.js`のタグ名が小文字になっているか
- **確認**: CSSクラス名が正しく記述されているか
- **解決**: タグ名を小文字に変更し、クォートとカンマを確認

#### 原因2: CSSのクラス名ミス
- **確認**: JavaScriptで定義したクラス名とCSS側のクラス名が一致しているか
- **確認**: `.project-tag.`または`.blog-tag.`の接頭辞が正しいか
- **解決**: CSSクラス名をJavaScript側と一致させる

#### 原因3: ブラウザキャッシュ
- **解決**: `Ctrl + Shift + R`（Windows）/`Cmd + Shift + R`（Mac）でハードリロード

#### 原因4: CSSの構文エラー
- **確認**: セミコロン`;`が抜けていないか
- **確認**: 中括弧`{}`が正しく閉じられているか
- **解決**: ブラウザの開発者ツール（F12）のConsoleでエラーを確認

---

### ❌ タグが表示されない

#### 原因1: JSONファイルのタグ名ミス
- **確認**: `data/projects.json`または`data/blogs.json`にタグが正しく記載されているか
- **解決**: タグ名のスペルを確認

#### 原因2: JavaScriptエラー
- **確認**: ブラウザの開発者ツール（F12）のConsoleにエラーが表示されていないか
- **解決**: `filters.js`の構文エラーを修正（カンマ、クォートなど）

---

### ❌ レイアウトが崩れる

#### 原因: CSSの記述ミス
- **確認**: 複数行に分かれていないか（1つのタグは1行で記述）
- **確認**: 他のCSSルールを上書きしていないか
- **解決**: `TAG_COLOR_PALETTE.md`のフォーマットに従って1行で記述

---

### ❌ 色がデフォルト（青）のまま

#### 原因: tagColorMapに登録されていない
- **確認**: `filters.js`の`tagColorMap`にタグ名が追加されているか
- **解決**: JavaScriptの手順3を再度実行

---

## 📝 チェックリスト

新しいタグの色を追加する際は、以下をチェックしてください：

### JavaScript編集（filters.js）
- [ ] タグ名を**小文字**で記述した
- [ ] CSSクラス名を`tag-`で始めた
- [ ] カンマ`,`で区切った
- [ ] クォート`'`または`"`で囲んだ
- [ ] 最後の行にはカンマを付けていない

### CSS編集（components.css）
- [ ] `.project-tag.`または`.blog-tag.`で始めた
- [ ] JavaScriptで定義したクラス名と一致している
- [ ] `TAG_COLOR_PALETTE.md`から正しくコピーした
- [ ] **1行**で記述した
- [ ] セミコロン`;`で終了している

### 動作確認
- [ ] ローカルサーバーで確認した
- [ ] ブラウザキャッシュをクリアした
- [ ] タグが正しい色で表示されている
- [ ] グラデーションが適用されている
- [ ] テキストが読みやすい

---

## 🎨 カラーマッピング一覧（参考）

現在設定されている主要なタグと色の対応：

### プロジェクトタグ
| タグ名 | CSSクラス | 色系統 |
|--------|-----------|--------|
| Python | tag-python | スカイブルー |
| JavaScript | tag-javascript | サンシャインイエロー |
| React | tag-react | アクアシアン |
| Node.js | tag-nodejs | アクアシアン |
| Three.js | tag-threejs | スレートグレー |
| WebGL | tag-webgl | ローズピンク |
| VRM | tag-vrm | マゼンタピンク |
| Animation | tag-animation | バイオレットパープル |
| Machine Learning | tag-ml | コーラルレッド |
| Data Science | tag-datascience | オーシャンブルー |
| Kaggle | tag-kaggle | ティールシアン |
| OpenAI API | tag-openai | エメラルドグリーン |
| FastAPI | tag-fastapi | ライムグリーン |
| AI | tag-ai | ピーチオレンジ |

### ブログタグ
| タグ名 | CSSクラス | 色系統 |
|--------|-----------|--------|
| AI | tag-ai | ピーチオレンジ |
| Machine Learning | tag-ml | コーラルレッド |
| Deep Learning | tag-deep-learning | ラベンダーパープル |
| TensorFlow | tag-tensorflow | ピーチオレンジ |
| Blender | tag-blender | バイオレットパープル |
| Python | tag-python | スカイブルー |
| React | tag-react | アクアシアン |
| JavaScript | tag-javascript | サンシャインイエロー |

---

## 🔗 関連ドキュメント

- **TAG_COLOR_PALETTE.md**: 30種類のタグカラーデザイン集
- **data/projects.json**: プロジェクトデータとタグ定義
- **data/blogs.json**: ブログデータとタグ定義
- **assets/js/filters.js**: フィルタリングロジックとタグマッピング
- **assets/css/components.css**: タグのスタイル定義

---

## 📧 サポート

このマニュアルで解決しない問題がある場合は、以下を確認してください：

1. ブラウザの開発者ツール（F12）でエラーを確認
2. `filters.js`と`components.css`の構文エラーをチェック
3. `TAG_COLOR_PALETTE.md`のフォーマットに従っているか確認

---

**最終更新日**: 2025-12-08
