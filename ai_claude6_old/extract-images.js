#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * HTML内のdata URI形式の画像を抽出してファイルとして保存するスクリプト
 */

const HTML_FILE = path.join(__dirname, 'index.html');
const IMG_DIR = path.join(__dirname, 'img');
const SVG_DIR = path.join(__dirname, 'svg');

// MIME type から拡張子へのマッピング
const MIME_TO_EXT = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'image/bmp': '.bmp',
  'image/x-icon': '.ico'
};

/**
 * data URI をパースしてMIMEタイプとBase64データを取得
 */
function parseDataUri(dataUri) {
  const match = dataUri.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    return null;
  }
  return {
    mimeType: match[1],
    base64Data: match[2]
  };
}

/**
 * HTML内のdata URI形式の画像を全て抽出
 */
function extractDataUris(htmlContent) {
  const dataUris = [];

  // <img src="data:..."> パターン
  const imgPattern = /<img[^>]*src=["'](data:image\/[^"']+)["']/gi;
  let match;
  while ((match = imgPattern.exec(htmlContent)) !== null) {
    dataUris.push(match[1]);
  }

  // background-image: url(data:...) パターン
  const bgPattern = /background-image:\s*url\(["']?(data:image\/[^"')]+)["']?\)/gi;
  while ((match = bgPattern.exec(htmlContent)) !== null) {
    dataUris.push(match[1]);
  }

  // style="..." 内の background: url(data:...) パターン
  const stylePattern = /style=["'][^"']*background(?:-image)?:\s*url\(["']?(data:image\/[^"')]+)["']?\)[^"']*["']/gi;
  while ((match = stylePattern.exec(htmlContent)) !== null) {
    dataUris.push(match[1]);
  }

  return dataUris;
}

/**
 * data URI から画像ファイルを生成
 */
function saveDataUriAsImage(dataUri, index) {
  const parsed = parseDataUri(dataUri);
  if (!parsed) {
    console.log(`  ⚠️  画像 ${index + 1} のパースに失敗しました`);
    return null;
  }

  const { mimeType, base64Data } = parsed;
  const ext = MIME_TO_EXT[mimeType];

  if (!ext) {
    console.log(`  ⚠️  画像 ${index + 1}: サポートされていないMIMEタイプ (${mimeType})`);
    return null;
  }

  // ディレクトリの決定（SVGは svg/ に、それ以外は img/ に）
  const targetDir = ext === '.svg' ? SVG_DIR : IMG_DIR;

  // ディレクトリが存在しない場合は作成
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // ファイル名の生成（重複を避ける）
  let filename = `image-${String(index + 1).padStart(3, '0')}${ext}`;
  let filePath = path.join(targetDir, filename);
  let counter = 1;

  while (fs.existsSync(filePath)) {
    filename = `image-${String(index + 1).padStart(3, '0')}-${counter}${ext}`;
    filePath = path.join(targetDir, filename);
    counter++;
  }

  try {
    // Base64をデコードしてファイルに保存
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);

    const size = buffer.length;
    const dir = ext === '.svg' ? 'svg' : 'img';
    console.log(`  ✓ ${dir}/${filename} (${(size / 1024).toFixed(2)} KB)`);

    return { filename, dir, size };
  } catch (error) {
    console.error(`  ✗ 画像 ${index + 1} の保存に失敗: ${error.message}`);
    return null;
  }
}

/**
 * メイン処理
 */
function main() {
  console.log('🔍 HTML内の埋め込み画像を抽出中...\n');

  if (!fs.existsSync(HTML_FILE)) {
    console.error(`❌ ${HTML_FILE} が見つかりません`);
    process.exit(1);
  }

  const htmlContent = fs.readFileSync(HTML_FILE, 'utf-8');

  console.log('📝 data URI 形式の画像を検索中...\n');
  const dataUris = extractDataUris(htmlContent);

  if (dataUris.length === 0) {
    console.log('⚠️  埋め込み画像が見つかりませんでした。');
    console.log('   すでに外部ファイル参照になっているか、HTMLに画像がありません。\n');
    process.exit(0);
  }

  console.log(`📦 ${dataUris.length} 個の埋め込み画像を発見\n`);

  // 重複を除去（同じdata URIが複数箇所で使われている場合）
  const uniqueDataUris = [...new Set(dataUris)];
  console.log(`🎯 ユニーク画像数: ${uniqueDataUris.length} 個\n`);

  // 画像を保存
  const savedImages = [];
  uniqueDataUris.forEach((dataUri, index) => {
    const result = saveDataUriAsImage(dataUri, index);
    if (result) {
      savedImages.push(result);
    }
  });

  console.log('\n✨ 抽出完了！\n');
  console.log(`📊 統計:`);
  console.log(`   - 総埋め込み画像数: ${dataUris.length}`);
  console.log(`   - ユニーク画像数: ${uniqueDataUris.length}`);
  console.log(`   - 保存成功: ${savedImages.length}`);

  const totalSize = savedImages.reduce((sum, img) => sum + img.size, 0);
  console.log(`   - 総サイズ: ${(totalSize / 1024).toFixed(2)} KB\n`);

  console.log('💡 次のステップ:');
  console.log('   1. img/ と svg/ のファイル名を確認・リネーム');
  console.log('   2. index.html を編集して <img src="img/xxx.png"> 形式に変更');
  console.log('   3. npm run build で再度Base64埋め込み\n');
}

main();
