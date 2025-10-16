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
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
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
  const data = await loadCSV('text/service-text.csv');

  const commonText = await loadCommonText();

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


  // 追加CSVを読み込み
  const serviceMeta = await loadServiceMeta();
  const serviceSummary = await loadServiceSummary();
  const serviceDetail = await loadServiceDetail();
  const serviceReviews = await loadServiceReviews();
  const servicePricing = await loadServicePricing();
  const serviceBasicInfo = await loadServiceBasicInfo();
  const serviceCta = await loadServiceCta();

  return { tabData, commonText, serviceMeta, serviceSummary, serviceDetail, serviceReviews, servicePricing, serviceCta, serviceBasicInfo };
}

// service-text-transposed.csvを読み込んでtabData形式に変換
async function loadServiceTextTransposed() {
  const data = await loadCSV('text/service-text-transposed.csv');

  const commonText = await loadCommonText();

  if (data.length === 0) {
    console.error('❌ データが空です');
    return null;
  }

  // ヘッダー行から属性名のリストを取得（1列目以降がサービス名）
  const firstRow = data[0];
  const serviceNames = Object.keys(firstRow).filter(key => key !== 'attribute');

  // 行をオブジェクト化（attribute -> サービスごとの値）
  const attributeMap = {};
  data.forEach(row => {
    const attr = row.attribute;
    if (!attr) return;
    attributeMap[attr] = {};
    serviceNames.forEach(serviceName => {
      attributeMap[attr][serviceName] = row[serviceName] || '';
    });
  });

  // 属性名とtab/col/cellプロパティのマッピング
  const attrMapping = {
    // Tab 0 - 料金
    'price_icon': { tab: 0, col: 1, prop: 'icon' },
    'price': { tab: 0, col: 1, prop: 'value1' },
    'price_color': { tab: 0, col: 1, prop: 'value1Color' },
    'price_course': { tab: 0, col: 1, prop: 'value2' },
    'price_level_icon': { tab: 0, col: 2, prop: 'icon' },
    'price_level': { tab: 0, col: 2, prop: 'effect' },
    'price_level_color': { tab: 0, col: 2, prop: 'effectColor' },
    'feature': { tab: 0, col: 3, prop: 'feature' },
    
    // Tab 1 - サポート
    'support_icon': { tab: 1, col: 1, prop: 'icon' },
    'support_type': { tab: 1, col: 1, prop: 'value1' },
    'support_color': { tab: 1, col: 1, prop: 'value1Color' },
    'support_detail': { tab: 1, col: 1, prop: 'value2' },
    'location_icon': { tab: 1, col: 2, prop: 'icon' },
    'location': { tab: 1, col: 2, prop: 'effect' },
    'location_color': { tab: 1, col: 2, prop: 'effectColor' },
    'refund_icon': { tab: 1, col: 3, prop: 'icon' },
    'refund': { tab: 1, col: 3, prop: 'effect' },
    'refund_color': { tab: 1, col: 3, prop: 'effectColor' },
    
    // Tab 2 - 実績
    'students_icon': { tab: 2, col: 1, prop: 'icon' },
    'students': { tab: 2, col: 1, prop: 'value1' },
    'students_color': { tab: 2, col: 1, prop: 'value1Color' },
    'students_unit': { tab: 2, col: 1, prop: 'value2' },
    'rate1_icon': { tab: 2, col: 2, prop: 'icon' },
    'rate1': { tab: 2, col: 2, prop: 'value1' },
    'rate1_color': { tab: 2, col: 2, prop: 'value1Color' },
    'rate2_icon': { tab: 2, col: 3, prop: 'icon' },
    'rate2': { tab: 2, col: 3, prop: 'value1' },
    'rate2_color': { tab: 2, col: 3, prop: 'value1Color' }
  };

  // tabData構造を構築
  const tabData = {};

  for (let tabIndex = 0; tabIndex < 3; tabIndex++) {
    // ヘッダーを構築
    const headers = [];
    for (let colIndex = 1; colIndex <= 5; colIndex++) {
      const headerKey = `tab_${tabIndex}_header_${colIndex}`;
      headers.push(commonText[headerKey] || '');
    }

    // 各サービスの行を構築
    const rows = serviceNames.map(serviceName => {
      const logo = attributeMap['logo_path']?.[serviceName] || '';
      
      // このタブの列データを構築
      const cells = [null, {}, {}, {}]; // col 0は使わない、col 1-3を使う

      // 各属性をマッピングに従ってセルに配置
      Object.entries(attrMapping).forEach(([attr, mapping]) => {
        if (mapping.tab !== tabIndex) return;
        const value = attributeMap[attr]?.[serviceName];
        if (!value) return;

        if (!cells[mapping.col]) cells[mapping.col] = {};
        cells[mapping.col][mapping.prop] = value;
      });

      return {
        service: serviceName,
        logo: logo,
        cells: cells.slice(1) // col 0を除外
      };
    });

    tabData[tabIndex] = {
      headers: headers,
      rows: rows
    };
  }


  // 追加CSVを読み込み
  const serviceMeta = await loadServiceMeta();
  const serviceSummary = await loadServiceSummary();
  const serviceDetail = await loadServiceDetail();
  const serviceReviews = await loadServiceReviews();
  const servicePricing = await loadServicePricing();
  const serviceBasicInfo = await loadServiceBasicInfo();
  const serviceCta = await loadServiceCta();

  return { tabData, commonText, serviceMeta, serviceSummary, serviceDetail, serviceReviews, servicePricing, serviceCta, serviceBasicInfo };
}

// service-text.csv（コンパクト形式）を読み込んでtabData形式に変換
async function loadServiceText() {
  const data = await loadCSV('text/service-text.csv');

  const commonText = await loadCommonText();

  if (data.length === 0) {
    console.error('❌ データが空です');
    return null;
  }

  // ヘッダー行からサービス名を取得
  const firstRow = data[0];
  const serviceNames = Object.keys(firstRow).filter(key => key !== 'attribute');

  // 行をオブジェクト化（attribute -> サービスごとの値）
  const attributeMap = {};
  data.forEach(row => {
    const attr = row.attribute;
    if (!attr) return;
    attributeMap[attr] = {};
    serviceNames.forEach(serviceName => {
      attributeMap[attr][serviceName] = row[serviceName] || '';
    });
  });

  // カスタムタグをパースする関数
  function parseCell(cellValue) {
    // 短縮記法を展開
    cellValue = cellValue
      .replace(/<i1>/g, '<icon>ic_shape1.svg</icon>')
      .replace(/<i2>/g, '<icon>ic_shape2.svg</icon>')
      .replace(/<i3>/g, '<icon>ic_shape3.svg</icon>')
      .replace(/<i4>/g, '<icon>ic_shape4.svg</icon>');

    const cell = {};

    // <tag_r> タグを検出してリスト化
    if (cellValue.includes('<tag_r>')) {
      const items = cellValue.split('<tag_r>').map(item => item.trim()).filter(item => item);
      cell.renderAsList = true;
      cell.listItems = items;
      return cell;
    }

    // <icon>...</icon> を抽出
    const iconMatch = cellValue.match(/<icon>(.*?)<\/icon>/);
    if (iconMatch) {
      cell.icon = iconMatch[1];
      cellValue = cellValue.replace(iconMatch[0], '');
    }

    // 元の値全体を保持（feature用）
    const originalValue = cellValue;

    // <red>...</red> または <black>...</black> を抽出
    const colorMatch = cellValue.match(/<(red|black)>(.*?)<\/\1>/);
    if (colorMatch) {
      const color = colorMatch[1];
      const content = colorMatch[2]; // タグ内のコンテンツ

      // <br>がタグ内にあるか確認
      if (content.includes('<br>')) {
        // <br>がタグ内 → effectとして扱う
        cell.effect = content;
        cell.effectColor = color;
      } else {
        // <br>がタグ外 → value1として扱う
        cell.value1 = content;
        cell.value1Color = color;

        // タグを除去した後、<br>の後のテキストをvalue2として設定
        const afterColorTag = cellValue.replace(colorMatch[0], '');
        const brIndex = afterColorTag.indexOf('<br>');
        if (brIndex !== -1) {
          const afterBr = afterColorTag.substring(brIndex + 4);
          const cleanAfterBr = afterBr.replace(/<\/?[^>]+(>|$)/g, '').trim();
          if (cleanAfterBr) {
            cell.value2 = cleanAfterBr;
          }
        }
      }

      cellValue = cellValue.replace(colorMatch[0], '');
    }

    // <span>...</span> があるか、またはvalue1/effectが設定されている場合は常にfeatureを設定
    if (cellValue.includes('<span>')) {
      cell.feature = cellValue.trim();
    } else if (originalValue.trim()) {
      // 元の値全体をfeatureとして設定
      cell.feature = originalValue.trim();
    }

    return cell;
  }

  // tabData構造を構築
  const tabData = {};

  for (let tabIndex = 0; tabIndex < 3; tabIndex++) {
    // ヘッダーを構築
    const headers = [];
    for (let colIndex = 1; colIndex <= 5; colIndex++) {
      const headerKey = `tab_${tabIndex}_header_${colIndex}`;
      headers.push(commonText[headerKey] || '');
    }

    // 各サービスの行を構築
    const rows = serviceNames.map(serviceName => {
      const logo = attributeMap['logo_path']?.[serviceName] || '';
      
      // このタブの列データを構築
      const cells = [];
      for (let colIndex = 1; colIndex <= 3; colIndex++) {
        const cellKey = `tab${tabIndex}_col${colIndex}`;
        const cellValue = attributeMap[cellKey]?.[serviceName] || '';
        cells.push(parseCell(cellValue));
      }

      return {
        service: serviceName,
        logo: logo,
        cells: cells
      };
    });

    tabData[tabIndex] = {
      headers: headers,
      rows: rows
    };
  }


  // 追加CSVを読み込み
  const serviceMeta = await loadServiceMeta();
  const serviceSummary = await loadServiceSummary();
  const serviceDetail = await loadServiceDetail();
  const serviceReviews = await loadServiceReviews();
  const servicePricing = await loadServicePricing();
  const serviceBasicInfo = await loadServiceBasicInfo();
  const serviceCta = await loadServiceCta();

  return { tabData, commonText, serviceMeta, serviceSummary, serviceDetail, serviceReviews, servicePricing, serviceCta, serviceBasicInfo };
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
  return meta;
}

// service-summary.csvを読み込む（転置形式）
async function loadServiceSummary() {
  const data = await loadCSV('text/service-summary.csv');
  const summary = {};

  if (data.length === 0) {
    console.error('❌ service-summary.csv データが空です');
    return summary;
  }

  // ヘッダー行からサービス名を取得
  const firstRow = data[0];
  const serviceNames = Object.keys(firstRow).filter(key => key !== 'attribute');

  // 行をオブジェクト化（attribute -> サービスごとの値）
  const attributeMap = {};
  data.forEach(row => {
    const attr = row.attribute;
    if (!attr) return;
    attributeMap[attr] = {};
    serviceNames.forEach(serviceName => {
      attributeMap[attr][serviceName] = row[serviceName] || '';
    });
  });

  // サービスID マッピング（サービス名 -> service_id）
  const serviceIdMap = {
    'SHIFT AI': 'shiftai',
    'DMM 生成AICAMP': 'dmmai',
    '侍エンジニア': 'samuraiai'
  };

  // カスタムタグをパースする関数
  function parseSummaryCell(cellValue) {
    if (!cellValue) return '';

    // アイコン短縮記法を展開
    cellValue = cellValue
      .replace(/<i1>/g, '<icon>ic_shape1.svg</icon>')
      .replace(/<i2>/g, '<icon>ic_shape2.svg</icon>')
      .replace(/<i3>/g, '<icon>ic_shape3.svg</icon>')
      .replace(/<i4>/g, '<icon>ic_shape4.svg</icon>');

    // <bg-blue>...</bg-blue> または <bg_blue>...</bg_blue> を <span class="t-times">...</span> に変換
    cellValue = cellValue
      .replace(/<bg-blue>(.*?)<\/bg-blue>/g, '<span class="t-times">$1</span>')
      .replace(/<bg_blue>(.*?)<\/bg_blue>/g, '<span class="t-times">$1</span>');

    return cellValue;
  }

  // summary[serviceId] = { col1, col2, col3, col4, summaryCtaCopy } の形式に変換
  serviceNames.forEach(serviceName => {
    const serviceId = serviceIdMap[serviceName];
    if (!serviceId) return;

    summary[serviceId] = {
      col1: parseSummaryCell(attributeMap['col1']?.[serviceName] || ''),
      col2: parseSummaryCell(attributeMap['col2']?.[serviceName] || ''),
      col3: parseSummaryCell(attributeMap['col3']?.[serviceName] || ''),
      col4: parseSummaryCell(attributeMap['col4']?.[serviceName] || ''),
      summaryCtaCopy: parseSummaryCell(attributeMap['summary-cta-copy']?.[serviceName] || '')
    };
  });

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
      gender: row.gender,
      name: row.name,
      title: row.title,
      content: row.content,
      date: row.date,
      imageUrl: row.image_url
    });
  });
  return reviews;
}

async function loadServicePricing() {
  const data = await loadCSV('text/service-pricing.csv');
  const pricing = {};

  if (data.length === 0) {
    console.error('❌ service-pricing.csv データが空です');
    return pricing;
  }

  // ヘッダー行からサービス名を取得
  const firstRow = data[0];
  const serviceNames = Object.keys(firstRow).filter(key => key !== 'type');

  // 行をオブジェクト化（type -> サービスごとの値）
  const attributeMap = {};
  data.forEach(row => {
    const type = row.type;
    if (!type) return;
    attributeMap[type] = {};
    serviceNames.forEach(serviceName => {
      attributeMap[type][serviceName] = row[serviceName] || '';
    });
  });

  // サービスID マッピング（サービス名 -> service_id）
  const serviceIdMap = {
    'SHIFT AI': 'shiftai',
    'DMM 生成AICAMP': 'dmmai',
    '侍エンジニア': 'samuraiai'
  };

  // pricing[serviceId][programType] = { ... } の形式に変換
  serviceNames.forEach(serviceName => {
    const serviceId = serviceIdMap[serviceName];
    if (!serviceId) return;

    pricing[serviceId] = {};

    // type1_name, type1_img などから type1, type2... を抽出
    const typeSet = new Set();
    Object.keys(attributeMap).forEach(attr => {
      const match = attr.match(/^type(\d+)_/);
      if (match) {
        typeSet.add(match[1]);
      }
    });

    // 各typeごとにデータを構築
    Array.from(typeSet).forEach(programType => {
      const name = attributeMap[`type${programType}_name`]?.[serviceName];

      // プログラム名が空の場合はスキップ
      if (!name) return;

      // スキルリストは type_price から読み込む
      const skillValue = attributeMap[`type${programType}_price`]?.[serviceName] || '';
      let priceAsList = false;
      let priceListItems = [];

      if (skillValue.includes('<tag_r>')) {
        priceAsList = true;
        priceListItems = skillValue.split('<tag_r>').map(item => item.trim()).filter(item => item);
      }

      // 価格データは type_session から読み込む
      const sessionValue = attributeMap[`type${programType}_session`]?.[serviceName] || '';
      let totalPrice = sessionValue;
      let programDesc = '';

      if (sessionValue.includes('<br>')) {
        // sessionValueから価格と説明を分離（<br>で区切られている場合）
        const parts = sessionValue.split('<br>');
        totalPrice = parts[0];
        programDesc = parts[1] || '';
      }

      pricing[serviceId][programType] = {
        programName: name,
        programImage: attributeMap[`type${programType}_img`]?.[serviceName] || '',
        totalPrice: totalPrice,
        programDesc: programDesc,
        priceAsList: priceAsList,
        priceListItems: priceListItems,
        perSessionPrice: sessionValue,
        monthlyPrice: attributeMap[`type${programType}_monthly`]?.[serviceName] || ''
      };
    });
  });

  return pricing;
}

// service-basic-info.csvを読み込む（転置形式）
async function loadServiceBasicInfo() {
  const data = await loadCSV('text/service-basic-info.csv');
  const basicInfo = {};

  if (data.length === 0) {
    console.error('❌ service-basic-info.csv データが空です');
    return basicInfo;
  }

  // ヘッダー行からサービス名を取得
  const firstRow = data[0];
  const serviceNames = Object.keys(firstRow).filter(key => key !== 'attribute');

  // 行をオブジェクト化（attribute -> サービスごとの値）
  const attributeMap = {};
  data.forEach(row => {
    const attr = row.attribute;
    if (!attr) return;
    attributeMap[attr] = {};
    serviceNames.forEach(serviceName => {
      attributeMap[attr][serviceName] = row[serviceName] || '';
    });
  });

  // サービスID マッピング（サービス名 -> service_id）
  const serviceIdMap = {
    'SHIFT AI': 'shiftai',
    'DMM 生成AICAMP': 'dmmai',
    '侍エンジニア': 'samuraiai'
  };

  // basicInfo[serviceId][tabIndex][colIndex] = value の形式に変換
  serviceNames.forEach(serviceName => {
    const serviceId = serviceIdMap[serviceName];
    if (!serviceId) return;

    basicInfo[serviceId] = {};

    Object.keys(attributeMap).forEach(attr => {
      // tab2_col1 のような形式から tab と col を抽出
      const match = attr.match(/^tab(\d+)_col(\d+)$/);
      if (match) {
        const tabIndex = match[1];
        const colIndex = match[2];

        if (!basicInfo[serviceId][tabIndex]) {
          basicInfo[serviceId][tabIndex] = {};
        }

        basicInfo[serviceId][tabIndex][colIndex] = attributeMap[attr][serviceName];
      }
    });
  });

  return basicInfo;
}

// service-cta.csvを読み込む（転置形式）
async function loadServiceCta() {
  const data = await loadCSV('text/service-cta.csv');
  const cta = {};

  if (data.length === 0) {
    console.error('❌ service-cta.csv データが空です');
    return cta;
  }

  // ヘッダー行からサービス名を取得
  const firstRow = data[0];
  const serviceNames = Object.keys(firstRow).filter(key => key !== 'attribute');

  // 行をオブジェクト化（attribute -> サービスごとの値）
  const attributeMap = {};
  data.forEach(row => {
    const attr = row.attribute;
    if (!attr) return;
    attributeMap[attr] = {};
    serviceNames.forEach(serviceName => {
      attributeMap[attr][serviceName] = row[serviceName] || '';
    });
  });

  // サービスID マッピング（サービス名 -> service_id）
  const serviceIdMap = {
    'SHIFT AI': 'shiftai',
    'DMM 生成AICAMP': 'dmmai',
    '侍エンジニア': 'samuraiai'
  };

  // cta[serviceId] = { officialUrl, seminarUrl, ctaCopy, buttonSeminarText } の形式に変換
  serviceNames.forEach(serviceName => {
    const serviceId = serviceIdMap[serviceName];
    if (!serviceId) return;

    cta[serviceId] = {
      officialUrl: attributeMap['official_url']?.[serviceName] || '',
      seminarUrl: attributeMap['seminar_url']?.[serviceName] || '',
      ctaCopy: attributeMap['summary-cta-copy']?.[serviceName] || '',
      buttonSeminarText: attributeMap['button_seminar_text']?.[serviceName] || '',
      benefitsList: attributeMap['benefits_list']?.[serviceName] || ''
    };
  });

  return cta;
}
