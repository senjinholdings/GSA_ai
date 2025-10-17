
# /ai001 Performance 改善 タスク計画（task.md）

- **版数**: v1.0  
- **作成日**: 2025-10-17  
- **対象 URL（ビルド後）**: `http://localhost:3000/ai001/`  
- **スコア目標**: Lighthouse **Performance（Mobile） ≥ 70**  
- **ガードレール**: LCP ≤ 2.5s / CLS ≤ 0.10 / INP ≤ 200ms / TBT ≤ 200ms  
- **制約**: 見た目が変わるような **CSS/JS/HTML** 編集は不可（外観・挙動非依存の手段に限定）

---

## 0) 事前準備（固定事項・環境）
- [ ] 計測入口を **`http://localhost:3000/ai001/`** に固定（中間 URL 不使用、**リダイレクトなし**が前提）
- [ ] ブラウザ/ツールを記録：Chrome/DevTools/DevtoolsMCP の**バージョン**を控える
- [ ] DevTools 条件を固定：**Mobile** / Slow 4G / CPU 4× / 360×640 / extensions OFF / **cold cache**
- [ ] リポジトリで **ブランチ**を作成：`perf/ai001/init`
- [ ] ログ保存用の**ディレクトリ**を作成：`/reports/devtools-mcp/{YYYYMMDD-HHMM}/`
- [ ] （任意）画像資産を Git LFS 管理する場合は `.gitattributes` を設定（`*.png filter=lfs diff=lfs merge=lfs -text` 等）

---

## 1) ベースライン計測（Before）
- [ ] DevtoolsMCP にて **3 回以上**計測。**中央値**を採用
- [ ] `conditions.json` を作成（サンプルは仕様書の付録 A 参照）し、**バージョン/条件**を記録
- [ ] レポートを保存：`run01_mobile.html/json` 〜（命名は `runNN_mobile.*`）
- [ ] **スクリーンショット**（Before）を取得し `screenshots/before_ai001.png` として保存
- [ ] `summary.md` を作成し、**スコア/指標/主な課題（Lighthouse の Opportunities/Diagnostics）**を列挙

---

## 2) 診断（ボトルネック特定）
- [ ] **LCP 要素/リソース**を特定（URL、サイズ、型、取得元、TTFB、リクエスト連鎖）
- [ ] **ブロッキング資産**（render-blocking CSS/JS）と**未使用バイト**（unused JS/CSS）を把握（*改変はしない*）
- [ ] **キャッシュ**の有効期限/`ETag`/`Last-Modified`/`immutable` の有無を確認
- [ ] **圧縮**（br/gzip）と `Vary: Accept-Encoding` の有無を確認
- [ ] 外部オリジン（フォント/CDN/API など）への**初回接続コスト**を棚卸し（preconnect 候補）
- [ ] 画像/SVG の**ロスレス最適化余地**を洗い出し（EXIF/メタ削除、圧縮率）

---

## 3) 実装（外観・挙動非依存の「許可」範囲のみ）

### 3.1 伝送・配信
- [ ] **HTTP 圧縮**：Brotli/Gzip を**両方**有効化し、適切な `br` 優先度と `Vary: Accept-Encoding` を設定  
      例（Nginx）: `brotli on; brotli_comp_level 5; gzip on;` / `add_header Vary "Accept-Encoding";`
- [ ] **HTTP/2/HTTP/3**（ALPN/TLS1.3/Keep-Alive）を有効化
- [ ] **キャッシュ制御**：
  - [ ] ハッシュ付き静的資産に `Cache-Control: public, max-age=31536000, immutable`
  - [ ] HTML は `Cache-Control: no-cache`（再検証）+ `ETag`/`Last-Modified`
  - [ ] 静的配信で `ETag` または強いバージョニングを明示
- [ ] **ソースマップ**：本番配信を停止（ビルド設定で `*.map` を除外）

### 3.2 アセット最適化（ロスレス限定）
- [ ] **画像（PNG/JPEG/GIF）ロスレス最適化**：寸法/色差なしでメタ削除  
      例コマンド：
  - PNG: `oxipng -o 3 --strip all {input.png} -o {output.png}`
  - JPEG: `jpegtran -copy none -optimize -perfect -outfile {output.jpg} {input.jpg}`
  - GIF: `gifsicle -O3 {input.gif} -o {output.gif}`
- [ ] **SVG**：`svgo` を**保守的設定**で実行（`removeViewBox: false` 等）
- [ ] **CSS/JS/HTML ミニファイ**：**順序や意味を変えない**設定に限定（例：Terser の `compress: false`, `mangle: false` など保守的）
- [ ] **外部接続の準備**：`<link rel="preconnect">` / `dns-prefetch` を**利用オリジンのみに限定**して追加（HTML 変更だが**視覚不変**。§7 の BA/ガードレールを満たすこと）
- [ ] **LCP リソースの preload**（条件付き）：LCP 画像/主要 CSS のみに限定し、**重複取得の有無**と **視覚回帰/CLS/INP 不悪化**を確認

> **禁止の再確認**：Lazy-load 追加、`defer/async` 付与、フォントの差し替え/サブセット化、Critical CSS 抽出、CSS/JS の読み込み順変更、DOM 構造変更、**非可逆**画像圧縮 —— いずれも不可。

---

## 4) 回帰防止（適用前後の確認）
- [ ] **視覚回帰（BA）**：`before_ai001.png` と `after_ai001.png` の差分を取得し、**差分率 ≤ 0.1%** を確認（Codex などで目視可）
- [ ] **副作用監視**：CLS ≤ 0.10 / INP ≤ 200ms を確認（悪化時は**ロールバック**）
- [ ] **コンソール**：新規エラー/重大警告がないこと

---

## 5) 再計測（After）
- [ ] 同条件で **3 回以上**再計測。中央値を採用
- [ ] レポートを保存：`runNN_mobile.html/json`
- [ ] スクリーンショット `screenshots/after_ai001.png` と差分 `diff_ai001.png` を保存
- [ ] `summary.md` を更新（Before/After のスコア/指標差分、ガードレール合否を明記）

---

## 6) ログとロールバック運用
- [ ] `/reports/devtools-mcp/{YYYYMMDD-HHMM}/` に **conditions.json / runNN / summary.md / screenshots** を保存
- [ ] **ブランチ**：`perf/ai001/{短い説明}`（例：`perf/ai001/cache-headers`）で PR を作成（小さく一施策ずつ）
- [ ] **タグ**：`perf-loop-{YYYYMMDD}-{n}` を打刻
- [ ] **コミット規約**：`perf(ai001): {施策名} | 期待効果: {指標} | リスク: {概要}`
- [ ] **ロールバック手順**：タグへ `git revert` または `git reset --hard {tag}` → 再デプロイ → **再計測で復旧確認**

---

## 7) 成功判定（Definition of Done）
- [ ] 最新サイクルの **Performance（Mobile） ≥ 70**
- [ ] **視覚回帰** 合格（差分 ≤ 0.1%）
- [ ] **CLS ≤ 0.10 / INP ≤ 200ms / TBT ≤ 200ms** を満たす
- [ ] 計測は **3 回以上の中央値**、ログ一式が保存済み

---

## 付録 A）チェックリスト（運用用）
- [ ] 入口固定・リダイレクトなし  
- [ ] 条件固定（Mobile/Slow4G/CPU4×/360×640/extensions OFF/cold）  
- [ ] Before レポート/スクショ保存  
- [ ] 圧縮（br/gzip）・HTTP2/3・キャッシュ制御適正化  
- [ ] ロスレス画像/SVG 最適化・安全なミニファイ  
- [ ] preconnect/dns-prefetch（必要最小限）・（必要時）preload（LCP のみ）  
- [ ] BA 差分 ≤ 0.1%、CLS/INP/TBT 合格、エラーなし  
- [ ] After レポート/スクショ/差分保存、summary.md 更新  
- [ ] PR・タグ・ロールバック手順の整備

---

## 付録 B）SVGO（保守的）設定例
```json
{
  "plugins": [
    {
      "name": "preset-default",
      "params": {
        "overrides": {
          "removeViewBox": false,
          "removeUnknownsAndDefaults": false
        }
      }
    }
  ]
}
```

## 付録 C）Nginx 例（抜粋・参考）
```nginx
# Brotli / Gzip
brotli on;
brotli_comp_level 5;
brotli_types text/plain text/css application/javascript application/json image/svg+xml;
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css application/javascript application/json image/svg+xml;
add_header Vary "Accept-Encoding";

# Cache
location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff2?)$ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}
location = /ai001/ {
  add_header Cache-Control "no-cache";
}
```

---

**メモ**：本タスク計画は「仕様書.md（v1.0）」を実装に落とし込んだ作業指示です。変更は §3 の「許可」範囲内に限定し、都度 §4〜§6 のチェックとログ保全を行ってください。
