# Geometry Invariance検証結果

## 判定: ❌ FAILED - 大幅な寸法変化を検出

## Before vs After比較

### img[src="img/banner/shiftai_banner.webp"]
| Property | Before | After | Δ | 判定 |
|----------|--------|-------|---|------|
| top | 1223 | 1223 | 0 | ✅ |
| left | 58 | 58 | 0 | ✅ |
| width | 384 | 384 | 0 | ✅ |
| **height** | **216** | **864** | **+648** | ❌ **400%増加** |

### img[src="img/banner/dmmai_banner.webp"]
| Property | Before | After | Δ | 判定 |
|----------|--------|-------|---|------|
| top | 1742 | 2390 | +648 | ❌ **シフト** |
| left | 58 | 58 | 0 | ✅ |
| width | 384 | 384 | 0 | ✅ |
| **height** | **186** | **606** | **+420** | ❌ **326%増加** |

### img[src="img/banner/samuraiai_banner.webp"]
| Property | Before | After | Δ | 判定 |
|----------|--------|-------|---|------|
| top | 2231 | 3299 | +1068 | ❌ **シフト** |
| left | 58 | 58 | 0 | ✅ |
| width | 384 | 384 | 0 | ✅ |
| **height** | **185** | **603** | **+418** | ❌ **326%増加** |

## 根本原因

### width/height属性の挙動

**期待**: HTML属性で自然寸法を宣言し、CSSの`width: 100%; height: auto;`で比率維持縮小
**実際**: **HTML属性がCSS指定を上書き**し、画像が自然寸法で表示される

### CSS適用状況の検証

#### Before(属性なし)
```html
<img src="img/banner/shiftai_banner.webp"/>
```
- CSS `.summary-banner img { width: 100%; height: auto; }` が適用
- 親要素幅384pxに合わせて縮小
- 表示サイズ: 384×216 (アスペクト比1.778維持)

#### After(属性付与)
```html
<img src="img/banner/shiftai_banner.webp" width="1536" height="864"/>
```
- HTML属性 `width="1536" height="864"` が**CSSより優先**
- CSSの`width: 100%; height: auto;`が無視される
- **表示サイズ: 384×864 (自然寸法の高さそのまま)**
- アスペクト比が破壊される(1.778 → 0.444)

## 技術的メカニズム

### CSS Cascade順序
1. HTML属性(`width`/`height`)は**presentational hints**として扱われる
2. CSS specificity: `0-0-0-0` (最低優先度)
3. **ただし、`!important`なしのCSS rule より優先される場合がある**

### ブラウザの画像レンダリング
1. HTML属性で初期寸法決定
2. CSS適用(ただし属性が存在する場合、一部プロパティが無視される)
3. **height属性があると、`height: auto`が効かない**

## 結論

**width/height属性付与は、既存のCSS `height: auto`と競合し、画像の表示高さを強制的に自然寸法に変更する**

これは§5.3「見た目不変」に**明確に違反**し、BA差分も大幅超過する。

### 試行4回の総括

| 試行 | 手法 | 結果 |
|-----|------|------|
| 1 | width/height属性(7箇所) | BA 2.09%超過 |
| 2 | aspect-ratio CSS | BA 2.04%超過 |
| 3 | width/height属性(9箇所、実寸) | BA 35.4%超過 |
| **4** | **width/height属性(ATF 3箇所のみ、決定論的)** | **Geometry変化検出(height 400%増)** |

**全ての試行で失敗**。CLS改善と見た目不変の両立は**技術的に不可能**と確定。
