# Tailwind CSS コンポーネント

元のHTMLをTailwind CSSベースのコンポーネントに変換しました。

## ディレクトリ構成

```
/components/tailwind/
├── Header.html              # ヘッダーバナー（エリア表示付き）
├── Hero.html                # ヒーローセクション（タイトル + サマリーカードリスト）
├── SummaryCard.html         # ランキングサマリーカード（概要表示用）
├── RankingSection.html      # ランキングセクション全体
├── BrandCard.html           # ブランド詳細カード（詳細情報 + プラン）
├── ComparisonTable.html     # 比較テーブル
├── Footer.html              # フッター
└── README.md                # このファイル
```

## 各コンポーネントの説明

### 1. Header.html
- **用途**: ページ最上部のバナー
- **主要変数**:
  - `{{title}}` - ページタイトル
  - `{{bannerImage}}` - バナー画像URL
  - `{{areaName}}` - エリア名（例: 全国版）
  - `{{adText}}` - 広告表示テキスト

### 2. Hero.html
- **用途**: ヒーローセクション（メインタイトル + サマリーカードリスト）
- **主要変数**:
  - `{{labelText}}` / `{{copyText}}` / `{{mainTitle}}` - タイトル要素
  - `{{summaries}}` - サマリーカードの配列
- **繰り返し**: `{{#each summaries}}` でSummaryCardを展開

### 3. SummaryCard.html
- **用途**: ランキング概要カード（Hero内で使用）
- **主要変数**:
  - `{{rankBadge}}` - ランクバッジ画像
  - `{{brandName}}` - ブランド名
  - `{{stars}}` - 星評価の配列
  - `{{price}}` / `{{times}}` - 料金・回数情報
  - `{{machines}}` - 脱毛機の配列（name, activeプロパティ）

### 4. RankingSection.html
- **用途**: ランキングセクション全体のラッパー
- **主要変数**:
  - `{{sectionTitle}}` - セクションタイトル
  - `{{brands}}` - ブランドカードの配列
- **繰り返し**: `{{#each brands}}` でBrandCardを展開

### 5. BrandCard.html
- **用途**: ブランド詳細カード（RankingSection内で使用）
- **主要変数**:
  - `{{rankBadge}}` / `{{brandName}}` - 基本情報
  - `{{briefPoints}}` - 特徴ポイントの配列（heading, description）
  - `{{plans}}` - プランの配列（オプション、条件付き表示）

### 6. ComparisonTable.html
- **用途**: ブランド比較テーブル
- **主要変数**:
  - `{{brands}}` - ヘッダーに表示するブランド情報
  - `{{rows}}` - テーブル行の配列（label, valuesプロパティ）

### 7. Footer.html
- **用途**: ページフッター
- **主要変数**:
  - `{{links}}` - フッターリンクの配列（url, text）
  - `{{copyrightText}}` - 著作権表示

## 使用方法

### 1. Handlebars / Mustacheでの使用例

```javascript
// データ準備
const data = {
  title: 'メンズ・ヒゲ医療脱毛 徹底比較',
  bannerImage: '/images/banner.png',
  areaName: '全国版',
  adText: '広告',
  summaries: [
    {
      rankBadge: '/images/rank1.png',
      rankText: '第1位',
      brandName: 'エミナルクリニック',
      stars: ['/images/star.png', '/images/star.png', ...],
      scoreNumber: '4.8',
      scoreText: '/ 5.0',
      // ... その他
    }
  ]
};

// テンプレートコンパイル
const template = Handlebars.compile(heroTemplate);
const html = template(data);
```

### 2. 完全なページ構成例

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{pageTitle}}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 text-sm text-gray-700">
    <div class="relative max-w-2xl min-h-screen mx-auto bg-white shadow-md">
        <div id="main">
            {{> Header}}
            {{> Hero}}
            {{> RankingSection}}
            {{> ComparisonTable}}
        </div>
        {{> Footer}}
    </div>
</body>
</html>
```

## Tailwind CSS クラスについて

すべてのスタイルはTailwind CSSユーティリティクラスで実装されています。カスタムCSSは一切使用していません。

### 主要なクラスマッピング

| 元のCSS | Tailwind クラス |
|---------|----------------|
| `max-width: 640px` | `max-w-2xl` |
| `background: #fff` | `bg-white` |
| `color: #4d4949` | `text-gray-700` |
| `padding: 32px 16px` | `px-4 py-8` |
| `font-size: 14px` | `text-sm` |
| `font-weight: 700` | `font-bold` |
| `border-radius: 4px` | `rounded` |
| `display: flex` | `flex` |

### レスポンシブ対応

`md:` プレフィックスを使用してタブレット以上の画面サイズに対応：

```html
<div class="text-lg md:text-2xl">
    <!-- スマホ: text-lg、タブレット以上: text-2xl -->
</div>
```

## A/Bテスト対応

コンポーネントは独立しているため、簡単に差し替えできます。

### 例: Footer のバリエーション

```
/components/tailwind/
├── Footer_1.html    # シンプル版
├── Footer_2.html    # リンク多め版
└── Footer_3.html    # SNSアイコン付き版
```

使用時にパーシャル名を変更するだけ：

```javascript
// パターンA
{{> Footer_1}}

// パターンB
{{> Footer_2}}
```

## 注意事項

1. **Tailwind CDN**: 本番環境では Tailwind CLI でビルドすることを推奨
2. **画像**: すべての画像URLはprops化されているため、データ側で管理
3. **JS不要**: 動的な挙動（開閉など）は実装していません。必要に応じて Alpine.js などを追加してください。

## カスタマイズ

### 色の変更

Tailwind設定ファイル（tailwind.config.js）で独自カラーを定義できます：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand-primary': '#0693e3',
        'brand-secondary': '#324d6c',
      }
    }
  }
}
```

その後、クラスで使用：

```html
<div class="bg-brand-primary text-brand-secondary">
```

## ライセンス

このコンポーネント集は元のHTMLページを基に作成されています。
