# HTMLテンプレート構成

このディレクトリには、メンズ医療脱毛ランキングページのHTMLテンプレートが含まれています。

## ディレクトリ構造

```
templates/
├── Header.html           # ページヘッダー
├── SearchPanel.html      # 検索パネル
├── RankingSummary.html   # ランキングサマリーセクション
├── RankingCard.html      # 個別ランキングカード
├── Footer.html           # フッター
└── README.md            # このファイル
```

## テンプレート一覧

### Header.html
ページの基本構造とヘッダー部分を含むテンプレート。

**Props:**
- `pageTitle`: ページタイトル

### SearchPanel.html
検索パネルのテンプレート。都道府県、対応部位、施設種別などの検索条件を含む。

**Props:**
- `prefectures[]`: 都道府県リスト
  - `value`: 都道府県の値
  - `name`: 都道府県名

### RankingSummary.html
ランキングサマリーセクションのテンプレート。TOP3のブランドを表示。

**Props:**
- `area`: 地域名 (例: "全国")
- `top3ImageSrc`: TOP3画像のソース
- `titleBottomImageSrc`: タイトル下部の画像ソース
- `summaryBrands[]`: サマリーブランド配列
  - `id`: ブランドID
  - `rankImageSrc`: ランク画像ソース
  - `brandName`: ブランド名
  - `brandLink`: ブランドリンク
  - `eventAction`: イベントアクション
  - `eventLabel`: イベントラベル
  - `rating`: 評価 (数値)
  - `starImageSrc`: 星画像ソース
  - `bannerImageSrc`: バナー画像ソース
  - `higeScoreImageSrc`: ヒゲスコア画像ソース
  - `higeTimes`: ヒゲ施術回数
  - `higePrice`: ヒゲ料金
  - `bodyScoreImageSrc`: 全身スコア画像ソース
  - `bodyTimes`: 全身施術回数
  - `bodyPrice`: 全身料金
  - `effectScoreImageSrc`: 効果スコア画像ソース
  - `effectComment`: 効果コメント
  - `painScoreImageSrc`: 痛みスコア画像ソース
  - `painComment`: 痛みコメント

### RankingCard.html
個別ランキングカードのテンプレート。各ブランドの詳細情報を表示。

**Props:**
- `brandId`: ブランドID
- `rankImageSrc`: ランク画像ソース
- `brandName`: ブランド名
- `brandLink`: ブランドリンク
- `eventAction`: イベントアクション
- `eventLabel`: イベントラベル
- `rating`: 評価 (数値)
- `starImageSrc`: 星画像ソース
- `briefs[]`: 特徴配列
  - `heading`: 見出し
  - `content`: 内容 (HTML可)
- `ctaCopy`: CTAコピー
- `ctaLeftImageSrc`: CTA左画像ソース
- `ctaRightImageSrc`: CTA右画像ソース
- `ctaButtonText`: CTAボタンテキスト
- `sections[]`: セクション配列 (オプション)
  - `title`: セクションタイトル
  - `content`: セクション内容 (HTML可)

### Footer.html
フッターとスクロールボタンを含むテンプレート。

**Props:**
- `companyUrl`: 運営者情報URL
- `currentYear`: 現在の年
- `siteName`: サイト名

## 使用方法

これらのテンプレートは、Handlebars形式の変数構文 `{{variable}}` と繰り返し構文 `{{#each array}}...{{/each}}` を使用しています。

### 基本的な変数の使用例

```html
<h1>{{pageTitle}}</h1>
```

### 配列のループ例

```html
{{#each brands}}
  <div class="brand">
    <h2>{{brandName}}</h2>
    <p>{{description}}</p>
  </div>
{{/each}}
```

### 条件分岐の例

```html
{{#if sections}}
  <div class="sections">
    <!-- セクション内容 -->
  </div>
{{/if}}
```

## 注意事項

1. **CSSクラス**: すべてのCSSクラス名は元のHTMLから保持されています
2. **DOM構造**: DOM構造は変更されていません
3. **画像**: 画像パスは変数として `{{imageSrc}}` の形式で置き換えられています
4. **イベントトラッキング**: `data-event-*` 属性は保持されています
5. **HTMLコンテンツ**: `{{{content}}}` の3重括弧は、HTMLをエスケープせずに出力します

## 統合例

完全なページを構築するには、以下の順序でテンプレートを組み合わせます:

```
Header.html
  → SearchPanel.html
  → RankingSummary.html
  → RankingCard.html (繰り返し)
  → Footer.html
```
