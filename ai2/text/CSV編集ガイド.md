# CSV編集ガイド

サイトのテキストデータは2つのCSVファイルで管理されています。

## 1. common-text.csv

比較表のタブ名、ヘッダー名、ボタンテキストなどの共通テキストを管理します。

### ファイル構造

```csv
key,value
tab_0_name,総合
tab_1_name,サービス
...
```

### 編集可能な項目

- **タブ名**: `tab_0_name`, `tab_1_name`, `tab_2_name`
- **ヘッダー**: `tab_0_header_1` ～ `tab_0_header_5` (各タブごとに5列)
  - 例: `tab_0_header_2` = "価格"
  - 例: `tab_1_header_2` = "サポート"
- **ボタンテキスト**:
  - `button_pc_text`: PC版のボタンテキスト
  - `button_sp_text`: スマホ版のボタンテキスト
- **タイトル部分**:
  - `title_label_1`, `title_label_2`, `title_label_3`: 「料金」「効果」「難易度」
  - `title_cross`: 区切り文字「×」
  - `title_text`: 「で選ぶ」
  - `title_marker`: 「おすすめ」（強調部分）
  - `title_main`: 「AI副業スクール」（メインタイトル）
- **サマリーテーブルヘッダー**:
  - `summary_table_header_1`: 「ライティング料金」
  - `summary_table_header_2`: 「総合スキル習得」
  - `summary_table_header_3`: 「効果」
  - `summary_table_header_4`: 「難易度」
- **その他**: `recommend_text` = "おすすめ"ラベル（比較表用）

### 編集方法

1. Excelやスプレッドシートでファイルを開く
2. `value` 列のテキストを編集
3. CSV形式で保存（UTF-8エンコーディング推奨）

**注意**: `key` 列は変更しないでください。

---

## 2. service-text.csv

各サービスの詳細情報を管理します。

### ファイル構造

```csv
service_id,service_name,logo_path,tab_index,col_index,cell_type,icon,value1,value1_color,value2,effect,effect_color,feature
shiftai,AIライティングマスター,img/logo/shiftai.webp,0,1,value,ic_shape1.svg,29,800円,red,基礎コース,,,
```

### 列の説明

- **service_id**: サービスの一意のID（例: shiftai, horiemonai, samuraiai）
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
