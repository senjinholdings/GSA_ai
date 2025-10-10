// AI副業比較ナビ - インタラクティブ機能

document.addEventListener('DOMContentLoaded', async function() {

  // ==================== CSVデータ読み込み ====================
  console.log('🚀 app.js: CSV読み込み開始');
  const { tabData, commonText, serviceMeta, serviceSummary, serviceDetail, serviceReviews, servicePricing, serviceCta, serviceBasicInfo } = await loadServiceText();
  console.log('✅ app.js: CSV読み込み完了');
  console.log('📊 tabData:', tabData);
  console.log('📝 commonText:', commonText);
  console.log('📋 serviceMeta:', serviceMeta);
  console.log('📄 serviceSummary:', serviceSummary);
  console.log('📝 serviceDetail:', serviceDetail);
  console.log('💬 serviceReviews:', serviceReviews);
  console.log('💰 servicePricing:', servicePricing);
  console.log('🔗 serviceCta:', serviceCta);

  // ==================== タイトルテキストの更新 ====================
  const titleLabels = document.querySelectorAll('.copy1-label');
  if (titleLabels.length >= 3) {
    titleLabels[0].textContent = commonText.title_label_1 || '料金';
    titleLabels[1].textContent = commonText.title_label_2 || '効果';
    titleLabels[2].textContent = commonText.title_label_3 || '難易度';
  }

  const titleCrosses = document.querySelectorAll('.copy1-cross');
  titleCrosses.forEach(cross => {
    cross.textContent = commonText.title_cross || '×';
  });

  const titleText = document.querySelector('.copy1-text');
  if (titleText) {
    titleText.textContent = commonText.title_text || 'で選ぶ';
  }

  const titleMarker = document.querySelector('.title-copy2 .marker');
  if (titleMarker) {
    titleMarker.textContent = commonText.title_marker || 'おすすめ';
  }

  const titleCopy2 = document.querySelector('.title-copy2');
  if (titleCopy2) {
    // markerの後のテキストノードを更新
    const textNode = Array.from(titleCopy2.childNodes).find(
      node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
    );
    if (textNode) {
      textNode.textContent = commonText.title_main || 'AI副業スクール';
    }
  }

  // ==================== サマリーテーブルヘッダーの更新 ====================
  const summaryTables = document.querySelectorAll('.summary-table table');
  summaryTables.forEach(table => {
    const headerCells = table.querySelectorAll('tr:first-child th');
    if (headerCells.length >= 4) {
      headerCells[0].textContent = commonText.summary_table_header_1 || 'ライティング料金';
      headerCells[1].textContent = commonText.summary_table_header_2 || '総合スキル習得';
      headerCells[2].textContent = commonText.summary_table_header_3 || '効果';
      headerCells[3].textContent = commonText.summary_table_header_4 || '難易度';
    }
  });

  // ==================== サマリーセクションの特徴テキスト更新 ====================
  const summaryCtaCopies = document.querySelectorAll('.summary-cta-copy .copy-text');
  if (tabData[0] && tabData[0].rows) {
    tabData[0].rows.forEach((row, index) => {
      if (summaryCtaCopies[index] && row.cells[2] && row.cells[2].feature) {
        summaryCtaCopies[index].innerHTML = row.cells[2].feature;
      }
    });
  }

  // ==================== ランキングカードの特徴テキスト更新 ====================
  const rankingCardLeads = document.querySelectorAll('.rankingCard__lead');
  if (tabData[0] && tabData[0].rows) {
    tabData[0].rows.forEach((row, index) => {
      if (rankingCardLeads[index] && row.cells[2] && row.cells[2].feature) {
        rankingCardLeads[index].innerHTML = row.cells[2].feature;
      }
    });
  }

  // ==================== ボタンテキストの更新 ====================
  const seminarButtons = document.querySelectorAll('.cta-button-2');
  seminarButtons.forEach(btn => {
    btn.innerHTML = commonText.button_seminar_text || '無料<br/>セミナーに参加する';
  });

  const detailLinks = document.querySelectorAll('.summary-cta-btn a');
  detailLinks.forEach((link, index) => {
    link.innerHTML = commonText.button_detail_text || '詳細を見る +';
  });

  // ==================== サービスIDリスト ====================
  const serviceIds = ['shiftai', 'dmmai', 'samuraiai'];

  // 公式サイトを見るボタン (.summary-cta-btn.btn-wide) のURL設定
  const officialSiteLinks = document.querySelectorAll('.summary-cta-btn.btn-wide');
  officialSiteLinks.forEach((link, index) => {
    const serviceId = serviceIds[index];
    if (serviceCta[serviceId]?.officialUrl) {
      link.href = serviceCta[serviceId].officialUrl;
      link.target = '_blank';
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(serviceCta[serviceId].officialUrl, '_blank');
      });
    }
  });

  // ==================== CTA URL設定 ====================
  const rankingCards = document.querySelectorAll('.rankingCard');
  rankingCards.forEach((card, index) => {
    const serviceId = serviceIds[index];
    if (serviceCta[serviceId]) {
      // セミナーボタン (.cta-button-2) - 複数のボタンに対応
      const seminarBtns = card.querySelectorAll('.cta-button-2');
      seminarBtns.forEach(seminarBtn => {
        if (seminarBtn && serviceCta[serviceId].seminarUrl) {
          seminarBtn.addEventListener('click', () => {
            window.open(serviceCta[serviceId].seminarUrl, '_blank');
          });
        }
      });

      // 公式サイトボタン (.cta-button-3) - 複数のボタンに対応
      const officialBtns = card.querySelectorAll('.cta-button-3');
      officialBtns.forEach(officialBtn => {
        if (officialBtn && serviceCta[serviceId].officialUrl) {
          officialBtn.addEventListener('click', () => {
            window.open(serviceCta[serviceId].officialUrl, '_blank');
          });
        }
      });
    }
  });

  // ==================== 評価スコアの更新 ====================
  const scoreSpans = document.querySelectorAll('.summary-score span');
  scoreSpans.forEach((span, index) => {
    const serviceId = serviceIds[index];
    if (serviceMeta[serviceId]) {
      span.textContent = serviceMeta[serviceId].ratingScore;
    }
  });

  // ==================== サマリーテーブル行データの更新 ====================
  const replaceCustomSummaryTags = (text) => {
    if (!text) return '';
    return text
      .replace(/<\s*(sq-[a-z0-9_-]+)([^>]*)>/gi, (match, tagName, attrs) => {
        const classMatch = attrs.match(/\sclass\s*=\s*"([^"]*)"/i) || attrs.match(/\sclass\s*=\s*'([^']*)'/i);
        if (classMatch) {
          const fullMatch = classMatch[0];
          const existingClasses = classMatch[1];
          const updated = fullMatch.replace(existingClasses, `${tagName} ${existingClasses}`);
          return `<span${attrs.replace(fullMatch, updated)}>`;
        }
        return `<span class="${tagName}"${attrs}>`;
      })
      .replace(/<\s*\/\s*(sq-[a-z0-9_-]+)\s*>/gi, '</span>');
  };

  const buildSummaryCellContent = (rawValue) => {
    const safeValue = rawValue || '';
    const parts = safeValue.split('<br>');
    const topRaw = replaceCustomSummaryTags(parts.shift() || '');
    const bottomRaw = replaceCustomSummaryTags(parts.join('<br>'));
    const hasCustomTag = /<span\s+class="sq-[^"]*"/i.test(topRaw);

    let topSection = '';
    if (topRaw) {
      topSection = hasCustomTag
        ? `<div class="t-times">${topRaw}</div>`
        : `<div>${topRaw}</div>`;
    }
    const bottomSection = bottomRaw ? `<div class="t-price">${bottomRaw}</div>` : '';

    return topSection + bottomSection;
  };

  const summaryTableRows = document.querySelectorAll('.summary-table table tr:nth-child(2) td');
  let cellIndex = 0;
  serviceIds.forEach(serviceId => {
    if (serviceSummary[serviceId]) {
      if (summaryTableRows[cellIndex]) {
        const commentEl = summaryTableRows[cellIndex].querySelector('.t-comment');
        if (commentEl) {
          commentEl.innerHTML = buildSummaryCellContent(serviceSummary[serviceId].col1);
        }
      }
      cellIndex++;
      if (summaryTableRows[cellIndex]) {
        const commentEl = summaryTableRows[cellIndex].querySelector('.t-comment');
        if (commentEl) {
          commentEl.innerHTML = buildSummaryCellContent(serviceSummary[serviceId].col2);
        }
      }
      cellIndex++;
      if (summaryTableRows[cellIndex]) {
        const commentEl = summaryTableRows[cellIndex].querySelector('.t-comment');
        if (commentEl) {
          commentEl.innerHTML = replaceCustomSummaryTags(serviceSummary[serviceId].col3);
        }
      }
      cellIndex++;
      if (summaryTableRows[cellIndex]) {
        const commentEl = summaryTableRows[cellIndex].querySelector('.t-comment');
        if (commentEl) {
          commentEl.textContent = serviceSummary[serviceId].col4;
        }
      }
      cellIndex++;
    }
  });

  // ==================== ランキングカード詳細セクションの更新 ====================
  rankingCards.forEach((card, index) => {
    const serviceId = serviceIds[index];
    if (serviceDetail[serviceId]) {
      const pointItems = card.querySelector('.rankingCard__pointItems');
      if (pointItems) {
        let html = '';
        serviceDetail[serviceId].forEach(section => {
          html += `<h2>${section.heading}</h2><p>${section.content}</p>`;
        });
        pointItems.innerHTML = html;
      }
    }
  });

  // ==================== 口コミデータの更新 ====================
  rankingCards.forEach((card, index) => {
    const serviceId = serviceIds[index];
    if (serviceReviews[serviceId]) {
      const kuchikomiList = card.querySelector('.kuchikomi_list');
      if (kuchikomiList) {
        let html = '';
        serviceReviews[serviceId].forEach(review => {
          html += `
            <li class="kuchikomi_item" data-v-769f10cc="">
              <div class="kuchikomi_head" data-v-769f10cc="">
                <img alt="${review.age}歳/${review.gender}の口コミ" class="human" data-v-769f10cc="" height="60" src="${review.imageUrl}" width="47"/>
                <div class="inner" data-v-769f10cc="">
                  <h4 class="title" data-v-769f10cc="">${review.title}</h4>
                  <p class="author" data-v-769f10cc="">${review.age}歳/${review.gender}</p>
                </div>
              </div>
              <p class="text" data-v-769f10cc="">${review.content}</p>
              <p class="text quote" data-v-769f10cc="">${review.date}</p>
            </li>
          `;
        });
        kuchikomiList.innerHTML = html;
      }
    }
  });

  // ==================== サービス名の一括更新 ====================
  serviceIds.forEach((serviceId, index) => {
    if (serviceMeta[serviceId]) {
      const serviceName = serviceMeta[serviceId].name;

      // 1. ランキングカードのサービス名 (.rankingCard__name)
      const rankingCardNames = document.querySelectorAll('.rankingCard__name');
      if (rankingCardNames[index]) {
        rankingCardNames[index].textContent = serviceName;
      }

      // 2. サマリーヘッダーのサービス名 (.summary-header-name h3)
      const summaryHeaderNames = document.querySelectorAll('.summary-header-name h3');
      if (summaryHeaderNames[index]) {
        summaryHeaderNames[index].textContent = serviceName;
      }

      // 3. 比較表のサービス名 (.cta-text)
      const ctaTexts = document.querySelectorAll('.rankingcomparetable .cta-text');
      if (ctaTexts[index]) {
        ctaTexts[index].childNodes[0].textContent = serviceName + ' ';
      }

      // 4. 基本情報のタイトル (.c-basicInfo__ttl)
      const card = rankingCards[index];
      if (card) {
        const basicInfoTitle = card.querySelector('.c-basicInfo.rankingCard__basicInfo:not(.rankingCard__kuchikomi) .c-basicInfo__ttl');
        if (basicInfoTitle) {
          basicInfoTitle.textContent = serviceName + 'の基本情報';
        }
      }

      // 5. フッターのリンク (a[href^="#rankingCard"])
      const footerLinks = document.querySelectorAll('.footer_contents a[href^="#rankingCard"]');
      if (footerLinks[index]) {
        footerLinks[index].textContent = serviceName;
      }
    }
  });

  // ==================== 共通テキストの反映 ====================
  // 1. 基本情報タブ
  const basicInfoTabs = document.querySelectorAll('.c-basicInfo__tab');
  basicInfoTabs.forEach((tab, index) => {
    const tabIndex = (index % 4) + 1;
    const key = `basic_info_tab_${tabIndex}`;
    if (commonText[key]) {
      tab.textContent = commonText[key];
    }
  });

  // 2. テーブルヘッダー
  const tableHeaders = document.querySelectorAll('.c-basicInfo__tablePartsTh, .c-basicInfo__table thead th');
  if (tableHeaders.length > 0 && commonText.table_header_program) {
    tableHeaders.forEach((th) => {
      const text = th.textContent.trim();
      if (text === 'プログラム' || text.includes('プログラム')) {
        th.textContent = commonText.table_header_program;
      } else if (text === '総額') {
        th.textContent = commonText.table_header_total;
      } else if (text === '一回あたり') {
        th.textContent = commonText.table_header_per_session;
      } else if (text.includes('月額')) {
        th.innerHTML = `${commonText.table_header_monthly}<small class="c-basicInfo__tablePartsThAnnot">${commonText.table_header_monthly_note}</small>`;
      }
    });
  }

  const basicInfoHeaderMap = [
    { defaultText: '学習形式', key: 'basic_info_learning_format' },
    { defaultText: '難易度', key: 'basic_info_difficulty' },
    { defaultText: 'レッスン時間', key: 'basic_info_lesson_time' },
    { defaultText: '受講スタイル', key: 'basic_info_learning_style' },
    { defaultText: 'サポート時間', key: 'basic_info_support_hours' },
    { defaultText: '予約変更', key: 'basic_info_reservation_change' },
    { defaultText: '質問サポート', key: 'basic_info_question_support' },
    { defaultText: '転職支援', key: 'basic_info_career_support' },
    { defaultText: '返金保証', key: 'basic_info_refund_policy' }
  ];

  const tbodyHeaderCells = document.querySelectorAll('.c-basicInfo__table tbody tr:first-child th');
  tbodyHeaderCells.forEach((th) => {
    const currentText = th.textContent.trim();
    const mapping = basicInfoHeaderMap.find(({ defaultText }) => defaultText === currentText);
    if (mapping && commonText[mapping.key]) {
      th.textContent = commonText[mapping.key];
    }
  });

  // 3. プログラム名と価格表の更新
  document.querySelectorAll('.c-basicInfo').forEach((basicInfoSection) => {
    const serviceName = basicInfoSection.querySelector('h3')?.textContent.replace('の基本情報', '');
    if (!serviceName) return;

    const serviceEntry = Object.entries(serviceMeta).find(([, meta]) => meta.name === serviceName);
    if (!serviceEntry) return;

    const [serviceId] = serviceEntry;
    const basicInfoData = serviceBasicInfo[serviceId] || {};
    if (!servicePricing[serviceId]) return;

    const pricingEntries = Object.entries(servicePricing[serviceId])
      .sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10))
      .map(([, value]) => value);

    const tableElement = basicInfoSection.querySelector('.c-basicInfo__table');
    if (!tableElement) return;

    let programBodies = Array.from(tableElement.querySelectorAll('tbody'))
      .filter(tbody => tbody.querySelector('.c-basicInfo__tablePartName span'));

    if (programBodies.length === 0) return;

    const createEmptyRow = (tbody) => {
      const cloned = tbody.cloneNode(true);
      cloned.style.display = '';
      const programNameEl = cloned.querySelector('.c-basicInfo__tablePartName span');
      if (programNameEl) {
        programNameEl.textContent = '';
      }

      const imageWrapper = cloned.querySelector('.c-basicInfo__tablePartImg');
      if (imageWrapper) {
        imageWrapper.style.display = 'none';
        const imageEl = imageWrapper.querySelector('img');
        if (imageEl) {
          imageEl.removeAttribute('src');
          imageEl.alt = '';
        }
      }

      const cells = cloned.querySelectorAll('td');
      const priceCell = cells[1];
      if (priceCell) {
        const priceSpan = priceCell.querySelector('span:first-child');
        const descSpan = priceCell.querySelector('.c-basicInfo__tablePriceDesc');
        if (priceSpan) priceSpan.textContent = '';
        if (descSpan) descSpan.textContent = '';
      }

      const perSessionCell = cells[2];
      if (perSessionCell) {
        perSessionCell.textContent = '';
      }

      const monthlyCell = cells[3];
      if (monthlyCell) {
        monthlyCell.textContent = '';
      }

      return cloned;
    };

    if (programBodies.length < pricingEntries.length) {
      const templateBody = createEmptyRow(programBodies[programBodies.length - 1]);
      while (programBodies.length < pricingEntries.length) {
        const newBody = templateBody.cloneNode(true);
        tableElement.appendChild(newBody);
        programBodies.push(newBody);
      }
    }

    programBodies.forEach((tbody, index) => {
      const row = tbody.querySelector('tr');
      if (!row) return;

      if (index >= pricingEntries.length) {
        tbody.style.display = 'none';
        return;
      }

      const pricing = pricingEntries[index];
      tbody.style.display = 'table-row-group';

      const programNameEl = tbody.querySelector('.c-basicInfo__tablePartName span');
      if (programNameEl && pricing.programName) {
        programNameEl.textContent = pricing.programName;
      }

      const imageWrapper = tbody.querySelector('.c-basicInfo__tablePartImg');
      if (imageWrapper) {
        const imageEl = imageWrapper.querySelector('img');
        if (pricing.programImage) {
          if (imageEl) {
            imageEl.src = pricing.programImage;
            imageEl.alt = pricing.programName ? `${pricing.programName}のイメージ` : 'プログラムイメージ';
          }
          imageWrapper.style.display = '';
        } else {
          if (imageEl) {
            imageEl.removeAttribute('src');
            imageEl.alt = '';
          }
          imageWrapper.style.display = 'none';
        }
      }

      const cells = row.querySelectorAll('td');

      const priceCell = cells[1];
      if (priceCell) {
        const priceSpan = priceCell.querySelector('span:first-child');
        const descSpan = priceCell.querySelector('.c-basicInfo__tablePriceDesc');

        if (priceSpan && pricing.totalPrice) {
          const priceValue = pricing.totalPrice.includes('円') ? pricing.totalPrice : `${pricing.totalPrice}円`;
          priceSpan.textContent = priceValue;
        }
        if (descSpan && pricing.programDesc !== undefined) {
          descSpan.textContent = pricing.programDesc;
        }
      }

      const perSessionCell = cells[2];
      if (perSessionCell) {
        if (pricing.perSessionPrice) {
          const perSessionValue = pricing.perSessionPrice.includes('円') ? pricing.perSessionPrice : `${pricing.perSessionPrice}円`;
          perSessionCell.textContent = perSessionValue;
        } else {
          perSessionCell.textContent = '';
        }
      }

      const monthlyCell = cells[3];
      if (monthlyCell) {
        if (pricing.monthlyPrice) {
          const monthlyValue = pricing.monthlyPrice.includes('円') ? pricing.monthlyPrice : `${pricing.monthlyPrice}円`;
          monthlyCell.textContent = monthlyValue;
        } else {
          monthlyCell.textContent = commonText.monthly_plan_none || '';
        }
      }
    });

    const infoItems = basicInfoSection.querySelectorAll('.c-basicInfo__item');
    const tabMappings = [
      { tabIndex: 2, itemIndex: 1 },
      { tabIndex: 3, itemIndex: 2 },
      { tabIndex: 4, itemIndex: 3 }
    ];

    tabMappings.forEach(({ tabIndex, itemIndex }) => {
      const tabDataForService = basicInfoData[tabIndex];
      const itemElement = infoItems[itemIndex];
      if (!tabDataForService || !itemElement) return;

      const table = itemElement.querySelector('table');
      if (!table) return;

      const row = table.querySelector('tbody tr');
      if (!row) return;

      const cells = row.querySelectorAll('td');
      cells.forEach((cell, cellIndex) => {
        const colValue = tabDataForService[cellIndex + 1];
        if (colValue !== undefined) {
          cell.innerHTML = colValue;
        } else {
          cell.innerHTML = '';
        }
      });
    });
  });

  // 4. 「詳しく見る」ボタンは非表示化
  document.querySelectorAll('.c-basicInfo__table button').forEach((btn) => {
    const wrapper = btn.parentElement;
    btn.remove();
    if (wrapper && wrapper.childElementCount === 0) {
      wrapper.remove();
    }
  });

  // 5. 「受講者の口コミ」見出し
  const reviewHeadings = document.querySelectorAll('h3');
  reviewHeadings.forEach((h3) => {
    if (h3.textContent.includes('受講者の口コミ')) {
      h3.textContent = commonText.section_reviews;
    }
  });

  // 6. 「(総合評価)」ラベル
  const overallRatingLabels = document.querySelectorAll('.score-text');
  overallRatingLabels.forEach((label) => {
    if (label.textContent.includes('総合評価')) {
      label.textContent = commonText.label_overall_rating;
    }
  });

  // 7. 免責事項
  const disclaimers = document.querySelectorAll('.mv__underMvText');
  disclaimers.forEach((disclaimer) => {
    if (disclaimer.textContent.includes('プロモーション')) {
      disclaimer.textContent = commonText.disclaimer;
    }
  });

  // 8. 絞り込み検索
  const filterHeading = document.querySelector('.modalArea__ttl');
  if (filterHeading) {
    filterHeading.textContent = commonText.filter_heading;
  }

  // 9. ヘッダー
  const siteNameLinks = document.querySelectorAll('.header__logo a, .footer h4 a');
  siteNameLinks.forEach((link) => {
    if (link.textContent.includes('AI副業おすすめ比較')) {
      link.textContent = commonText.site_name;
    }
  });

  const siteDescription = document.querySelector('.header__catchcopy');
  if (siteDescription) {
    siteDescription.textContent = commonText.site_description;
  }

  // 10. フッター
  const footerHeadings = document.querySelectorAll('.footer_contents h5');
  footerHeadings.forEach((h5) => {
    if (h5.textContent.includes('人気スクール')) {
      h5.textContent = commonText.footer_popular_schools;
    } else if (h5.textContent.includes('運営')) {
      h5.textContent = commonText.footer_management;
    }
  });

  const footerLinks2 = document.querySelectorAll('.footer_contents a');
  footerLinks2.forEach((link) => {
    const text = link.textContent.trim();
    if (text === '運営者情報') {
      link.textContent = commonText.footer_company;
    } else if (text === 'プライバシーポリシー') {
      link.textContent = commonText.footer_privacy;
    } else if (text === '免責事項') {
      link.textContent = commonText.footer_disclaimer;
    } else if (text === 'お問い合わせ') {
      link.textContent = commonText.footer_contact;
    }
  });

  // ==================== ランキングタブの切り替え ====================
  const rankingTabs = document.querySelectorAll('.rankingcomparetable .tab[data-v-356e3e82]');
  const rankingTable = document.querySelector('.rankingcomparetable .table');

  // パターンAのクラシックデザインを適用
  const rankingContainer = document.querySelector('.rankingcomparetable');
  if (rankingContainer) {
    rankingContainer.classList.add('comparison-table--classic');
  }

  // タブ名を更新
  if (rankingTabs.length > 0) {
    rankingTabs.forEach((tab, index) => {
      const tabNameKey = `tab_${index}_name`;
      if (commonText[tabNameKey]) {
        // 既存のテキストノードを更新
        const textNode = Array.from(tab.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
        if (textNode) {
          textNode.textContent = commonText[tabNameKey];
        }
      }
    });
  }

  if (rankingTabs.length > 0 && rankingTable) {
    
    rankingTabs.forEach((tab, index) => {
      tab.addEventListener('click', function() {
        // アクティブクラスの切り替え
        rankingTabs.forEach(t => {
          t.classList.remove('tab--active');
          const arrow = t.querySelector('img');
          if (arrow) arrow.remove();
        });
        this.classList.add('tab--active');
        
        // 矢印アイコンを追加
        const arrow = document.createElement('img');
        arrow.src = '/svg/sign/arrow-down-small.svg';
        arrow.style.color = 'white';
        arrow.setAttribute('data-v-356e3e82', '');
        this.appendChild(arrow);
        
        // テーブルの内容を更新
        updateRankingTable(index);
      });
    });

    // ==================== 初期表示: 最初のタブを表示 ====================
    updateRankingTable(0);

    function updateRankingTable(tabIndex) {
      const data = tabData[tabIndex];
      const thead = rankingTable.querySelector('thead tr');
      const tbody = rankingTable.querySelector('tbody');

      // ヘッダーを更新
      thead.innerHTML = data.headers.map(h => `<th data-v-356e3e82>${h}</th>`).join('');

      // 各セルのHTMLを生成するヘルパー関数
      function generateCellHTML(cellData) {
        if (!cellData) return '';

        let html = '';

        // アイコンがある場合
        if (cellData.icon) {
          html += `<img src="img/icon/${cellData.icon}" class="sign" data-v-356e3e82> `;
        }

        // value1 + value2 パターン（価格など）
        if (cellData.value1) {
          const color = cellData.value1Color || 'black';
          html += `<div class="value1" style="color:${color};" data-v-356e3e82>${cellData.value1}</div> `;
          if (cellData.value2) {
            html += `<div class="value2" style="color:black;" data-v-356e3e82>${cellData.value2}</div>`;
          }
        }

        // effect パターン（満足度など）
        if (cellData.effect) {
          const color = cellData.effectColor || 'black';
          html += `<div class="effect" style="color:${color};" data-v-356e3e82><p class="rankingSummary__cardTableText" data-v-356e3e82>${cellData.effect}</p></div>`;
        }

        // feature パターン（特徴）
        if (cellData.feature) {
          html += `<div class="feature" data-v-356e3e82>${cellData.feature}</div>`;
        }

        return html;
      }

      // 行を更新
      tbody.innerHTML = data.rows.map((rowData, idx) => {
        const recommendText = commonText.recommend_text || 'おすすめ';
        const buttonPcText = commonText.button_pc_text || '公式サイト<br data-v-356e3e82>を見る';
        const buttonSpText = commonText.button_sp_text || '公式<br data-v-356e3e82>サイト';

        return `
          <tr data-v-356e3e82>
            <td class="comparison-table__service" style="position:relative" data-v-356e3e82 data-service="${rowData.service}">
              ${idx === 0 ? `<div class="recommend" data-v-356e3e82><img src="svg/sign/slash-left.svg" data-v-356e3e82><div data-v-356e3e82>${recommendText}</div><img src="svg/sign/slash-right.svg" data-v-356e3e82></div>` : ''}
              <img src="${rowData.logo}" data-gtm-cv-type="micro-cv" data-gtm-item-slug="menseminal" data-gtm-cta-position="pickup-image" class="logo gtm-trigger" style="cursor: pointer" data-v-356e3e82>
              <a class="cta-text" data-v-356e3e82>${rowData.service}</a>
            </td>
            ${rowData.cells.map(cell => `<td data-v-356e3e82>${generateCellHTML(cell)}</td>`).join('')}
            <td data-v-356e3e82>
              <div class="cta-button" data-v-356e3e82>
                <div class="pc-only" data-v-356e3e82>${buttonPcText}</div>
                <div class="sp-only" data-v-356e3e82>${buttonSpText}</div>
                <div class="blank" data-v-356e3e82><img src="svg/sign/blank-white.svg" data-v-356e3e82></div>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      attachSummaryTableListeners(data.rows);
      attachComparisonTableCtaListeners(data.rows);
    }

    function findRankByServiceName(serviceName) {
      const rankingCards = document.querySelectorAll('.rankingCard');
      for (const card of rankingCards) {
        const name = card.querySelector('.rankingCard__name')?.textContent?.trim();
        if (name === serviceName) {
          const targetId = card.querySelector('.rankingCard__target')?.id;
          if (!targetId) continue;
          const match = targetId.match(/rankingCard(\d+)/);
          if (match) {
            return match[1];
          }
        }
      }
      return null;
    }

    function attachSummaryTableListeners(rowsData = []) {
      if (!rankingTable) return;
      const rows = rankingTable.querySelectorAll('tbody tr');
      rows.forEach((row, idx) => {
        const triggerCell = row.querySelector('td');
        if (!triggerCell || triggerCell.dataset.modalAttached === 'true') return;

        const serviceName = triggerCell.dataset.service || rowsData[idx]?.service || triggerCell.querySelector('.cta-text')?.textContent?.trim();
        const rank = serviceName ? findRankByServiceName(serviceName) : null;
        if (!rank) return;

        const openModal = () => {
          openProgramDetailModal(rank, serviceName, null);
        };

        triggerCell.dataset.modalAttached = 'true';
        triggerCell.style.cursor = 'pointer';
        triggerCell.setAttribute('role', 'button');
        triggerCell.setAttribute('tabindex', '0');

        triggerCell.addEventListener('click', (event) => {
          event.preventDefault();
          openModal();
        });
        triggerCell.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openModal();
          }
        });
      });
    }

    attachSummaryTableListeners();

    // 比較表のCTAボタンにクリックハンドラーを設定
    function attachComparisonTableCtaListeners(rowsData = []) {
      if (!rankingTable) return;
      const rows = rankingTable.querySelectorAll('tbody tr');
      rows.forEach((row, idx) => {
        const ctaButton = row.querySelector('.cta-button');
        if (!ctaButton) return;

        const triggerCell = row.querySelector('td');
        const serviceName = triggerCell?.dataset.service || rowsData[idx]?.service || triggerCell?.querySelector('.cta-text')?.textContent?.trim();

        // サービス名からサービスIDを特定
        let serviceId = null;
        Object.entries(serviceMeta).forEach(([id, meta]) => {
          if (meta.name === serviceName) {
            serviceId = id;
          }
        });

        if (serviceId && serviceCta[serviceId]?.officialUrl) {
          ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(serviceCta[serviceId].officialUrl, '_blank');
          });
          ctaButton.style.cursor = 'pointer';
        }
      });
    }
  }

  // ==================== 基本情報タブの切り替え ====================
  const basicInfoSections = document.querySelectorAll('.c-basicInfo.rankingCard__basicInfo');
  
  basicInfoSections.forEach(section => {
    const tabs = section.querySelectorAll('.c-basicInfo__tab');
    const contents = section.querySelectorAll('.c-basicInfo__item');
    
    if (tabs.length > 0 && contents.length > 0) {
      tabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
          // アクティブクラスの切り替え
          tabs.forEach(t => t.classList.remove('is-active'));
          this.classList.add('is-active');
          
          // コンテンツの表示/非表示
          contents.forEach((content, idx) => {
            if (idx === index) {
              content.style.display = 'block';
            } else {
              content.style.display = 'none';
            }
          });
        });
      });
      
      // 初期状態: 最初のコンテンツだけ表示
      contents.forEach((content, idx) => {
        content.style.display = idx === 0 ? 'block' : 'none';
      });
    }
  });
  
  // ==================== アコーディオンの開閉 ====================
  const accordionButtons = document.querySelectorAll('.button-background');
  
  accordionButtons.forEach(button => {
    const parent = button.closest('.c-basicInfo__subItem');
    if (!parent) return;
    
    const table = parent.querySelector('table');
    const expandBtn = parent.querySelector('.expand-button');
    
    if (table && expandBtn) {
      // 初期状態: 最初の3行だけ表示
      const allRows = table.querySelectorAll('tbody');
      const initialVisibleRows = 3;
      
      allRows.forEach((row, idx) => {
        if (idx >= initialVisibleRows) {
          row.style.display = 'none';
        }
      });
      
      let isExpanded = false;
      
      // ボタンとexpand-buttonの両方にクリックイベント
      [button, expandBtn].forEach(elem => {
        elem.addEventListener('click', function(e) {
          e.stopPropagation();
          isExpanded = !isExpanded;
          
          allRows.forEach((row, idx) => {
            if (idx >= initialVisibleRows) {
              row.style.display = isExpanded ? 'table-row-group' : 'none';
            }
          });
          
          // ボタンテキストとクラスの切り替え
          if (expandBtn) {
            expandBtn.textContent = isExpanded ? '閉じる' : 'もっと見る';
            expandBtn.classList.toggle('expand-button--open', !isExpanded);
            expandBtn.classList.toggle('expand-button--close', isExpanded);
          }
        });
      });
    }
  });
  
  // ==================== 検索フォームのアコーディオン ====================
  const searchFormTitle = document.querySelector('.searchForm__title');
  const searchFormContents = document.querySelector('.searchForm__contents');
  
  if (searchFormTitle && searchFormContents) {
    searchFormTitle.addEventListener('click', function() {
      this.classList.toggle('isOpen');
      searchFormContents.classList.toggle('isOpen');
    });
  }
  
  // ==================== 検索ボタン ====================
  const searchBtn = document.querySelector('.searchForm__btn, button.searchForm__btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', function(e) {
      e.preventDefault();
      alert('検索機能は準備中です。現在はデモ表示です。');
    });
  }
  
  // ==================== ハンバーガーメニュー ====================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const sideDrawer = document.getElementById('sideDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawerBody = document.getElementById('drawerBody');
  const searchForm = document.getElementById('searchForm');

  // 検索フォームをサイドドロワーに移動
  if (searchForm && drawerBody) {
    const searchFormInner = searchForm.querySelector('.searchForm__inner');
    if (searchFormInner) {
      drawerBody.appendChild(searchFormInner.cloneNode(true));

      // サイドドロワー内の検索ボタンにイベントを追加
      const drawerSearchBtn = drawerBody.querySelector('.searchForm__submitBtn');
      if (drawerSearchBtn) {
        drawerSearchBtn.addEventListener('click', function(e) {
          e.preventDefault();
          closeSideDrawer();
          alert('検索機能は準備中です。現在はデモ表示です。');
        });
      }
    }
  }

  // サイドドロワーを開く
  function openSideDrawer() {
    if (sideDrawer && hamburgerBtn) {
      sideDrawer.classList.add('active');
      hamburgerBtn.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  // サイドドロワーを閉じる
  function closeSideDrawer() {
    if (sideDrawer && hamburgerBtn) {
      sideDrawer.classList.remove('active');
      hamburgerBtn.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // ハンバーガーボタンクリック
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (sideDrawer.classList.contains('active')) {
        closeSideDrawer();
      } else {
        openSideDrawer();
      }
    });
  }

  // オーバーレイクリック
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeSideDrawer);
  }

  // 閉じるボタンクリック
  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', closeSideDrawer);
  }

  // ESCキーでクローズ
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sideDrawer && sideDrawer.classList.contains('active')) {
      closeSideDrawer();
    }
  });

  // ==================== rankingSummary ヘッダーを削除 ====================
  const rankingSummaryHeading = document.querySelector('.rankingSummary__heading');
  if (rankingSummaryHeading) {
    rankingSummaryHeading.remove();
  }

  // ==================== プログラム詳細モーダル ====================
  // 「詳しく見る」ボタンをクリックしたときのモーダル表示
  document.addEventListener('click', function(e) {
    const detailButton = e.target.closest('button[data-gtm-cta-position="basic-info-table"]');
    if (!detailButton) return;

    e.preventDefault();

    // どのランキングカードか特定
    const rankingCard = detailButton.closest('.rankingCard');
    if (!rankingCard) return;

    // ランキングカードのIDから順位を取得
    const rankingId = rankingCard.querySelector('.rankingCard__target').id;
    const rank = rankingId.replace('rankingCard', '');

    // どのプログラムかを特定
    const programRow = detailButton.closest('tr');
    const programName = programRow.querySelector('.c-basicInfo__tablePartName span')?.textContent || '';

    openProgramDetailModal(rank, programName, programRow);
  });

  // ランキングカード名をクリックしたときのモーダル表示
  document.addEventListener('click', function(e) {
    const cardName = e.target.closest('.rankingCard__name');
    if (!cardName) return;

    e.preventDefault();

    // どのランキングカードか特定
    const rankingCard = cardName.closest('.rankingCard');
    if (!rankingCard) return;

    // ランキングカードのIDから順位を取得
    const rankingId = rankingCard.querySelector('.rankingCard__target').id;
    const rank = rankingId.replace('rankingCard', '');

    // 基本情報タブの最初のタブ（総合）の最初のプログラムを取得
    const basicInfo = rankingCard.querySelector('.c-basicInfo');
    const firstTab = basicInfo?.querySelector('.c-basicInfo__item');
    const firstProgramRow = firstTab?.querySelector('tbody tr');
    
    if (firstProgramRow) {
      const programName = firstProgramRow.querySelector('.c-basicInfo__tablePartName span')?.textContent || '総合';
      openProgramDetailModal(rank, programName, firstProgramRow);
    }
  });

  console.log('AI副業比較ナビ: インタラクティブ機能を初期化しました');
  console.log('ハンバーガーメニュー: 初期化完了');
});

// ランキングカード詳細モーダルを開く
function openProgramDetailModal(rank, programName, programRow) {
  closeProgramDetailModal();

  // ランキングカード全体を取得
  const target = document.getElementById(`rankingCard${rank}`);
  const rankingCard = target?.parentElement;
  
  if (!rankingCard) return;

  // ランキングカード全体をクローン
  const cardClone = rankingCard.cloneNode(true);
  cardClone.classList.add('rankingCard--modal');
  cardClone.dataset.rank = rank;
  
  // クローンからIDを削除（重複を避けるため）
  const clonedTarget = cardClone.querySelector('.rankingCard__target');
  if (clonedTarget) clonedTarget.removeAttribute('id');

  const rankingName = rankingCard.querySelector('.rankingCard__name')?.textContent?.trim();
  const baseTitle = rankingName || programName || 'ランキング';
  const modalTitle = baseTitle.endsWith('詳細') ? baseTitle : `${baseTitle}の詳細`;

  // モーダルHTML生成
  const overlayHtml = '<div class="program-detail-overlay"></div>';
  const modalHtml = `
    <div class="program-detail-modal ranking-card-modal" role="dialog" aria-modal="true">
      <header class="program-detail-header">
        <span class="modal-title">${modalTitle}</span>
        <button class="program-detail-close" aria-label="閉じる">&times;</button>
      </header>
      <div class="program-detail-body">
        ${cardClone.innerHTML}
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', overlayHtml + modalHtml);

  const overlay = document.querySelector('.program-detail-overlay');
  const modal = document.querySelector('.program-detail-modal');

  requestAnimationFrame(() => {
    overlay?.classList.add('active');
    modal?.classList.add('active');
    document.body.classList.add('no-scroll');
  });

  const cleanup = () => {
    closeProgramDetailModal();
  };

  overlay?.addEventListener('click', cleanup);
  modal?.querySelector('.program-detail-close')?.addEventListener('click', cleanup);

  const onKey = (e) => { if (e.key === 'Escape') cleanup(); };
  document.addEventListener('keydown', onKey, { once: true });
}

// アンカーリンクをモーダルに置き換え
document.addEventListener('click', function(e) {
  const anchorLink = e.target.closest('a[href^="#rankingCard"]');
  if (!anchorLink) return;

  e.preventDefault();

  const href = anchorLink.getAttribute('href');
  const match = href.match(/#rankingCard(\d+)/);
  if (!match) return;

  const rank = match[1];
  const rankingCard = document.querySelector(`#rankingCard${rank}`)?.parentElement;
  if (!rankingCard) return;

  // 基本情報タブの最初のタブ（総合）の最初のプログラムを取得
  const basicInfo = rankingCard.querySelector('.c-basicInfo');
  const firstTab = basicInfo?.querySelector('.c-basicInfo__item');
  const firstProgramRow = firstTab?.querySelector('tbody tr');
  
  if (firstProgramRow) {
    const programName = firstProgramRow.querySelector('.c-basicInfo__tablePartName span')?.textContent || '総合';
    openProgramDetailModal(rank, programName, firstProgramRow);
  }
});

// プログラム詳細モーダルを閉じる
function closeProgramDetailModal() {
  const overlay = document.querySelector('.program-detail-overlay');
  const modal = document.querySelector('.program-detail-modal');
  if (overlay) overlay.parentNode.removeChild(overlay);
  if (modal) modal.parentNode.removeChild(modal);
  document.body.classList.remove('no-scroll');
}
