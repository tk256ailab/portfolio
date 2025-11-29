# トラブルシューティングガイド

## 問題: ページの移動ができない

### 1. ローカルサーバーを起動しているか確認

**必須**: HTMLファイルを直接ブラウザで開くとCORSエラーが発生します。

```bash
# Python 3を使用
cd /Users/takeru/Desktop/portfolio
python3 -m http.server 8000

# その後、ブラウザで http://localhost:8000 にアクセス
```

### 2. ブラウザのコンソールを確認

1. ブラウザで開発者ツールを開く (F12 または Cmd+Option+I)
2. Console タブを確認
3. エラーメッセージがあれば確認

#### よくあるエラーと対処法:

**エラー: `Failed to load resource: net::ERR_FILE_NOT_FOUND`**
- 原因: ファイルのパスが間違っている
- 対処: 該当するファイルが正しい場所にあるか確認

**エラー: `CORS policy: No 'Access-Control-Allow-Origin'`**
- 原因: ローカルサーバーを起動していない
- 対処: 上記のコマンドでサーバーを起動

**エラー: `Uncaught TypeError: Cannot read property`**
- 原因: JavaScriptの読み込み順序が間違っている
- 対処: HTMLファイルのスクリプト読み込み順序を確認

### 3. ファイル構造を確認

```bash
tree -L 3 -I 'node_modules|.git'
```

以下の構造になっているか確認:

```
portfolio/
├── index.html
├── pages/
│   ├── about.html
│   ├── projects.html
│   └── blogs.html
├── assets/
│   ├── css/
│   │   ├── base.css
│   │   ├── components.css
│   │   └── animations.css
│   ├── js/
│   │   ├── components.js
│   │   ├── language.js
│   │   ├── filters.js
│   │   ├── animations.js
│   │   ├── stats.js
│   │   ├── navigation.js
│   │   └── main.js
│   └── images/
│       ├── profile/
│       ├── projects/
│       └── blogs/
└── components/
    ├── header.html
    ├── footer.html
    └── loading.html
```

### 4. 各ファイルの動作確認

#### テストページで確認:
```
http://localhost:8000/test.html
```

すべて "✓ OK" と表示されることを確認。

### 5. リンクが動作しない場合

#### index.htmlから他のページへ:
- `pages/about.html` をクリック → about ページに移動するはず
- 移動しない場合: ブラウザのコンソールでエラーを確認

#### pages内のページから index.html へ:
- ヘッダーの "Home" をクリック → トップページに移動するはず
- 移動しない場合: `components/header.html` と `assets/js/components.js` を確認

### 6. スタイルが適用されない場合

#### CSSファイルが読み込まれているか確認:
1. ブラウザの開発者ツール > Network タブ
2. ページをリロード
3. CSS ファイルがすべて Status 200 で読み込まれているか確認

#### 読み込みエラーの場合:
- パスが正しいか確認
- ファイルが実際に存在するか確認

### 7. JavaScriptが動作しない場合

#### スクリプトが読み込まれているか確認:
1. ブラウザの開発者ツール > Network タブ
2. JS フィルターを適用
3. すべてのJSファイルが Status 200 で読み込まれているか確認

#### 読み込み順序の確認:
```
1. components.js (最初)
2. language.js
3. filters.js
4. animations.js
5. stats.js
6. navigation.js
7. main.js (最後)
```

### 8. 画像が表示されない場合

#### 画像パスの確認:
- index.html: `assets/images/...`
- pages/*.html: `../assets/images/...`

#### 画像ファイルの確認:
```bash
ls assets/images/profile/
ls assets/images/projects/
ls assets/images/blogs/
```

### 9. 言語切替が動作しない場合

#### 確認項目:
1. ヘッダーに言語切替ボタン (JP/EN) が表示されているか
2. ボタンをクリックするとテキストが変わるか
3. コンソールに `Language set to: jp` のようなログが表示されるか

### 10. キャッシュをクリア

すべて試しても動作しない場合、ブラウザのキャッシュをクリア:

- **Chrome/Edge**: Cmd+Shift+Delete (Mac) / Ctrl+Shift+Delete (Windows)
- **Firefox**: Cmd+Shift+Delete (Mac) / Ctrl+Shift+Delete (Windows)
- **Safari**: Cmd+Option+E

## 緊急時の対処

### オリジナルファイルに戻す

リファクタリング前のファイルはまだ残っています:

```bash
# 元のファイル:
# - aboutme.html (元の about ページ)
# - projects.html (元の projects ページ)
# - blogs.html (元の blogs ページ)
# - css/style.css (元のCSS)
# - js/script.js (元のJS)
```

## よくある質問

### Q: localhost:8000 でアクセスできない
A:
1. サーバーが起動しているか確認: `lsof -ti:8000`
2. ポート8000が使われている場合は別のポートを使用: `python3 -m http.server 8001`

### Q: GitHub Pages にデプロイしたが表示されない
A:
1. リポジトリが public になっているか確認
2. Settings > Pages で正しいブランチとフォルダが選択されているか確認
3. 数分待ってから再度アクセス

### Q: 画像が GitHub Pages で表示されない
A:
1. 画像ファイル名の大文字小文字が一致しているか確認
2. 画像ファイルがコミットされているか確認: `git ls-files | grep images`

## サポート

問題が解決しない場合は、以下の情報を含めて報告してください:

1. ブラウザのコンソールに表示されるエラーメッセージ
2. ブラウザの種類とバージョン
3. アクセスしようとしているURL
4. 試した解決方法
