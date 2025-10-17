# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static comparison website for AI副業スクール (AI Side-Business Schools) built with vanilla JavaScript, HTML, and CSV-driven content. The site uses a **CSV-based data architecture** where all content is stored in CSV files and dynamically loaded via JavaScript, allowing non-technical users to update content without touching code.

## Key Architecture Principles

### CSV-Driven Content System

All page content is managed through CSV files in the `/text/` directory:

- **common-text.csv**: Site-wide UI text (tab names, headers, buttons, MV text)
- **service-text.csv**: Comparison table data (3 tabs × 3 columns per service)
- **service-summary.csv**: Top summary table (4 columns per service)
- **service-basic-info.csv**: Service detail tabs (料金/評判/特徴/支援)
- **service-detail.csv**: Feature sections with headings and content
- **service-meta.csv**: Service metadata (name, logo, rating)
- **service-pricing.csv**: Pricing plans and program details
- **service-reviews.csv**: User reviews and testimonials
- **service-cta.csv**: CTA button URLs (official/seminar)

**Critical**: The CSV files are the **source of truth** for all content. When modifying content, edit CSVs, not hardcoded HTML.

### JavaScript Module Structure

- **csv-loader.js**: CSV parsing and data loading utilities
  - `loadCommonText()`: Loads common-text.csv as key-value object
  - `loadServiceText()`: Loads and transforms service-text.csv into tabData structure
  - Individual loaders for each CSV type

- **app.js**: Main application logic
  - CTA button binding and URL resolution
  - Tab switching for basic info sections
  - Review modal functionality
  - Epilator carousel (if applicable)
  - **MV SVG text replacement**: Dynamically loads SVG, replaces text elements with CSV values

### Dynamic SVG Text Replacement

The main visual (MV) uses an inline SVG loaded via `fetch()` and modified at runtime:

```javascript
// In app.js
async function initializeMvTextOverlay() {
  // 1. Fetch SVG file
  // 2. Insert into #mv-svg-container
  // 3. Query all <text> elements
  // 4. Replace text content with CSV values (e.g., mv_main_title)
}
```

**Important**: The MV text is controlled by `common-text.csv` keys like `mv_main_title`, `mv_year_label`. To change MV text, edit the CSV, not the SVG file.

## Development Workflow

### Local Development

```bash
# Start local server
./start-server.sh
# or manually:
python3 -m http.server 8000

# Access at http://localhost:8000/
```

**Note**: The site requires a local server (cannot use `file://` protocol) due to CSV `fetch()` calls and CORS restrictions.

### Content Updates

1. Edit the appropriate CSV file in `/text/`
2. Ensure UTF-8 encoding
3. Use `<br>` for line breaks, HTML tags for formatting
4. Refresh browser with `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac) to bypass cache

### Adding a New Service

1. Choose a unique `service_id` (e.g., `newservice`)
2. Add logo to `img/logo/`
3. Add rows to ALL CSV files:
   - service-meta.csv: 1 row
   - service-text.csv: 9 rows (3 tabs × 3 cols)
   - service-summary.csv: 1 row (4 columns)
   - service-basic-info.csv: 9 rows (3 tabs × 3 cols)
   - service-detail.csv: 3-5 rows (sections)
   - service-pricing.csv: 1-3 rows (programs)
   - service-reviews.csv: 3+ rows
   - service-cta.csv: 1 row

## Code Style and Constraints

### External Appearance Preservation

**CRITICAL**: Per `仕様書.md`, any changes affecting visual appearance, layout, or behavior are **strictly prohibited** unless they are:

- Server/CDN optimizations (compression, caching, HTTP/2)
- Asset optimization (minification, lossless image compression)
- Performance headers (`preconnect`, `preload` for LCP resources only)

**Forbidden** changes:
- Non-lossless image compression
- Font substitution or subsetting
- CSS restructuring or critical CSS extraction
- Lazy-load additions
- `defer`/`async` attribute changes
- DOM structure modifications

### Visual Regression Testing

Before deploying performance optimizations:
1. Take Before/After screenshots at mobile viewport (360×640)
2. Ensure diff ≤ 0.1%
3. Verify CLS ≤ 0.10, INP ≤ 200ms

### Performance Optimization Workflow

Per `仕様書.md` (Performance Improvement Specification):

1. **Measure**: Use DevtoolsMCP/Lighthouse, mobile mode, Slow 4G, 4× CPU throttle
2. **Target**: Performance score ≥ 70 (mobile)
3. **Record**: Save reports to `/reports/devtools-mcp/{YYYYMMDD-HHMM}/`
   - conditions.json
   - run01_mobile.html/json (repeat 3+ times, use median)
   - summary.md
   - screenshots/ (before/after/diff)
4. **Git workflow**:
   - Branch: `perf/ai001/{description}`
   - Small PRs (one optimization per PR)
   - Tag: `perf-loop-{YYYYMMDD}-{n}`
   - Commit format: `perf(ai001): {change} | 期待効果: {metric} | リスク: {risk}`

## Data Flow

```
CSV files (UTF-8)
  ↓ fetch()
csv-loader.js (parse, transform)
  ↓ loadXxx()
app.js (bind to DOM)
  ↓ innerHTML / textContent
HTML rendering
```

## Important Files

- **index.html**: Main page with SSR-like structure (static HTML with data-v-* attributes)
- **custom-style.css**: Custom styles overriding base styles
- **text/サイトの仕様書.md**: Content design specification (user personas, section purposes)
- **text/CSV編集ガイド.md**: CSV editing guide (field descriptions, display locations)
- **仕様書.md**: Performance optimization specification (strict constraints)

## Common Tasks

### Updating MV Text

1. Edit `text/common-text.csv`:
   - `mv_main_title`: Main title (e.g., "生成AIセミナー")
   - `mv_year_label`: Year label (e.g., "2025年最新版")
2. Refresh browser (app.js will auto-load SVG and replace text)

### Changing Comparison Table Headers

1. Edit `text/common-text.csv`:
   - `tab_0_header_1` through `tab_0_header_5` (Tab 0)
   - `tab_1_header_1` through `tab_1_header_5` (Tab 1)
   - `tab_2_header_1` through `tab_2_header_5` (Tab 2)

### Modifying Service Comparison Data

1. Edit `text/service-text.csv`
2. Locate rows by `service_id`, `tab_index` (0/1/2), `col_index` (1/2/3)
3. Use custom tags:
   - `<i1>` → ic_shape1.svg icon
   - `<red>...</red>` → Red text
   - `<br>` → Line break
   - `<tag_r>` → Split into list items

### Performance Optimization

**Before any optimization**:
1. Read `仕様書.md` sections 5 (allowed/forbidden changes) and 7 (regression prevention)
2. Ensure change is in the **allowed** list (§5.2)
3. Take baseline measurements (3+ runs, median)
4. Take before screenshot

**After optimization**:
1. Re-measure (3+ runs, median)
2. Take after screenshot, calculate diff
3. Verify CLS/INP within guardrails
4. Save reports to `/reports/devtools-mcp/{YYYYMMDD-HHMM}/`
5. Create PR with commit format from §8.2

## Debugging

### CSV Not Loading

- Check browser console for fetch errors
- Ensure local server is running (not `file://`)
- Verify CSV is UTF-8 encoded
- Check for missing commas or malformed rows

### Text Not Updating

- Hard refresh (`Ctrl+F5` / `Cmd+Shift+R`)
- Check CSV key spelling matches code
- Inspect `await loadCommonText()` return value in console

### CTA Buttons Not Working

- Verify `service-cta.csv` has correct URLs
- Check `service_id` matches across all CSVs
- Inspect `gServiceCta` object in browser console

## Project Context

This is a landing page for comparing AI副業 (AI side-business) schools/courses. The target users are:
- Working professionals seeking AI副業 (side income via AI skills)
- People wanting to upskill in AI tools (ChatGPT, etc.)
- Beginners with no AI experience

The comparison focuses on:
1. **料金** (Price): Cost transparency, value for money
2. **効果** (Effectiveness): Real results, satisfaction rate
3. **サポート** (Support): Question support, job/project assistance

The site architecture prioritizes:
- **Content flexibility**: Non-developers can update via CSV
- **Performance**: Lightweight, fast loading (target Lighthouse score ≥ 70)
- **Visual consistency**: Changes must not affect appearance
