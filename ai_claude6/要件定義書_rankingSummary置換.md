# AI副業おすすめ比較 要件定義書（rankingSummary を top-summary に置換）

## 1. 背景
- 現行サイトでは `rankingSummary` セクションを独自デザインで実装している。
- 参照サイト（[https://mens-datsumo-review.com/clinic_ranking](https://mens-datsumo-review.com/clinic_ranking)）に合わせ、`top-summary` セクションのデザイン・構造をほぼそのまま反映したい。
- PC/スマートフォン双方で参照サイトと遜色ない見た目・挙動を再現する必要がある。

## 2. 目的
- `rankingSummary` セクションを丸ごと削除し、参照サイトの `top-summary` セクションを移植する。
- HTML/CSS を DevTools で取得し、構造・スタイル・レスポンシブ挙動を忠実に実装する。

## 3. 対象範囲
- ディレクトリ：`/Users/hattaryoga/Desktop/GoogleSearchAdsSite/AI副業おすすめ比較/ai_claude6`
- 対象ファイル：
  - `index.html`（`rankingSummary` ブロック削除、新規 `top-summary` 差し込み）
  - `custom-style.css`（必要に応じてスタイル調整）
  - 追加で必要な画像・SVG 等のアセット
- 参考サイト：`https://mens-datsumo-review.com/clinic_ranking`
- 検証環境：`http://localhost:53206/`

## 4. 要求事項
1. `rankingSummary` に関連する HTML 要素およびスタイルを削除し、新たに `top-summary` ブロックを挿入する。
2. 参照サイトの `top-summary` HTML/CSS を DevTools から抜粋し、必要なクラス・構造を保持したまま取り込む。
3. 画像・アイコン・フォントなど参照サイト依存リソースはローカル側に保存し、適切なパスに更新する。
4. レスポンシブ挙動（PC 版/スマホ版）を参照サイトと同等に再現する。
5. 必要に応じて JavaScript での動的処理も調査し、同等のインタラクションを実装する。

## 5. 非機能要件
- 既存ページ全体とのスタイル競合を避けるため、クラス命名や CSS のスコープを明確にする。
- 参照サイトから再利用するスタイルは、不要なリセットや全体適用のルールを取り除き、必要な限定ルールのみ抽出する。
- パフォーマンスを損なわないよう、画像サイズやフォント読み込みを適切に調整する。

## 6. 完了条件
- `http://localhost:53206/` にアクセスし、PC とスマホ（デバイスシミュレーション）で `top-summary` セクションが参照サイトと視覚的に遜色ないことを確認。
- DevTools で比較し、HTML 構造・主要スタイルが参照サイトとほぼ一致していること。
- `rankingSummary` 構造および関連スタイルが残っていないこと。

## 7. 作業手順の想定
1. 参照サイトの `top-summary` ブロックを DevTools で解析し、HTML/CSS・画像リソースを取得。
2. 取得したリソースをローカルプロジェクトに保存し、相対パスを整備。
3. `index.html` から旧 `rankingSummary` を削除し、`top-summary` の HTML を挿入。
4. `custom-style.css` に必要なスタイルを追加、既存スタイルとの衝突を確認。
5. ローカルサーバーでレンダリングを確認し、PC/スマホ両方でデザイン調整。
6. QA とスクリーンショット取得、必要なドキュメント更新。

