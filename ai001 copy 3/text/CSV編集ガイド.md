# CSV編集ガイド

サイトのテキストデータは複数のCSVファイルで管理されています。このガイドでは、各CSVファイルの役割と、データがHTMLのどこに表示されるかを説明します。

---

## CSVファイル一覧と表示箇所

| ファイル名 | 役割 | 主な表示箇所 |
|-----------|------|------------|
| common-text.csv | 共通テキスト | タブ名、ヘッダー、ボタン、タイトル部分 |
| service-text.csv | サービス比較表データ | ランキング比較表（総合/サービス/実績タブ） |
| service-basic-info.csv | 基本情報 | ランキングカード内の基本情報タブ |
| service-summary.csv | サマリー表 | トップページ上部のサマリーテーブル |
| service-detail.csv | サービス詳細 | ランキングカード内の特徴セクション |
| service-meta.csv | メタ情報 | サービス名、ロゴ、評価スコア |
| service-pricing.csv | 料金プラン | ランキングカード内の料金表 |
| service-reviews.csv | 口コミ | ランキングカード内の口コミセクション |
| service-cta.csv | CTAリンク | 公式サイトボタン、セミナーボタン |

---

## 1. common-text.csv

比較表のタブ名、ヘッダー名、ボタンテキストなどの共通テキストを管理します。

### ファイル構造

```csv
key,value
tab_0_name,総合
tab_1_name,サービス
...
```

### 編集可能な項目と表示箇所

#### タイトル部分（メインビジュアル）
- `title_label_1`, `title_label_2`, `title_label_3`: 「料金」「効果」「サポート」など
- `title_cross`: 区切り文字「×」
- `title_text`: 「で選ぶ」
- `title_marker`: 「おすすめ」（強調部分）
- `title_main`: 「生成AIスクール」（メインタイトル）

→ **表示場所**: トップページのメインビジュアルエリア

#### ランキング比較表
- `tab_0_name`, `tab_1_name`, `tab_2_name`: タブ名（総合/サービス/実績）
- `tab_0_header_1` ～ `tab_0_header_5`: タブ0のヘッダー（5列）
- `tab_1_header_1` ～ `tab_1_header_5`: タブ1のヘッダー（5列）
- `tab_2_header_1` ～ `tab_2_header_5`: タブ2のヘッダー（5列）
- `recommend_text`: 「おすすめ」ラベル
- `button_pc_text`: PC版ボタンテキスト「公式サイト<br>を見る」
- `button_sp_text`: スマホ版ボタンテキスト「公式<br>サイト」

→ **表示場所**: ランキング比較表（タブ切り替え式）

#### サマリーテーブル
- `summary_table_header_1`: 「料金」
- `summary_table_header_2`: 「実績・評判」
- `summary_table_header_3`: 「実務サポート」
- `summary_table_header_4`: 「無料セミナー」

→ **表示場所**: トップページ上部のサマリーテーブルヘッダー

#### ボタンテキスト
- `button_seminar_text`: 「無料<br/>セミナーに参加する」
- `button_detail_text`: 「詳細を見る +」

→ **表示場所**: サマリーセクションとランキングカード内のボタン

#### 基本情報タブ
- `basic_info_tab_1`: 「プラン」
- `basic_info_tab_2`: 「評判」
- `basic_info_tab_3`: 「特徴」
- `basic_info_tab_4`: 「支援」

→ **表示場所**: ランキングカード内の基本情報タブ

#### 基本情報ラベル
- `basic_info_learning_format`: 「利用者数」
- `basic_info_difficulty`: 「実績」
- `basic_info_lesson_time`: 「満足度」
- `basic_info_learning_style`: 「受講形式」
- `basic_info_support_hours`: 「コミュニティ」
- `basic_info_reservation_change`: 「その他」
- `basic_info_question_support`: 「サポート体制」
- `basic_info_career_support`: 「案件支援」
- `basic_info_refund_policy`: 「返金保証」

→ **表示場所**: ランキングカード内の基本情報テーブルの行ヘッダー

#### テーブルヘッダー
- `table_header_program`: 「コース」
- `table_header_total`: 「習得スキル」
- `table_header_per_session`: 「料金」
- `table_header_monthly`: 「月額」
- `table_header_monthly_note`: 注釈テキスト

→ **表示場所**: ランキングカード内の料金表ヘッダー

#### その他のUI要素
- `section_reviews`: 「受講者の口コミ」
- `label_overall_rating`: 「(総合評価)」
- `disclaimer`: 「※当サイトはプロモーションを含んでいます。」
- `filter_heading`: 「絞り込み検索」
- `monthly_plan_none`: 「対応なし」

→ **表示場所**: ランキングカード内、モーダル、フッターなど

#### サイト情報
- `site_name`: 「AI副業おすすめ比較.com」
- `site_description`: 「AI副業スクール・ツールを探すならAI副業比較ナビ」

→ **表示場所**: ヘッダー、フッター

#### フッター
- `footer_popular_schools`: 「人気スクール」
- `footer_management`: 「運営」
- `footer_company`: 「運営者情報」
- `footer_privacy`: 「プライバシーポリシー」
- `footer_disclaimer`: 「免責事項」
- `footer_contact`: 「お問い合わせ」

→ **表示場所**: フッターエリア

### 編集方法

1. Excelやスプレッドシートでファイルを開く
2. `value` 列のテキストを編集
3. CSV形式で保存（UTF-8エンコーディング推奨）

**注意**: `key` 列は変更しないでください。

---

## 2. service-text.csv

各サービスの比較表データを管理します。

### ファイル構造

```csv
service_id,service_name,logo_path,tab_index,col_index,cell_type,icon,value1,value1_color,value2,effect,effect_color,feature
shiftai,SHIFT AI,img/logo/shiftai.webp,0,1,value,ic_shape1.svg,"29,800円",red,基礎コース,,,
```

### 列の説明

- **service_id**: サービスの一意のID（例: shiftai, dmmai, samuraiai）
- **service_name**: サービス名（表示名）
- **logo_path**: ロゴ画像のパス
- **tab_index**: タブ番号（0=総合, 1=サービス, 2=実績）
- **col_index**: 列番号（1～3、サービス列と詳細列は除く）
- **cell_type**: セルのタイプ
  - `value`: 値を表示（価格、数値など）
  - `effect`: 効果テキスト（満足度、返金保証など）
  - `feature`: 特徴テキスト

### cell_type別の使用列

#### `value` タイプ
- **icon**: アイコンファイル名（例: ic_shape1.svg）
- **value1**: メイン値（例: 29,800円）
- **value1_color**: value1の色（red または black）
- **value2**: サブ値（例: 基礎コース）

#### `effect` タイプ
- **icon**: アイコンファイル名
- **effect**: 効果テキスト（例: かなり<br>高い）
- **effect_color**: effectの色（red または black）

#### `feature` タイプ
- **feature**: 特徴テキスト（HTMLタグ可能）

### 表示場所

→ **表示場所**: ランキング比較表の各タブ（総合/サービス/実績）内のセル

### サービスの追加方法

1. 新しいservice_idを決定（例: newservice）
2. ロゴ画像を `img/logo/` に配置
3. 各タブ（0, 1, 2）、各列（1, 2, 3）の組み合わせで行を追加
   - 例: newservice用に9行追加（3タブ × 3列）

### サービスの編集方法

1. service_idで対象サービスの行を検索
2. 該当するtab_indexとcol_indexの行を編集
3. セルタイプに応じて適切な列を編集

### HTMLタグの使用

- `<br>`: 改行
- `<span>`: 強調（背景色付き）

例: `圧倒的な実績の<br>AI副業<br><span>（高収入副業）</span>`

---

## 3. service-basic-info.csv

ランキングカード内の基本情報タブ（評判/特徴/支援）に表示される詳細データを管理します。

### ファイル構造

```csv
service_id,tab_index,col_index,value
shiftai,2,1,"オンライン・対面ハイブリッド"
shiftai,2,2,"<p class='compareTable__icon compareTable__icon--shape'><img alt='' src='img/icon/pain_face_blue.webp'/></p><span class='compareTable__descNum'>初級～中級</span>"
shiftai,2,3,"1回90分"
```

### 列の説明

- **service_id**: サービスの一意のID（他CSVと同じ）
- **tab_index**: タブ番号（2=評判、3=特徴、4=支援）
- **col_index**: 列番号（1=左列、2=中央、3=右列）
- **value**: 表示内容（HTMLタグ利用可）

### 表示場所

→ **表示場所**: ランキングカード内の「基本情報」セクション → 各タブ（評判/特徴/支援）の3列テーブル

### 編集方法

1. 対象サービスとタブを特定し、該当する行の `value` を編集
2. アイコンや改行を表示したい場合は、`<p>` や `<br/>` などのHTMLタグを利用
3. CSV形式（UTF-8）で保存

**ヒント**: 難易度アイコンなどを表示する場合は、`<p class='compareTable__icon compareTable__icon--shape'>` のように既存クラスをそのまま利用してください。

---

## 4. service-summary.csv

トップページ上部のサマリー表に表示される4列のデータを管理します。

### ファイル構造

```csv
service_id,col1,col2,col3,col4
shiftai,"基礎<br>29,800円","5案件<br>98,000円",かなり<br>高い,質問無制限
```

### 列の説明

- **service_id**: サービスの一意のID
- **col1**: 第1列（料金情報など）
- **col2**: 第2列（実績・評判など）
- **col3**: 第3列（実務サポートなど）
- **col4**: 第4列（無料セミナーなど）

### 表示場所

→ **表示場所**: トップページ上部のサマリーテーブル（サービスごとに4列のデータ）

### 装飾タグ

`col1`・`col2`は上段（ラベル）と下段（値）を`<br>`で区切って記述します。

- `<sq-block>ラベル</sq-block>`: 上段テキストに既存のハイライト（`.t-times`）を適用します。タグを付けない場合は通常のテキスト表示になります。
  - 例: `AIライティング<sq-block>返金保証付き</sq-block><br>29,800円`
- `<sq-xxx>` の形式で記述すると、自動的に `span` 要素に変換され、`sq-xxx` クラスが付与されます。必要に応じて独自スタイルを追加してください。

---

## 5. service-detail.csv

ランキングカード内の「特徴」セクションに表示される詳細説明を管理します。

### ファイル構造

```csv
service_id,section_index,heading,content
shiftai,1,圧倒的な人気で安心のスクール,<strong>受講者数3万人超・校舎数25拠点</strong>で圧倒的人気。多くの人に選ばれ、安心安全です。AI副業選びで失敗したくない人に、<strong>最もオススメのスクール！</strong>
shiftai,2,【格安】コスパ最強の価格設定,"AIライティング講座が29,800円・総合スキル習得が98,000円と低価格！教材・サポート無料で追加料金も一切ないので、<strong>お金の心配なく</strong>スキル習得できます。"
```

### 列の説明

- **service_id**: サービスの一意のID
- **section_index**: セクションの順序（1, 2, 3...）
- **heading**: 見出しテキスト
- **content**: 本文テキスト（HTMLタグ利用可）

### 表示場所

→ **表示場所**: ランキングカード内の「特徴」セクション（複数の見出しと本文が並ぶエリア）

### 編集方法

1. 対象サービスの行を編集
2. `heading`と`content`を更新
3. 強調したい箇所は`<strong>`タグを使用
4. CSV形式（UTF-8）で保存

---

## 6. service-meta.csv

各サービスの基本メタ情報（名前、ロゴ、評価スコア）を管理します。

### ファイル構造

```csv
service_id,service_name,logo_path,rating_score
shiftai,SHIFT AI,img/logo/shiftai.webp,4.5
```

### 列の説明

- **service_id**: サービスの一意のID
- **service_name**: サービス名
- **logo_path**: ロゴ画像のパス
- **rating_score**: 評価スコア（例: 4.5）

### 表示場所

→ **表示場所**: 
- サービス名: ランキングカード名、サマリーヘッダー、比較表、基本情報タイトル、フッターリンク
- ロゴ: 各サービスのロゴ画像
- 評価スコア: サマリーセクションの評価スコア表示

### 編集方法

1. 対象サービスの行を編集
2. サービス名、ロゴパス、評価スコアを更新
3. CSV形式（UTF-8）で保存

**注意**: サービス名を変更すると、サイト全体でそのサービスの表示名が変更されます。

---

## 7. service-pricing.csv

ランキングカード内の料金表（プラン一覧）を管理します。

### ファイル構造

```csv
service_id,program_type,program_name,program_image,total_price,program_desc,per_session_price,monthly_price
shiftai,1,AIライティング基礎,img/ranking/part_hige.svg,"29,800",基礎コース,"2,800",
```

### 列の説明

- **service_id**: サービスの一意のID
- **program_type**: プログラムタイプ（1, 2, 3...）
- **program_name**: プログラム名
- **program_image**: プログラム画像のパス
- **total_price**: 総額（円）
- **program_desc**: プログラム説明
- **per_session_price**: 1回あたりの料金（円）
- **monthly_price**: 月額料金（円）

### 表示場所

→ **表示場所**: ランキングカード内の「プラン」タブ → 料金表

### 編集方法

1. 対象サービスとプログラムタイプの行を編集
2. プログラム名、料金情報を更新
3. 月額プランがない場合は`monthly_price`を空欄にすると「対応なし」と表示される
4. CSV形式（UTF-8）で保存

---

## 8. service-reviews.csv

ランキングカード内の口コミセクションを管理します。

### ファイル構造

```csv
service_id,review_index,age,gender,title,content,date,image_url
shiftai,1,45,男性,40代フリーランスで高単価案件受注,自由度が高く場所や時間に囚われない働き方が出来るフリーランスエンジニアを目指しました。現在は独立してWebアプリ開発案件などに携わらせてもらっています。,2024年/公式サイト参照,https://lp.prodig.jp/wp-content/uploads/2022/01/review01.svg
```

### 列の説明

- **service_id**: サービスの一意のID
- **review_index**: 口コミの順序（1, 2, 3...）
- **age**: 年齢
- **gender**: 性別
- **title**: 口コミタイトル
- **content**: 口コミ本文
- **date**: 投稿日
- **image_url**: アイコン画像のURL

### 表示場所

→ **表示場所**: ランキングカード内の「受講者の口コミ」セクション

### 編集方法

1. 対象サービスの口コミ行を編集
2. 年齢、性別、タイトル、本文、日付を更新
3. 画像URLを必要に応じて変更
4. CSV形式（UTF-8）で保存

---

## 9. service-cta.csv

各サービスのCTAボタンのリンク先URLを管理します。

### ファイル構造

```csv
service_id,official_url,seminar_url
shiftai,https://l.shift-ai.co.jp/,https://shift-ai.co.jp/%E8%AA%AC%E6%98%8E%E4%BC%9A%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0/
```

### 列の説明

- **service_id**: サービスの一意のID
- **official_url**: 公式サイトのURL
- **seminar_url**: セミナーページのURL

### 表示場所

→ **表示場所**: 
- 公式サイトURL: サマリーセクションの「公式サイトを見る」ボタン、ランキングカード内の公式サイトボタン、比較表のCTAボタン
- セミナーURL: ランキングカード内のセミナーボタン

### 編集方法

1. 対象サービスの行を編集
2. URLを更新
3. CSV形式（UTF-8）で保存

---

## 編集時の注意事項

1. **文字コード**: UTF-8で保存してください
2. **カンマ**: テキストにカンマが含まれる場合は、ダブルクォーテーションで囲む
3. **改行**: セル内改行は `<br>` タグを使用
4. **空欄**: 使用しない列は空欄のまま（カンマは残す）
5. **順序**: service-text.csvの行順序がサイトの表示順序になります

---

## トラブルシューティング

### サイトが正しく表示されない場合

1. CSVファイルの文字コードがUTF-8か確認
2. カンマの数が正しいか確認（各行のカンマ数は同じ）
3. ブラウザのキャッシュをクリア
4. ブラウザの開発者ツール（F12）でエラーを確認

### CSVの編集後

ファイルを保存したら、ブラウザで `Ctrl+F5` (Windows) または `Cmd+Shift+R` (Mac) でページを再読み込みしてください。
