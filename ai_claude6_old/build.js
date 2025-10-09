#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 画像ファイルをBase64エンコードして、HTML/CSS内の参照を置換するビルドスクリプト
 */

const IMG_DIR = path.join(__dirname, 'img');
const SVG_DIR = path.join(__dirname, 'svg');
const HTML_FILE = path.join(__dirname, 'index.html');
const CSS_FILE = path.join(__dirname, 'custom-style.css');
const BACKUP_SUFFIX = '.original';

// MIME type マッピング
const MIME_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.bmp': 'image/bmp',
  '.ico': 'image/x-icon'
};

/**
 * ディレクトリ内の画像ファイルを取得
 */
function getImageFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`ディレクトリが存在しません: ${dir}`);
    return [];
  }

  const files = fs.readdirSync(dir);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return MIME_TYPES[ext];
  });
}

/**
 * 画像ファイルをBase64エンコード
 */
function encodeImageToBase64(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[ext];

  if (!mimeType) {
    throw new Error(`サポートされていない画像形式: ${ext}`);
  }

  const imageBuffer = fs.readFileSync(filePath);
  const base64 = imageBuffer.toString('base64');

  return `data:${mimeType};base64,${base64}`;
}

/**
 * HTMLファイル内の画像参照を置換
 */
function replaceImagesInHTML(htmlContent, imageMap) {
  let result = htmlContent;
  let replacementCount = 0;

  for (const [filename, dataUri] of Object.entries(imageMap)) {
    // <img src="img/xxx.png"> を置換
    const imgPattern = new RegExp(`(<img[^>]*src=["'])img/${filename}(["'][^>]*>)`, 'gi');
    const imgMatches = result.match(imgPattern);
    if (imgMatches) {
      result = result.replace(imgPattern, `$1${dataUri}$2`);
      replacementCount += imgMatches.length;
      console.log(`  ✓ <img src="img/${filename}"> を ${imgMatches.length} 箇所置換`);
    }

    // <img src="svg/xxx.svg"> を置換
    const svgPattern = new RegExp(`(<img[^>]*src=["'])svg/${filename}(["'][^>]*>)`, 'gi');
    const svgMatches = result.match(svgPattern);
    if (svgMatches) {
      result = result.replace(svgPattern, `$1${dataUri}$2`);
      replacementCount += svgMatches.length;
      console.log(`  ✓ <img src="svg/${filename}"> を ${svgMatches.length} 箇所置換`);
    }

    // background-image: url(img/xxx.png) を置換
    const bgPattern = new RegExp(`(background-image:\\s*url\\(["']?)img/${filename}(["']?\\))`, 'gi');
    const bgMatches = result.match(bgPattern);
    if (bgMatches) {
      result = result.replace(bgPattern, `$1${dataUri}$2`);
      replacementCount += bgMatches.length;
      console.log(`  ✓ background-image: url(img/${filename}) を ${bgMatches.length} 箇所置換`);
    }
  }

  return { content: result, count: replacementCount };
}

/**
 * CSSファイル内の画像参照を置換
 */
function replaceImagesInCSS(cssContent, imageMap) {
  let result = cssContent;
  let replacementCount = 0;

  for (const [filename, dataUri] of Object.entries(imageMap)) {
    // url(img/xxx.png) または url("img/xxx.png") を置換
    const patterns = [
      new RegExp(`(url\\(["']?)img/${filename}(["']?\\))`, 'gi'),
      new RegExp(`(url\\(["']?)svg/${filename}(["']?\\))`, 'gi')
    ];

    patterns.forEach(pattern => {
      const matches = result.match(pattern);
      if (matches) {
        result = result.replace(pattern, `$1${dataUri}$2`);
        replacementCount += matches.length;
        console.log(`  ✓ url(.../${filename}) を ${matches.length} 箇所置換`);
      }
    });
  }

  return { content: result, count: replacementCount };
}

/**
 * メイン処理
 */
function main() {
  console.log('🚀 画像Base64エンコード & HTML埋め込みビルド開始\n');

  // 画像ファイルの収集
  const imgFiles = getImageFiles(IMG_DIR);
  const svgFiles = getImageFiles(SVG_DIR);
  const allImageFiles = [
    ...imgFiles.map(f => ({ name: f, dir: IMG_DIR })),
    ...svgFiles.map(f => ({ name: f, dir: SVG_DIR }))
  ];

  if (allImageFiles.length === 0) {
    console.log('⚠️  img/ または svg/ ディレクトリに画像ファイルが見つかりませんでした。');
    console.log('   画像を配置してから再度実行してください。\n');
    process.exit(0);
  }

  console.log(`📁 画像ファイル: ${allImageFiles.length} 件\n`);

  // 画像をBase64エンコード
  const imageMap = {};
  allImageFiles.forEach(({ name, dir }) => {
    const filePath = path.join(dir, name);
    try {
      const dataUri = encodeImageToBase64(filePath);
      imageMap[name] = dataUri;
      const size = fs.statSync(filePath).size;
      console.log(`  ✓ ${name} (${(size / 1024).toFixed(2)} KB)`);
    } catch (error) {
      console.error(`  ✗ ${name} のエンコードに失敗: ${error.message}`);
    }
  });

  console.log('');

  // HTMLファイルの処理
  if (fs.existsSync(HTML_FILE)) {
    console.log('📝 index.html を処理中...\n');

    // バックアップ作成
    const backupFile = HTML_FILE + BACKUP_SUFFIX;
    if (!fs.existsSync(backupFile)) {
      fs.copyFileSync(HTML_FILE, backupFile);
      console.log(`  💾 バックアップ作成: index.html${BACKUP_SUFFIX}`);
    }

    const htmlContent = fs.readFileSync(HTML_FILE, 'utf-8');
    const { content: newHtml, count: htmlCount } = replaceImagesInHTML(htmlContent, imageMap);

    fs.writeFileSync(HTML_FILE, newHtml, 'utf-8');
    console.log(`\n  ✅ HTML内の画像参照を ${htmlCount} 箇所置換しました\n`);
  }

  // CSSファイルの処理
  if (fs.existsSync(CSS_FILE)) {
    console.log('🎨 custom-style.css を処理中...\n');

    // バックアップ作成
    const backupFile = CSS_FILE + BACKUP_SUFFIX;
    if (!fs.existsSync(backupFile)) {
      fs.copyFileSync(CSS_FILE, backupFile);
      console.log(`  💾 バックアップ作成: custom-style.css${BACKUP_SUFFIX}`);
    }

    const cssContent = fs.readFileSync(CSS_FILE, 'utf-8');
    const { content: newCss, count: cssCount } = replaceImagesInCSS(cssContent, imageMap);

    fs.writeFileSync(CSS_FILE, newCss, 'utf-8');
    console.log(`\n  ✅ CSS内の画像参照を ${cssCount} 箇所置換しました\n`);
  }

  console.log('✨ ビルド完了！\n');
  console.log('💡 元のファイルは .original 拡張子で保存されています。');
  console.log('   復元する場合: mv index.html.original index.html\n');
}

main();
