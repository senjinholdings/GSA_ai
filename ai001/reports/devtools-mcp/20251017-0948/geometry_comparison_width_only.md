# Geometry Invariance検証結果 (width属性のみ付与)

## 判定: ✅ PASSED - 完全一致

## Before vs After比較 (getBoundingClientRect使用)

### img[src="img/banner/shiftai_banner.webp"]
| Property | Before | After | Δ | 判定 |
|----------|--------|-------|---|------|
| rectW | 384.2 | 384.2 | 0.0 | ✅ 完全一致 |
| rectH | 216.1 | 216.1 | 0.0 | ✅ 完全一致 |
| cssW | 384.188px | 384.188px | 0.0 | ✅ 完全一致 |
| cssH | 216.094px | 216.094px | 0.0 | ✅ 完全一致 |
| attrW | null | **1536** | +1536 | (属性追加) |
| attrH | null | null | - | (未変更) |

### img[src="img/banner/dmmai_banner.webp"]
| Property | Before | After | Δ | 判定 |
|----------|--------|-------|---|------|
| rectW | 384.2 | 384.2 | 0.0 | ✅ 完全一致 |
| rectH | 186.1 | 186.1 | 0.0 | ✅ 完全一致 |
| cssW | 384.188px | 384.188px | 0.0 | ✅ 完全一致 |
| cssH | 186.094px | 186.094px | 0.0 | ✅ 完全一致 |
| attrW | null | **1251** | +1251 | (属性追加) |
| attrH | null | null | - | (未変更) |

### img[src="img/banner/samuraiai_banner.webp"]
| Property | Before | After | Δ | 判定 |
|----------|--------|-------|---|------|
| rectW | 384.2 | 384.2 | 0.0 | ✅ 完全一致 |
| rectH | 185.5 | 185.5 | 0.0 | ✅ 完全一致 |
| cssW | 384.188px | 384.188px | 0.0 | ✅ 完全一致 |
| cssH | 185.469px | 185.469px | 0.0 | ✅ 完全一致 |
| attrW | null | **1249** | +1249 | (属性追加) |
| attrH | null | null | - | (未変更) |

## 結論

**width属性のみ付与(height属性なし)では、実レイアウトが完全不変**

### 技術的メカニズム

#### Before(属性なし)
```html
<img src="img/banner/shiftai_banner.webp"/>
```
- CSS適用: `.summary-banner img { width: 100%; height: auto; }`
- ブラウザ挙動: 親要素幅(384px)に合わせて縮小、高さは自動計算
- 結果: **384.2×216.1**

#### After(width属性のみ)
```html
<img src="img/banner/shiftai_banner.webp" width="1536"/>
```
- HTML width属性: ブラウザに自然寸法を事前通知
- CSS適用: `.summary-banner img { width: 100%; height: auto; }`が**そのまま機能**
- ブラウザ挙動:
  1. width属性から自然寸法1536pxを認識
  2. CSS `width: 100%`で親要素幅384pxに縮小
  3. CSS `height: auto`でアスペクト比維持(1536/864 = 1.778)
  4. 結果高さ: 384 / 1.778 = 216.1px
- 結果: **384.2×216.1** (Before と完全一致)

### 前回失敗(width+height属性)との違い

#### 試行4(width+height属性)
- height属性がCSS `height: auto`を**無視**
- 結果: 384×864 (アスペクト比破壊)

#### 試行5(width属性のみ)
- height属性なし → CSS `height: auto`が**正常動作**
- 結果: 384.2×216.1 (アスペクト比維持、見た目不変)

## 次ステップ

1. ✅ Geometry不変確認済み
2. 🔄 BA差分検証(≤0.1%期待)
3. 🔄 CLS再計測(≤0.10期待)
