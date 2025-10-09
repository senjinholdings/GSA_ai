// CSV読み込みユーティリティ

// CSVをパースする関数
function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index] ? values[index].trim() : '';
    });
    data.push(row);
  }

  return data;
}

// CSV行をパースする（カンマ区切り、引用符対応）
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

// CSVファイルを読み込む
async function loadCSV(url) {
  try {
    console.log('📥 CSV読み込み中:', url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    console.log('✅ CSV取得成功:', url, '(' + text.length + 'バイト)');
    return parseCSV(text);
  } catch (error) {
    console.error('❌ CSV読み込みエラー:', url, error);
    console.error('💡 ヒント: ローカルサーバーを起動していますか？ (python3 -m http.server 8000)');
    return [];
  }
}

// common-text.csvを読み込んでオブジェクト化
async function loadCommonText() {
  const data = await loadCSV('text/common-text.csv');
  const commonText = {};
  data.forEach(row => {
    commonText[row.key] = row.value;
  });
  return commonText;
}

// service-text.csvを読み込んでtabData形式に変換
async function loadServiceText() {
  console.log('📊 CSV読み込み開始...');
  const data = await loadCSV('text/service-text.csv');
  console.log('✅ service-text.csv読み込み完了:', data.length + '行');

  const commonText = await loadCommonText();
  console.log('✅ common-text.csv読み込み完了:', Object.keys(commonText).length + '項目');

  // サービスIDのリストを取得（順序を保持）
  const serviceIds = [];
  const serviceInfo = {};

  data.forEach(row => {
    if (!serviceIds.includes(row.service_id)) {
      serviceIds.push(row.service_id);
      serviceInfo[row.service_id] = {
        name: row.service_name,
        logo: row.logo_path
      };
    }
  });

  // tabDataを構築
  const tabData = {};

  // 各タブ（0, 1, 2）に対して
  for (let tabIndex = 0; tabIndex < 3; tabIndex++) {
    // ヘッダーを構築
    const headers = [];
    for (let colIndex = 1; colIndex <= 5; colIndex++) {
      const headerKey = `tab_${tabIndex}_header_${colIndex}`;
      headers.push(commonText[headerKey] || '');
    }

    // 各サービスの行を構築
    const rows = serviceIds.map(serviceId => {
      const service = serviceInfo[serviceId];
      const serviceCells = data.filter(row =>
        row.service_id === serviceId &&
        parseInt(row.tab_index) === tabIndex
      );

      // col_indexでソート
      serviceCells.sort((a, b) => parseInt(a.col_index) - parseInt(b.col_index));

      // セルデータを構築
      const cells = serviceCells.map(cellData => {
        const cell = {};

        if (cellData.icon) cell.icon = cellData.icon;
        if (cellData.value1) cell.value1 = cellData.value1;
        if (cellData.value1_color) cell.value1Color = cellData.value1_color;
        if (cellData.value2) cell.value2 = cellData.value2;
        if (cellData.effect) cell.effect = cellData.effect;
        if (cellData.effect_color) cell.effectColor = cellData.effect_color;
        if (cellData.feature) cell.feature = cellData.feature;

        return cell;
      });

      return {
        service: service.name,
        logo: service.logo,
        cells: cells
      };
    });

    tabData[tabIndex] = {
      headers: headers,
      rows: rows
    };
  }

  console.log('✅ tabData構築完了:', tabData);
  console.log('📝 タブ0の1行目のセル:', tabData[0]?.rows[0]?.cells);

  // 追加CSVを読み込み
  const serviceMeta = await loadServiceMeta();
  const serviceSummary = await loadServiceSummary();
  const serviceDetail = await loadServiceDetail();
  const serviceReviews = await loadServiceReviews();
  const servicePricing = await loadServicePricing();
  const serviceCta = await loadServiceCta();

  return { tabData, commonText, serviceMeta, serviceSummary, serviceDetail, serviceReviews, servicePricing, serviceCta };
}

// service-meta.csvを読み込む
async function loadServiceMeta() {
  const data = await loadCSV('text/service-meta.csv');
  const meta = {};
  data.forEach(row => {
    meta[row.service_id] = {
      name: row.service_name,
      logo: row.logo_path,
      ratingScore: row.rating_score
    };
  });
  console.log('✅ service-meta.csv読み込み完了:', Object.keys(meta).length + 'サービス');
  return meta;
}

// service-summary.csvを読み込む
async function loadServiceSummary() {
  const data = await loadCSV('text/service-summary.csv');
  const summary = {};
  data.forEach(row => {
    summary[row.service_id] = {
      col1: row.col1,
      col2: row.col2,
      col3: row.col3,
      col4: row.col4
    };
  });
  console.log('✅ service-summary.csv読み込み完了:', Object.keys(summary).length + 'サービス');
  return summary;
}

// service-detail.csvを読み込む
async function loadServiceDetail() {
  const data = await loadCSV('text/service-detail.csv');
  const detail = {};
  data.forEach(row => {
    if (!detail[row.service_id]) {
      detail[row.service_id] = [];
    }
    detail[row.service_id].push({
      heading: row.heading,
      content: row.content
    });
  });
  console.log('✅ service-detail.csv読み込み完了:', Object.keys(detail).length + 'サービス');
  return detail;
}

// service-reviews.csvを読み込む
async function loadServiceReviews() {
  const data = await loadCSV('text/service-reviews.csv');
  const reviews = {};
  data.forEach(row => {
    if (!reviews[row.service_id]) {
      reviews[row.service_id] = [];
    }
    reviews[row.service_id].push({
      age: row.age,
      gender: row.gender,
      title: row.title,
      content: row.content,
      date: row.date,
      imageUrl: row.image_url
    });
  });
  console.log('✅ service-reviews.csv読み込み完了:', Object.keys(reviews).length + 'サービス');
  return reviews;
}

async function loadServicePricing() {
  const data = await loadCSV('text/service-pricing.csv');
  const pricing = {};

  data.forEach(row => {
    if (!pricing[row.service_id]) {
      pricing[row.service_id] = {};
    }
    pricing[row.service_id][row.program_type] = {
      totalPrice: row.total_price,
      programDesc: row.program_desc,
      perSessionPrice: row.per_session_price,
      monthlyPrice: row.monthly_price
    };
  });
  console.log('✅ service-pricing.csv読み込み完了:', Object.keys(pricing).length + 'サービス');
  return pricing;
}

// service-cta.csvを読み込む
async function loadServiceCta() {
  const data = await loadCSV('text/service-cta.csv');
  const cta = {};
  data.forEach(row => {
    cta[row.service_id] = {
      officialUrl: row.official_url,
      seminarUrl: row.seminar_url
    };
  });
  console.log('✅ service-cta.csv読み込み完了:', Object.keys(cta).length + 'サービス');
  return cta;
}
