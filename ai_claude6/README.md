# AI Claude3 画像ビルドツール

`img/` または `svg/` ディレクトリに配置した画像を自動的に Base64 エンコードして、`index.html` と `custom-style.css` に埋め込むビルドツールです。

## 使い方

### 1. 画像を配置

```bash
# img/ ディレクトリに画像を配置
ai_claude3/
├── img/
│   ├── logo.png
│   ├── hero.jpg
│   └── icon.webp
└── svg/
    └── logo.svg
```

### 2. ビルド実行

```bash
cd ai_claude3
npm run build
```

### 3. 結果

- `index.html` 内の `<img src="img/logo.png">` が `<img src="data:image/png;base64,iVBORw...">` に置換されます
- `custom-style.css` 内の `url(img/logo.png)` も同様に置換されます
- 元のファイルは `.original` 拡張子で自動バックアップされます

## サポート形式

- PNG (`.png`)
- JPEG (`.jpg`, `.jpeg`)
- GIF (`.gif`)
- WebP (`.webp`)
- SVG (`.svg`)
- BMP (`.bmp`)
- ICO (`.ico`)

## コマンド

```bash
# ビルド実行
npm run build

# 元のファイルに復元
npm run restore
```

## 注意事項

- **初回ビルド時のみバックアップが作成されます**
- 元に戻す場合は `npm run restore` を実行してください
- 画像が大きいと HTML ファイルサイズが増大します（推奨: 各画像 < 100KB）

## 例

### HTML の場合

**ビルド前:**
```html
<img src="img/logo.png" alt="ロゴ">
<div style="background-image: url(img/hero.jpg)"></div>
```

**ビルド後:**
```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." alt="ロゴ">
<div style="background-image: url(data:image/jpeg;base64,/9j/4AAQSkZJRg...)"></div>
```

### CSS の場合

**ビルド前:**
```css
.header {
  background-image: url(img/logo.png);
}
```

**ビルド後:**
```css
.header {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...);
}
```

## トラブルシューティング

### 画像が置換されない場合

1. ファイル名が正確に一致しているか確認してください
2. HTML/CSS 内のパスが `img/` または `svg/` で始まっているか確認してください
3. ビルドログで置換件数を確認してください

### 元に戻したい場合

```bash
npm run restore
```

または手動で:

```bash
mv index.html.original index.html
mv custom-style.css.original custom-style.css
```
