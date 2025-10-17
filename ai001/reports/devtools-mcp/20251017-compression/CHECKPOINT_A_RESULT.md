# CHECKPOINT A: CLS=0.00 真偽確認結果

## 検証条件

**Cold Run 強制:**
- Cache bypass: URL に `?rnd={timestamp}` 付与
- Mobile 360×640, Slow 4G, CPU×4
- DevTools emulation: Slow 4G enabled
- 各 run で異なる timestamp 使用

## 計測結果

### Compressed Server (port 9000) - Cold Run

| Run | URL | LCP | CLS |
|-----|-----|-----|-----|
| 1 | ?rnd=1729162500000 | 1525ms | **0.41** |
| 2 | ?rnd=1729162600000 | 578ms | **0.41** |
| 3 | ?rnd=1729162700000 | 528ms | **0.41** |
| **中央値** | - | **578ms** | **0.41** |

### 前回結果 (Warm Cache) との比較

| 条件 | LCP中央値 | CLS中央値 | Cache状態 |
|------|-----------|-----------|-----------|
| Warm cache | 301ms | **0.00** | 2回目以降訪問 |
| **Cold cache** | **578ms** | **0.41** | 初回訪問 |

## 判定

❌ **CLS=0.00 は再現せず。Warm cache 時のみの一時的現象**

### 技術的解釈

**Warm cache 時 (CLS 0.00):**
- 画像が disk cache から即座に読み込まれる
- DOM 構築と画像表示がほぼ同時 → layout shift 発生しない

**Cold cache 時 (CLS 0.41):**
- 画像が network から読み込まれる (Slow 4G で遅延)
- DOM 構築完了 → **画像読み込み完了待ち** → layout shift 発生
- **width/height 属性がないため、ブラウザは事前スペース確保できない**

## 結論

**Server-side compression (Gzip + Cache-Control) だけでは、Cold run での CLS 改善効果なし**

**CLS を根本的に解決するには:**
1. HTML に width/height 属性を追加 (試行4で geometry 変化のため却下済み)
2. CSS aspect-ratio を使用 (試行2で BA 2.04%超過のため却下済み)
3. **SSR で寸法を初期 HTML に埋め込む** (現行環境では実装不可)

**現実的判断**: CLS 0.41 を許容し、Performance Score ≥ 70 達成に注力
