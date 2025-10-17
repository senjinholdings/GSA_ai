# /ai001 Performance改善サイクル 最終レポート

## 1. Plan

**目標**: CLS 0.45 → 0.10以下、Performance Score ≥ 70

**実行計画**:
1. ベースライン再計測(3回、中央値)
2. CLS犯人特定(Layout Shift Regions + HTMLスキャン)
3. aspect-ratio CSSパッチ作成
4. BA差分検証(≤0.1%)
5. 再計測(CLS改善確認)
6. 合格判定 or ロールバック

**戦略**: 前回のwidth/height属性付与が失敗(BA 2.09%)したため、ラッパー要素へのaspect-ratio指定で解決を試みる。

---

## 2. Baseline(3回計測、中央値)

| Run | LCP (ms) | CLS | 備考 |
|-----|----------|-----|------|
| 1   | 428      | 0.45 | |
| 2   | 292      | 0.45 | |
| 3   | 298      | 0.45 | |
| **中央値** | **298ms** | **0.45** | |

**主要指標**:
- LCP: 298ms ✅(目標≤2500ms)
- CLS: 0.45 ❌(目標≤0.10、**4.5倍超過**)
- 推定Performance Score: < 70(CLS超過により)

**CLS詳細**:
- Layout Shift 1: 632ms(0.0005)
- Layout Shift 2: 1,120ms(**0.4078**)← 主要因
- Layout Shift 3: 1,460ms(0.0428)

---

## 3. CLS Offenders

| セレクタ | src | naturalW×H | displayedW×H | 推定影響度 |
|---------|-----|------------|--------------|-----------|
| header .header__logo img | img/common/logo.webp | unknown | auto×auto | **high(404 error)** |
| img[alt="TOP3"] | img/ranking/summary_h2.svg | 725×208 | 100%×auto | medium |
| .rankingCard img.logo (SHIFT AI) | img/banner/shiftai_banner.webp | 1536×864 | auto×auto | **high** |
| .rankingCard img.logo (DMM) | img/banner/dmmai_banner.webp | 1251×606 | auto×auto | **high** |
| .rankingCard img.logo (侍) | img/banner/samuraiai_banner.webp | 1249×603 | auto×auto | **high** |
| img[alt="AI副業TOP3..."] | img/ranking/title_clinic.svg | 753×123 | auto×auto | medium |
| .c-basicInfo__tablePartImg img | dynamic(CSV読込) | unknown | auto×auto | medium |
| img.ai-column__hero-image | img/column/column1.webp | 1280×720 | auto×auto | medium |

**根本原因**: ファーストビュー内の大型バナー画像(3枚、1536×864等)が寸法未指定で、読み込み完了時に大幅なレイアウトシフトを引き起こす。

---

## 4. Proposed Patch(diff)

**方針**: `.summary-banner`と`.rankingCard__mainImg`ラッパーにaspect-ratio CSSを追加(画像本体は不変)。

```diff
diff --git a/custom-style.css b/custom-style.css
--- a/custom-style.css
+++ b/custom-style.css
@@ -2490,0 +2492,20 @@
+/* ========================================
+   Performance Optimization: CLS Prevention
+   ======================================== */
+
+/* Banner image containers - aspect-ratio to prevent layout shift */
+.summary-banner {
+  aspect-ratio: 1536 / 864; /* SHIFT AI: 384/216 = 1.778 ≈ 16/9 */
+  width: 100%;
+}
+
+.rankingCard__mainImg {
+  aspect-ratio: 16 / 9; /* 438/246 = 1.778 = 16/9 */
+  width: 100%;
+}
+
+.summary-banner img,
+.rankingCard__mainImg img {
+  width: 100%;
+  height: auto;
+  display: block;
+}
```

**変更内容**: custom-style.css末尾に20行追加(ラッパー要素へのaspect-ratio指定のみ、HTML不変)

---

## 5. BA & Guardrails

### 視覚回帰テスト
- **Before**: `screenshots/baseline_run4.png`
- **After**: `screenshots/after_css_cls.png`
- **Diff**: `screenshots/diff_css_cls.png`
- **差分率**: **2.04%** ❌(目標≤0.1%、**20.4倍超過**)

### 判定
**不合格** - BA差分が許容範囲を大幅超過。aspect-ratio指定が視覚的変化を引き起こした。

### CLS/INP(After)
**計測スキップ** - BA不合格によりCLS再計測を実施せず即時ロールバック。

---

## 6. After Metrics

| 指標 | Before(中央値) | After(1回) | 差分 | 判定 |
|-----|---------------|-----------|------|------|
| LCP | 298ms | - | - | - |
| CLS | 0.45 | - | - | - |
| BA差分 | - | 2.04% | - | ❌ 20.4倍超過 |

**結論**: aspect-ratio CSSパッチは**BA差分超過により失敗**。CLS改善効果の確認前にロールバック。

---

## 7. Decision

### 最終判定: **ロールバック + 代替案提示**

#### ロールバック理由
1. **BA差分2.04%**(許容値0.1%の20.4倍)
2. 視覚的変化が許容範囲を超える
3. §5.3違反の可能性(CSS変更による外観変化)

#### ロールバック実施
```bash
mv custom-style.css.backup custom-style.css
```
✅ 完了

---

## 8. 根本原因分析

### なぜ2つのアプローチが共に失敗したか

**第1回失敗(width/height属性)**: BA差分2.09%
- 原因: 404ロゴへの寸法付与、画像の固有比率とCSS `width:100%`の競合

**第2回失敗(aspect-ratio CSS)**: BA差分2.04%
- 原因: ラッパー要素へのaspect-ratio指定が既存レイアウトと干渉
- 可能性:
  1. `.summary-banner`が既存CSSで異なる表示比率を持つ
  2. JavaScriptによる動的サイズ調整と競合
  3. ブラウザのaspect-ratio実装がピクセル境界で微妙な差を生む

### 技術的制約
1. **Python simple HTTP server使用** → HTTP圧縮・キャッシュ制御が不可
2. **CLS 0.45の根本原因は複雑** → 単純な寸法指定では解決しない
   - CSS動的適用とのタイミング競合
   - フォント/CSV読み込みによるレイアウト変動
   - 画像読み込みタイミングとJavaScript実行順序

---

## 9. 代替案提示(Performance Score 70到達のための提案)

### 提案A: Production-readyサーバーへの切り替え(推奨★★★)
**実施内容**:
1. **nginxまたはcaddy**でローカルサーバー構築
2. HTTP圧縮(Brotli/Gzip)有効化
3. Cache-Controlヘッダー設定(`immutable`、`max-age=31536000`)
4. ポート3000で稼働(タスク仕様に合致)

**期待効果**:
- DocumentLatency改善: **319.8KB削減**
- リピート訪問の高速化
- Performance Score: **+10〜15ポイント**見込み

**リスク**: 低(§5.2許可範囲内、外観不変)

**実装例(nginx)**:
```nginx
server {
    listen 3000;
    root /path/to/ai001;

    gzip on;
    gzip_types text/html text/css application/javascript image/svg+xml;

    location ~* \.(css|js|svg|webp|png|jpg)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        add_header Cache-Control "public, max-age=3600";
    }
}
```

### 提案B: font-display: swap追加(慎重検討要★★)
**実施内容**:
```css
@font-face {
    font-family: 'existing-font';
    font-display: swap; /* 追加 */
    /* 既存のsrc等 */
}
```

**期待効果**:
- CLS: フォント読み込み由来のシフト軽減
- Performance Score: **+5〜10ポイント**見込み

**リスク**: 中
- §5.3でfont変更禁止の可能性
- BA差分が0.1%を超えるリスク

### 提案C: preconnect最小化(即時実施可★)
**実施内容**:
```html
<!-- 既存の不要なpreconnectを削除、LCP関連のみ残す -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<!-- その他は削除 -->
```

**期待効果**:
- 微小なパフォーマンス改善
- リソース優先度の最適化

**リスク**: 極低

### 提案D: 404エラー修正(即時実施可★)
**実施内容**:
```html
<!-- Before -->
<img alt="" data-v-4d4a3d66="" src="img/common/logo.webp"/>

<!-- After(代替案1: 画像削除) -->
<!-- 削除または非表示 -->

<!-- After(代替案2: 別ファイル使用) -->
<img alt="" data-v-4d4a3d66="" src="img/logo/shiftai.webp"/>
```

**期待効果**:
- 微小なCLS改善
- コンソールエラー解消

**リスク**: 低(小規模修正)

---

## 10. Artifacts

### 保存ファイル一覧
```
/reports/devtools-mcp/20251017-0948/
├── conditions.json          # 計測条件
├── cls_offenders.csv        # CLS犯人リスト
├── proposed_diff.patch      # 提案パッチ(適用→ロールバック済み)
├── final_summary.md         # 本レポート
└── screenshots/
    ├── baseline_run4.png    # Before(ベースライン)
    ├── after_css_cls.png    # After(CSSパッチ適用後)
    ├── diff_css_cls.png     # BA差分画像
    └── ba_result.txt        # BA差分計算結果
```

---

## 11. 推奨アクション

**即時実施**: 提案A(nginxサーバー切り替え) + 提案C(preconnect最小化) + 提案D(404修正)

**理由**:
1. 現状のPython serverでは許可範囲内の最適化が技術的に実装不可
2. CLS改善は複雑で、CSS変更では必ずBA差分超過
3. HTTP圧縮・キャッシュ制御が最も確実かつ安全な改善策
4. 小規模修正(C/D)でリスク最小化

**次サイクル予定**:
1. nginxでHTTP圧縮・キャッシュ有効化
2. 再計測(3回、中央値)
3. Score 70未達の場合、提案B(font-display)を慎重検証

**現サイクル結論**: aspect-ratio CSSは**BA差分超過により不採用**。サーバー最適化を優先実施すべき。
