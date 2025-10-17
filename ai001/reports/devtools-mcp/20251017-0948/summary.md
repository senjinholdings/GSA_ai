# /ai001 Performance 改善 サイクル サマリ

- 日時: 2025-10-17 09:48
- URL: http://localhost:8000/
- スコア（Mobile/中央値）: Before（ベースライン計測完了）
- 主要指標（中央値）:
  - LCP: 301ms ✅ (目標 ≤ 2500ms)
  - CLS: 0.45 ❌ (目標 ≤ 0.10)
  - 推定Performance Score: 未計算（DevtoolsMCPでは詳細スコア未取得）

## 計測結果（3回）
1. LCP: 301ms, CLS: 0.45
2. LCP: 377ms, CLS: 0.45
3. LCP: 292ms, CLS: 0.45

## 課題一覧（優先度順）

### 🔴 Critical（必須改善）
1. **CLS: 0.45** - レイアウトシフトが目標値の4.5倍
   - **詳細分析結果**:
     - Layout Shift 1: 1,676ms時点で0.4078（主要因）
     - Layout Shift 2: 2,011ms時点で0.0428
   - **根本原因**: 多数の画像にwidth/height属性が未指定
     - 確認済み箇所: 609, 615, 619, 636, 645, 662, 702, 719行等
   - **仕様書§5.3制約**: DOM構造変更は禁止
     - width/height属性追加は**DOM変更に該当する可能性**
     - **判断保留**: 視覚回帰テスト（差分≤0.1%）で許容可否を検証する必要あり
   - **影響**: Performance Score 70未達の主要因と推定

### 🟡 High（推奨改善）
2. **DocumentLatency: 319.8 kB削減可能**
   - HTMLファイルの圧縮が未実施
   - 対策: Brotli/Gzip圧縮の有効化

3. **Cache戦略未実施**
   - 静的資産のキャッシュ制御が不十分
   - 対策: Cache-Control ヘッダーの設定

### 🟢 Medium
4. **Third Parties**
   - Google Fonts等の外部リソースの最適化
   - 対策: preconnect/dns-prefetchの追加

5. **Forced Reflow**
   - JavaScript実行時の強制リフローが発生
   - 原因調査が必要

## 実施施策（§5.2 許可範囲）

### 現状分析（Python simple HTTP server制約）
- ❌ **HTTP圧縮**: Python serverでは未対応（Brotli/Gzip設定不可）
- ❌ **キャッシュ制御**: Cache-Controlヘッダー設定不可
- ✅ **preconnect**: 既に実装済み（fonts.googleapis.com, fonts.gstatic.com）
- ⚠️ **画像最適化**: WebP形式採用済み、さらなるロスレス圧縮可能
  - banner画像: 132KB, 104KB, 80KB（最適化候補）
  - 総容量: 37MB

### 制約による実装制限
Python simple HTTP serverの制約により、仕様書§5.2で許可されている以下の最適化が**技術的に実装不可**:
1. HTTP圧縮（Brotli/Gzip）- 319.8KB削減見込みだが未実施
2. Cache-Controlヘッダー - 静的資産の長期キャッシュ不可

**代替案**:
- Nginxやcaddy等のproduction-readyサーバーへの切り替え（§5.2許可範囲内）
- ただし、タスク仕様では`http://localhost:3000/ai001/`を想定（現在8000使用）

次のステップで以下を検討:

### Phase 1: CLS改善（最優先）
- [ ] CLSCulpritsの詳細分析
- [ ] 画像サイズの明示的指定確認
- [ ] フォント読み込み戦略の確認
- [ ] 動的コンテンツ挿入箇所の特定

### Phase 2: 圧縮・キャッシュ（許可範囲内）
- [ ] HTTP圧縮有効化（Brotli/Gzip）
- [ ] Cache-Controlヘッダー設定
- [ ] ETag/Last-Modified設定

### Phase 3: 外部リソース最適化
- [ ] preconnect for Google Fonts
- [ ] dns-prefetch for CDN

## 回帰防止
- 視覚回帰: before_ai001.png保存済み
- ガードレール: CLS 0.45で基準値超過、改善必須

## 実装限界の判明と対応提案

### 現状評価
本サイクルの診断により、以下の**技術的制約**が判明:

1. **サーバー制約**: Python simple HTTP server使用
   - HTTP圧縮（Brotli/Gzip）不可 → 319.8KB削減機会を逃す
   - Cache-Controlヘッダー設定不可 → リピート訪問の高速化不可
   - 仕様書§5.2で許可されている最も効果的な最適化が実装不可

2. **CLS制約**: 仕様書§5.3による厳格な外観保証
   - width/height属性追加はDOM構造変更に該当する可能性が高い
   - CLS 0.45を0.10以下に改善する手段が限定的

3. **404エラー**: `/img/common/logo.webp` 不在
   - レイアウトシフトの一因
   - 修正は可能だが、視覚回帰テスト必須

### Performance Score 70到達の見通し
**現状のPython server環境では到達困難**と判断:
- LCP 301ms ✅（良好）
- CLS 0.45 ❌（目標の4.5倍、Performance Scoreの主要減点要因）
- 圧縮・キャッシュ未実施（サーバー制約）

## 次サイクル提案（優先度順）

### 提案A: Production-ready サーバーへの切り替え（推奨）
**実施内容**:
1. nginxまたはcaddyでローカルサーバー構築
2. HTTP圧縮（Brotli/Gzip）有効化
3. Cache-Controlヘッダー設定
4. 再計測

**期待効果**:
- DocumentLatency改善: 319.8KB削減
- リピート訪問の高速化
- Performance Score: +10〜15ポイント見込み

**リスク**: 低（§5.2許可範囲内）

### 提案B: CLS改善の段階的検証
**実施内容**:
1. 主要LCP画像1枚にwidth/height属性追加
2. 視覚回帰テスト実施（差分≤0.1%確認）
3. 合格なら全画像に展開、不合格なら代替案検討

**期待効果**:
- CLS: 0.45 → 0.10以下
- Performance Score: +20〜30ポイント見込み（最大効果）

**リスク**: 中（§5.3抵触の可能性、視覚回帰テスト結果次第）

### 提案C: 404エラー修正
**実施内容**:
- logo.webpの不在を解決（代替ファイル配置またはHTML修正）

**期待効果**:
- 微小なCLS改善
- コンソールエラー解消

**リスク**: 低（小規模修正）

## 推奨アクション
**提案A（サーバー切り替え）を優先実施**し、その後に提案Bでさらなる改善を検討。
提案Cは付随的に実施。

## 備考
- ローカルサーバー: ポート8000で稼働中
- DevtoolsMCP計測: Slow 4G, CPU 4×
- Performance Scoreが70未満の可能性が高い（CLS超過により）
- **重要**: CLS改善は外観に影響しない範囲で実施する必要がある（仕様書 §5.3 禁止事項を遵守）
