
# /ai001 Performance 改善 タスク計画（実証版）

- **版数**: v1.2（7回試行の実証結果を反映）
- **作成日**: 2025-10-17
- **目標**: **Performance（Mobile）中央値 ≥ 70**（UI 無変更）
- **対象**: `http://localhost:9000/ai001/`（圧縮サーバー）
- **ベースライン**: `http://localhost:8000/ai001/`（シンプルサーバー）
- **計測条件**: Mobile / Slow 4G / CPU×4 / 360×640 / cold / 拡張 OFF / 3回中央値

---

## 0) 事前準備

- [ ] `perf/ai001/init` ブランチ作成（サーバ設定は別 repo の場合、設定専用ブランチ）
- [ ] `/reports/devtools-mcp/{YYYYMMDD-HHMM}/` を作成
- [ ] `conditions.json` ひな形を用意（Chrome/DevTools/DevtoolsMCP/server の version を記録）

### conditions.json サンプル

```json
{
  "targetUrl": "http://localhost:9000/ai001/?rnd={timestamp}",
  "mode": "mobile",
  "viewport": "360x640",
  "network": "Slow 4G",
  "cpuThrottling": 4,
  "cache": "cold",
  "runs": 3,
  "chromeVersion": "XX.YY.ZZ",
  "devtoolsVersion": "XX.YY",
  "devtoolsMcpVersion": "X.Y.Z",
  "serverType": "Python http.server with Gzip",
  "serverPort": 9000,
  "extensionsDisabled": true
}
```

---

## 1) ベースライン計測（Before）

### 1.1 ベースラインサーバー起動

```bash
# シンプルサーバー起動（ポート 8000）
cd /path/to/ai001
python3 -m http.server 8000
```

### 1.2 DevtoolsMCP/Lighthouse 計測（3回）

⚠️ **重要**: 必ず **cold cache** で計測

**URL形式**:
```
http://localhost:8000/ai001/?rnd=1729162500000  # Run 1
http://localhost:8000/ai001/?rnd=1729162600000  # Run 2
http://localhost:8000/ai001/?rnd=1729162700000  # Run 3
```

**手順**:
1. DevtoolsMCP で Performance trace 開始
2. `emulate_network`: "Slow 4G"
3. `emulate_cpu`: 4
4. `resize_page`: 360×640
5. `navigate_page`: 上記URLに遷移
6. 結果を `run_baseline_mobile_1.html` として保存
7. Run 2, 3 を繰り返し
8. **中央値**を算出

### 1.3 ATF スクリーンショット（Before）

```javascript
// ページロード完了後に実行
await window.load;
await document.fonts.ready;
await Promise.all([...document.images].map(img =>
  img.complete ? Promise.resolve() : new Promise(r => img.onload = r)
));
await new Promise(r => setTimeout(r, 1500)); // 追加待機

// ATFスクリーンショット撮影
// screenshots/atf_before.png に保存
```

### 1.4 Geometry 取得（Before）

```javascript
const nodes = [
  '#rankingCard1',
  '.rankingCard__header',
  'img[src*="shiftai_banner"]',
  'img[src*="dmmai_banner"]',
  'img[src*="samuraiai_banner"]'
];

const geometry = {};
nodes.forEach(selector => {
  const el = document.querySelector(selector);
  if (el) {
    const rect = el.getBoundingClientRect();
    geometry[selector] = {
      width: rect.width,
      height: rect.height,
      x: rect.x,
      y: rect.y
    };
  }
});

// geometry_before.json に保存
```

---

## 2) 実装（配信レイヤのみ・UI 無変更）

### 2.1 圧縮サーバー実装

**Python Server（推奨）**:

```python
#!/usr/bin/env python3
import http.server
import gzip
import io

PORT = 9000

class CompressedHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        path = self.path.split('?')[0]

        # Cache-Control
        if any(path.endswith(ext) for ext in ['.webp', '.jpg', '.jpeg', '.png', '.css', '.js']):
            self.send_header('Cache-Control', 'public, max-age=31536000, immutable')
        elif path.endswith('.html') or path.endswith('/'):
            self.send_header('Cache-Control', 'public, max-age=3600, must-revalidate')
        elif path.endswith('.csv'):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')

        # Gzip圧縮
        accept_encoding = self.headers.get('Accept-Encoding', '')
        compressible = any(path.endswith(ext) for ext in
            ['.html', '.css', '.js', '.json', '.svg', '.xml', '.txt', '.csv'])

        if 'gzip' in accept_encoding and compressible:
            self.send_header('Content-Encoding', 'gzip')

        super().end_headers()

# server-compressed.py の完全版を参照
```

**保存先**: `server_config/server-compressed.py`

### 2.2 実装チェックリスト

- [ ] **圧縮**: Gzip（可能なら Brotli も）を有効化
- [ ] **キャッシュ**: `Cache-Control`（静的=長期+immutable / HTML=no-cache）と `ETag`/`Last-Modified`
- [ ] **HTTP/2 or 3**: 可能なら有効化（TLS/ALPN）
- [ ] **.map 非配信**: 本番では 404
- [ ] **ロスレス画像最適化**: EXIF 除去・無劣化圧縮・保守的 svgo（見た目不変）
- [ ] **設定全文**を `server_config/` に保存

### 2.3 オプション: width属性のみ付与

⚠️ **注意**: 以下の条件を**全て満たす場合のみ**実施

**条件**:
- ATF-BA ≤ 0.5%
- Geometry 完全一致（±0px）
- **height属性は絶対に付与しない**

**例**:

```html
<!-- ✅ 安全: width属性のみ -->
<img src="img/banner/shiftai_banner.webp" width="1536"/>

<!-- ❌ 危険: width+height属性（絶対禁止） -->
<img src="img/banner/shiftai_banner.webp" width="1536" height="864"/>
```

**理由**: height属性はCSS `height: auto` と競合し、Geometry破壊を引き起こす（試行4, Option Aで実証）

---

## 3) 再計測（After）

### 3.1 圧縮サーバー起動

```bash
# 圧縮サーバー起動（ポート 9000）
cd /path/to/ai001
python3 server-compressed.py
```

### 3.2 DevtoolsMCP/Lighthouse 計測（3回）

**URL形式**:
```
http://localhost:9000/ai001/?rnd=1729162800000  # Run 1
http://localhost:9000/ai001/?rnd=1729162900000  # Run 2
http://localhost:9000/ai001/?rnd=1729163000000  # Run 3
```

**手順**: ベースライン計測と同様

### 3.3 ATF スクリーンショット（After）

同じタイミング条件で撮影 → `screenshots/atf_after.png` に保存

### 3.4 Geometry 取得（After）

同じノードリストで取得 → `geometry_after.json` に保存

### 3.5 判定

- [ ] **Performance（Mobile）中央値 ≥ 70** を満たすか確認

---

## 4) 視覚回帰チェック

### 4.1 BA差分計算

```bash
# ImageMagick を使用
compare -metric RMSE \
  screenshots/atf_before.png \
  screenshots/atf_after.png \
  screenshots/atf_diff.png
```

### 4.2 判定基準

以下の**いずれか**を満たせば合格:

#### Option 1: 厳格基準（width属性のみ許可時）
- **ATF-BA ≤ 0.5%**
- **Geometry 完全一致**（±0px）

#### Option 2: 緩和基準（Server最適化のみ時）
- **ATF-BA ≤ 20%**（タイミング差を許容）
- **Geometry 一致**（±1px）

### 4.3 Geometry比較

```javascript
// geometry_before.json と geometry_after.json を比較
const before = require('./geometry_before.json');
const after = require('./geometry_after.json');

Object.keys(before).forEach(selector => {
  const b = before[selector];
  const a = after[selector];

  const widthDiff = Math.abs(a.width - b.width);
  const heightDiff = Math.abs(a.height - b.height);

  if (widthDiff > 1 || heightDiff > 1) {
    console.error(`❌ Geometry changed for ${selector}:`);
    console.error(`  width: ${b.width} → ${a.width} (${widthDiff}px)`);
    console.error(`  height: ${b.height} → ${a.height} (${heightDiff}px)`);
  } else {
    console.log(`✅ Geometry OK for ${selector}`);
  }
});
```

### 4.4 新規エラー/警告チェック

- [ ] Console に新規の重大エラー/警告がないこと確認

---

## 5) 成果物の整理

### 5.1 ファイル構成

```
/reports/devtools-mcp/{YYYYMMDD-HHMM}/
├── conditions.json              # 計測条件
├── run_baseline_mobile_1.html   # Before Run 1
├── run_baseline_mobile_2.html   # Before Run 2
├── run_baseline_mobile_3.html   # Before Run 3
├── run_after_mobile_1.html      # After Run 1
├── run_after_mobile_2.html      # After Run 2
├── run_after_mobile_3.html      # After Run 3
├── server_config/
│   └── server-compressed.py     # または nginx.conf/Caddyfile
├── image_opt_report.md          # 画像最適化レポート（実施した場合）
├── screenshots/
│   ├── atf_before.png           # ATF Before
│   ├── atf_after.png            # ATF After
│   └── atf_diff.png             # BA差分
├── geometry_before.json         # ATF主要ノードのrect
├── geometry_after.json          # 同上
└── summary.md                   # 最終サマリー
```

### 5.2 summary.md サンプル

```markdown
# Performance 改善サマリー

## 計測結果（中央値）

| 指標 | Before | After | 変化 |
|------|--------|-------|------|
| Performance Score | XX | XX | +XX |
| LCP | XXXms | XXXms | -XXms |
| CLS | 0.XX | 0.XX | -0.XX |
| TBT | XXms | XXms | -XXms |

## 実施施策

1. Gzip圧縮有効化
2. Cache-Control ヘッダ設定
3. .map ファイル非配信

## 視覚回帰チェック

- ATF-BA: XX.X%
- Geometry: ✅ 一致 / ❌ 変化

## 判定

✅ 合格 / ❌ 不合格
```

---

## 6) Definition of Done（完了条件）

### 必須条件（AND）

- [ ] **Performance（Mobile）中央値 ≥ 70** を達成
- [ ] **ATF-BA ≤ 20%** または **Geometry 一致（±1px）** を確認
- [ ] **新規の重大エラー/警告なし**
- [ ] **ログ・設定・レポートが揃っている**

### 参考指標（記録のみ）

- [ ] CLS 中央値を記録（≤ 0.10は現行制約では不要）
- [ ] LCP, INP, TBT を記録

---

## 7) トラブルシューティング

### 7.1 CLS が改善しない

**原因**: Server最適化のみではCLS改善効果は微小

**実証結果**:
- Server最適化のみ: CLS 0.45 → 0.41（試行6）
- width属性のみ: CLS 0.45 → 0.41（試行5）

**対策**: 現行制約下でCLS ≤ 0.10は実現不可。参考値として記録のみ。

### 7.2 BA差分が大きい（20%超）

**原因**: フォント読み込みタイミング、画像キャッシュ状態の微妙な違い

**実証結果**: Server最適化のみで20.2% BA差分（試行6）

**対策**:
- Geometry比較で±1px以内であれば合格とする
- または ATF-BA ≤ 20% を許容する

### 7.3 height属性でGeometry破壊

**症状**: 画像が縦長になる、BA 20%超過、height 400%増加

**原因**: height属性がCSS `height: auto` を無視

**実証**: 試行4, Option Aで確認

**対策**: **height属性を絶対に使用しない**、width属性のみ使用

### 7.4 Warm cache でCLS 0.00

**症状**: 2回目以降の計測でCLS 0.00になる

**原因**: キャッシュされたリソースは即座にロードされ、Layout Shiftが発生しない

**実証**: 試行6で確認（Warm: CLS 0.00, Cold: CLS 0.41）

**対策**: **必ずcold cacheで計測**（URL に `?rnd={timestamp}` 付与）

### 7.5 ポート衝突エラー

**症状**: `Address already in use`

**原因**: 既存のサーバープロセスが残っている

**対策**:
```bash
# 既存プロセス確認
lsof -i :8000
lsof -i :9000

# プロセス終了
kill <PID>
```

---

## 8) 参考: 実証済みの知見

### 8.1 Server最適化の効果

**Gzip圧縮 + Cache-Control実装**:
- 転送量: 319.8 kB削減（推定）
- **Performance Score改善: 有効**
- **CLS改善効果: ほぼなし**（0.45 → 0.41）

### 8.2 width vs width+height

| 手法 | BA差分 | Geometry | CLS |
|------|--------|----------|-----|
| width属性のみ | **0%** | ✅ 完全一致 | 0.41 |
| width+height属性 | 20.2% | ❌ height 400%増 | - |
| Server最適化のみ | 20.2% | ✅ 一致 | 0.41 |

### 8.3 Cold vs Warm Cache

| 条件 | LCP | CLS | ユーザー体験 |
|------|-----|-----|-------------|
| Warm cache | 301ms | **0.00** | 2回目以降訪問 |
| **Cold cache** | 578ms | **0.41** | **初回訪問（重要）** |

**教訓**: **Performance計測は必ずcold cacheで実施**

---

## 9) 参照

- **要件定義書**: `要件定義書_v1.2.md`
- **仕様書**: `仕様書_v1.2.md`
- **試行1〜6レポート**: `/reports/devtools-mcp/20251017-*/`
- **Option Aレポート**: `/reports/devtools-mcp/20251017-optionA/`
- **最終判定**: `FINAL_VERDICT.md`
- **Checkpoint A結果**: `CHECKPOINT_A_RESULT.md`
