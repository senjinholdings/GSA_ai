// AI副業比較ナビ - インタラクティブ機能

let gServiceCta = {};
let gServiceMeta = {};
let gSlugToServiceId = {};
let gServiceNameToId = {};

function openExternalLink(url) {
  if (!url) return;
  const opened = window.open(url, '_blank');
  if (!opened) {
    window.location.href = url;
  }
}

function resolveServiceIdFromElement(element) {
  if (!element) return null;

  const fromDataset = element.closest('[data-service-id]')?.dataset?.serviceId;
  if (fromDataset && gServiceCta[fromDataset]) {
    return fromDataset;
  }



  const rankingCard = element.closest('.rankingCard');
  if (rankingCard) {
    const basicInfoTitle = rankingCard.querySelector('.c-basicInfo__ttl')?.textContent?.trim();
    if (basicInfoTitle) {
      const normalized = basicInfoTitle.replace('の基本情報', '').trim();
      if (gServiceNameToId[normalized]) {
        return gServiceNameToId[normalized];
      }
    }

    const headingName = rankingCard.querySelector('.rankingCard__name')?.textContent?.trim();
    if (headingName && gServiceNameToId[headingName]) {
      return gServiceNameToId[headingName];
    }
  }

  return null;
}

function bindCtaButtons(root = document) {
  const buttons = root.querySelectorAll('.cta-button-2, .cta-button-3');
  buttons.forEach((btn) => {
    if (btn.__ctaBound) return;

    const isSeminar = btn.classList.contains('cta-button-2');
    const isOfficial = btn.classList.contains('cta-button-3');
    const serviceId = resolveServiceIdFromElement(btn);
    if (!serviceId) return;

    const url = isSeminar ? gServiceCta[serviceId]?.seminarUrl : gServiceCta[serviceId]?.officialUrl;
    if (!url) return;

    btn.dataset.serviceId = serviceId;
    btn.__ctaBound = true;
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      openExternalLink(url);
    });
  });
}

function initializeBasicInfoTabs(root = document) {
  const sections = root.querySelectorAll('.c-basicInfo.rankingCard__basicInfo');
  sections.forEach((section) => {
    const tabs = Array.from(section.querySelectorAll('.c-basicInfo__tab'));
    const contents = Array.from(section.querySelectorAll('.c-basicInfo__item'));
    if (!tabs.length || !contents.length) return;

    const showTab = (activeIndex) => {
      tabs.forEach((tab, idx) => {
        const isActive = idx === activeIndex;
        tab.classList.toggle('is-active', isActive);
      });
      contents.forEach((content, idx) => {
        const isActive = idx === activeIndex;
        content.classList.toggle('is-active', isActive);
        content.style.display = isActive ? '' : 'none';
      });
    };

    const defaultIndex = tabs.findIndex(tab => tab.classList.contains('is-active'));
    showTab(defaultIndex >= 0 ? defaultIndex : 0);

    tabs.forEach((tab, index) => {
      if (tab.__basicTabBound) return;
      tab.__basicTabBound = true;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('tabindex', '0');

      const activate = (event) => {
        event.preventDefault();
        showTab(index);
      };

      tab.addEventListener('click', activate);
      tab.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          activate(event);
        }
      });
    });
  });
}

function initializePlanAccordions(root = document) {
  const subItems = root.querySelectorAll('.c-basicInfo__subItem');
  subItems.forEach((subItem) => {
    if (subItem.__accordionInitialized) return;

    const buttonBg = subItem.querySelector('.button-background');
    const expandBtn = subItem.querySelector('.expand-button');
    const table = subItem.querySelector('table');
    if (!buttonBg || !expandBtn || !table) return;

    const rowGroups = Array.from(table.querySelectorAll('tbody'));
    if (rowGroups.length <= 3) return;

    subItem.__accordionInitialized = true;
    const initialVisibleRows = 3;
    let isExpanded = false;
    const collapsedLabel = expandBtn.textContent.trim() || 'もっと見る';
    const expandedLabel = expandBtn.dataset.expandedLabel || '閉じる';

    expandBtn.textContent = collapsedLabel;
    expandBtn.classList.add('expand-button--open');
    expandBtn.classList.remove('expand-button--close');

    rowGroups.forEach((row, idx) => {
      row.style.display = idx < initialVisibleRows ? 'table-row-group' : 'none';
    });

    const toggleRows = () => {
      isExpanded = !isExpanded;
      rowGroups.forEach((row, idx) => {
        if (idx >= initialVisibleRows) {
          row.style.display = isExpanded ? 'table-row-group' : 'none';
        }
      });
      const expandIcon = expandBtn.querySelector('img');
      if (expandIcon) {
        expandIcon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
      }
      expandBtn.textContent = isExpanded ? expandedLabel : collapsedLabel;
      expandBtn.classList.toggle('expand-button--open', !isExpanded);
      expandBtn.classList.toggle('expand-button--close', isExpanded);
    };

    [buttonBg, expandBtn].forEach((control) => {
      control.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleRows();
      });
    });
  });

  const planButtons = root.querySelectorAll('.show-all-plans-btn');
  planButtons.forEach((btn) => {
    if (btn.__showAllPlansBound) return;
    const wrapper = btn.closest('.show-all-plans-wrapper');
    const table = wrapper?.previousElementSibling;
    if (!wrapper || !table || table.tagName?.toLowerCase() !== 'table') return;

    btn.__showAllPlansBound = true;
    btn.addEventListener('click', () => {
      const hiddenPlans = Array.from(table.querySelectorAll('.is-hidden-plan'));
      if (!hiddenPlans.length) return;
      const currentlyCollapsed = hiddenPlans.every((tbody) => tbody.classList.contains('is-hidden-plan-collapsed'));
      const collapseNext = !currentlyCollapsed;
      hiddenPlans.forEach((tbody) => {
        if (collapseNext) {
          tbody.classList.add('is-hidden-plan-collapsed');
          tbody.style.display = 'none';
        } else {
          tbody.classList.remove('is-hidden-plan-collapsed');
          tbody.style.display = 'table-row-group';
        }
      });
      const showText = btn.querySelector('.show-text');
      const hideText = btn.querySelector('.hide-text');
      if (showText) showText.style.display = collapseNext ? '' : 'none';
      if (hideText) hideText.style.display = collapseNext ? 'none' : '';
    });
  });
}

function initializeRankingCardInteractions(root = document) {
  bindCtaButtons(root);
  initializeBasicInfoTabs(root);
  initializePlanAccordions(root);
}

document.addEventListener('DOMContentLoaded', async function() {

  // ==================== CSVデータ読み込み ====================
  const { tabData, commonText, serviceMeta, serviceSummary, serviceDetail, serviceReviews, servicePricing, serviceCta, serviceBasicInfo } = await loadServiceText();

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
    // マーカー後のテキストノードを必要に応じて生成して更新
    let textNode = Array.from(titleCopy2.childNodes).find(
      node => node.nodeType === Node.TEXT_NODE
    );
    if (!textNode) {
      textNode = document.createTextNode('');
      titleCopy2.appendChild(textNode);
    }
    textNode.textContent = commonText.title_main || 'AI副業スクール';
  }

  // ==================== サービスIDリスト ====================
  const serviceIds = ['shiftai', 'dmmai', 'samuraiai'];

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
  summaryCtaCopies.forEach((copyElement, index) => {
    const serviceId = serviceIds[index];
    if (serviceCta[serviceId]?.ctaCopy) {
      copyElement.innerHTML = serviceCta[serviceId].ctaCopy;
    }
  });

  // ==================== ランキングカードの特徴テキスト更新 ====================
  const rankingCardLeads = document.querySelectorAll('.rankingCard__lead');
  rankingCardLeads.forEach((lead, index) => {
    const serviceId = serviceIds[index];
    if (serviceId && serviceCta[serviceId]?.benefitsList) {
      lead.innerHTML = serviceCta[serviceId].benefitsList;
    }
  });

  // ==================== ボタンテキストの更新 ====================
// サービス名 と serviceId のマッピング
  const serviceNameToId = {
    'SHIFT AI': 'shiftai',
    'DMM 生成AICAMP': 'dmmai',
    '侍エンジニア': 'samuraiai'
  };

  gServiceCta = serviceCta;
  gServiceMeta = serviceMeta;
  gServiceNameToId = serviceNameToId;

  // DOMが完全に構築されるまで待つ
  setTimeout(() => {
    const seminarButtons = document.querySelectorAll('.cta-button-2');

    seminarButtons.forEach((btn) => {
      let serviceId = null;

      // 親要素を辿ってサービス名から特定
        const rankingCard = btn.closest('.rankingCard');
        if (rankingCard) {
          // 基本情報のタイトルから取得
          const basicInfoTitle = rankingCard.querySelector('.c-basicInfo__ttl');
          if (basicInfoTitle) {
            // "SHIFT AIの基本情報" → "SHIFT AI"
            const fullText = basicInfoTitle.textContent.trim();
            const serviceName = fullText.replace('の基本情報', '');
            serviceId = serviceNameToId[serviceName];
          } else {
            // フォールバック：rankingCard__nameから取得
            const serviceNameEl = rankingCard.querySelector('.rankingCard__heading .rankingCard__name');
            if (serviceNameEl) {
              const serviceName = serviceNameEl.textContent.trim();
              serviceId = serviceNameToId[serviceName];
            }
          }
        }

      // サービスIDが特定できた場合、対応するボタンテキストを設定
      if (serviceId && serviceCta[serviceId]?.buttonSeminarText) {
        btn.innerHTML = serviceCta[serviceId].buttonSeminarText;
      }
    });

    const officialButtons = document.querySelectorAll('.cta-button-3');
    officialButtons.forEach((btn) => {
      if (commonText.button_card_text) {
        btn.textContent = commonText.button_card_text;
      } else if (!btn.textContent.trim()) {
        btn.textContent = '公式サイトを見る';
      }
    });
  }, 100);

  const detailButtons = document.querySelectorAll('.summary-cta-btn.btn-narrow');
  detailButtons.forEach((btn) => {
    btn.textContent = commonText.button_detail_text || '詳細を見る +';
  });

  // 公式サイトを見るボタン (.summary-cta-btn.btn-wide) のURL設定
  const officialSiteLinks = document.querySelectorAll('.summary-cta-btn.btn-wide');
  officialSiteLinks.forEach((link, index) => {
    link.innerHTML = commonText.button_card_text || '公式サイトを見る';
    const serviceId = serviceIds[index];
    if (serviceCta[serviceId]?.officialUrl) {
      link.href = serviceCta[serviceId].officialUrl;
      link.target = '_blank';
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openExternalLink(serviceCta[serviceId].officialUrl);
      });
    }
  });

  // ==================== CTA URL設定 ====================
  const rankingCards = document.querySelectorAll('.rankingCard');
  rankingCards.forEach((card, index) => {
    const serviceId = serviceIds[index];
    if (serviceId) {
      card.dataset.serviceId = serviceId;
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

  // ==================== サマリーヘッダー星評価の更新 ====================
  const summaryHeaderScores = document.querySelectorAll('.summary-header-score');
  summaryHeaderScores.forEach((scoreElement, index) => {
    const serviceId = serviceIds[index];
    if (serviceMeta[serviceId]) {
      const rating = parseFloat(serviceMeta[serviceId].ratingScore);
      const starRating = scoreElement.querySelector('.star-rating');
      const scoreNum = scoreElement.querySelector('.score-num');
      const starsFilled = scoreElement.querySelector('.stars-filled');

      if (starRating) {
        starRating.setAttribute('data-rating', rating);
      }
      if (scoreNum) {
        scoreNum.textContent = rating;
      }
      if (starsFilled) {
        const percentage = (rating / 5) * 100;
        starsFilled.style.width = percentage + '%';
      }
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
    let processedValue = replaceCustomSummaryTags(safeValue);

    // <icon>...</icon> をimgタグに変換（後ろに改行を追加）
    processedValue = processedValue.replace(/<icon>(.*?)<\/icon>/g, (match, iconPath) => {
      return `<img src="img/icon/${iconPath}" class="sign" style="width:20px;height:20px;vertical-align:middle;margin-bottom:5px;"><br>`;
    });

    return processedValue;
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
          commentEl.innerHTML = buildSummaryCellContent(serviceSummary[serviceId].col3);
        }
      }
      cellIndex++;
      if (summaryTableRows[cellIndex]) {
        const commentEl = summaryTableRows[cellIndex].querySelector('.t-comment');
        if (commentEl) {
          commentEl.innerHTML = buildSummaryCellContent(serviceSummary[serviceId].col4);
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
                <img alt="${review.gender}/${review.name}の口コミ" class="human" data-v-769f10cc="" height="60" src="${review.imageUrl}" width="47"/>
                <div class="inner" data-v-769f10cc="">
                  <h4 class="title" data-v-769f10cc="">${review.title}</h4>
                  <p class="author" data-v-769f10cc="">${review.gender}/${review.name}</p>
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

      // 1.5. ランキングカードのバッジ (.rankingCard__badge)
      const rankingCardBadges = document.querySelectorAll('.rankingCard__badge');
      if (rankingCardBadges[index] && serviceMeta[serviceId]) {
        const ratingScore = serviceMeta[serviceId].ratingScore;
        if (ratingScore) {
          const ratingPercent = (parseFloat(ratingScore) / 5) * 100;
          rankingCardBadges[index].innerHTML = `
            <div class="badge-stars">
              <div class="star-rating" data-rating="${ratingScore}">
                <div class="stars-empty">★★★★★</div>
                <div class="stars-filled" style="width: ${ratingPercent}%;">★★★★★</div>
              </div>
              <span class="rating-score">${ratingScore}</span>
            </div>
          `;
        }
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
  const tableHeaderGroups = document.querySelectorAll('.c-basicInfo__table thead tr');
  tableHeaderGroups.forEach((tr) => {
    const headerCells = tr.querySelectorAll('th');
    if (headerCells.length >= 4) {
      headerCells[0].textContent = commonText.table_header_program || 'コース';
      headerCells[1].textContent = commonText.table_header_total || '習得スキル';
      headerCells[2].textContent = commonText.table_header_per_session || '料金';
      headerCells[3].textContent = commonText.table_header_monthly || '月額';
    }
  });
  const tbodyHeaderKeyGroups = [
    [
      { key: 'basic_info_learning_format', fallback: '利用者数' },
      { key: 'basic_info_difficulty', fallback: '実績' },
      { key: 'basic_info_lesson_time', fallback: '満足度' }
    ],
    [
      { key: 'basic_info_learning_style', fallback: '受講形式' },
      { key: 'basic_info_support_hours', fallback: 'コミュニティ' },
      { key: 'basic_info_reservation_change', fallback: 'その他' }
    ],
    [
      { key: 'basic_info_question_support', fallback: 'サポート体制' },
      { key: 'basic_info_career_support', fallback: '案件支援' },
      { key: 'basic_info_refund_policy', fallback: '返金保証' }
    ]
  ];

  document.querySelectorAll('.c-basicInfo__items').forEach((itemsContainer) => {
    const items = Array.from(itemsContainer.querySelectorAll('.c-basicInfo__item'));
    items.forEach((item, itemIndex) => {
      const headerGroupIndex = itemIndex - 1;
      if (headerGroupIndex < 0 || headerGroupIndex >= tbodyHeaderKeyGroups.length) {
        return;
      }
      const keyGroup = tbodyHeaderKeyGroups[headerGroupIndex];
      const headerRow = item.querySelector('tbody tr');
      if (!headerRow) return;
      const headerCells = headerRow.querySelectorAll('th');
      if (headerCells.length < 3) return;
      headerCells.forEach((th, cellIndex) => {
        const config = keyGroup[cellIndex];
        if (!config) return;
        th.textContent = commonText[config.key] || config.fallback;
      });
    });
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

      // 4つ目以降のtbodyを非表示にする
      if (index >= 3) {
        tbody.classList.add('is-hidden-plan');
      } else {
        tbody.classList.remove('is-hidden-plan');
      }

      const programNameEl = tbody.querySelector('.c-basicInfo__tablePartName span');
      if (programNameEl && pricing.programName) {
        programNameEl.innerHTML = pricing.programName;
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
        if (pricing.priceAsList && pricing.priceListItems && pricing.priceListItems.length > 0) {
          // <tag_r>のリスト表示
          const listHtml = `<ul class="skill-list">${pricing.priceListItems.map(item => `<li>${item}</li>`).join('')}</ul>`;
          priceCell.innerHTML = listHtml;
        } else {
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
      }

      const perSessionCell = cells[2];
      if (perSessionCell) {
        if (pricing.perSessionPrice) {
          const perSessionValue = pricing.perSessionPrice.includes('円') ? pricing.perSessionPrice : `${pricing.perSessionPrice}円`;
          perSessionCell.innerHTML = perSessionValue;
        } else {
          perSessionCell.innerHTML = '';
        }
      }

      const monthlyCell = cells[3];
      if (monthlyCell) {
        if (pricing.monthlyPrice) {
          const monthlyValue = pricing.monthlyPrice.includes('円') ? pricing.monthlyPrice : `${pricing.monthlyPrice}円`;
          monthlyCell.innerHTML = monthlyValue;
        } else {
          monthlyCell.innerHTML = commonText.monthly_plan_none || '';
        }
      }
    });

    // 4つ以上のプランがある場合、「すべてのプランを見る」ボタンを追加
    if (pricingEntries.length > 3) {
      // 既存のボタンを削除
      const existingBtn = tableElement.parentElement.querySelector('.show-all-plans-btn');
      if (existingBtn) {
        existingBtn.remove();
      }

      // ボタンを作成
      const btnWrapper = document.createElement('div');
      btnWrapper.className = 'show-all-plans-wrapper';
      btnWrapper.innerHTML = `
        <button class="show-all-plans-btn">
          <span class="show-text">すべてのプランを見る<span class="icon">+</span></span>
          <span class="hide-text" style="display: none;">プランを閉じる<span class="icon">-</span></span>
        </button>
      `;

      // テーブルの後に挿入
      tableElement.parentElement.insertBefore(btnWrapper, tableElement.nextSibling);

      // 初期状態で非表示にする
      const hiddenPlans = tableElement.querySelectorAll('.is-hidden-plan');
      hiddenPlans.forEach(tbody => {
        tbody.classList.add('is-hidden-plan-collapsed');
        tbody.style.display = 'none';
      });
    }

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

      // tbody内の全てのtr要素を取得し、最後の行（データ行）を使用
      const rows = table.querySelectorAll('tbody tr');
      const dataRow = rows[rows.length - 1];
      if (!dataRow) return;

      const cells = dataRow.querySelectorAll('td');
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
  const reviewHeadings = document.querySelectorAll('.rankingCard__kuchikomi .c-basicInfo__ttl');
  reviewHeadings.forEach((h3) => {
    // 親のrankingCard要素からサービス名を特定
    const rankingCard = h3.closest('.rankingCard');
    if (!rankingCard) return;

    const serviceName = rankingCard.querySelector('.rankingCard__name')?.textContent.trim();

    // サービス名に基づいてタイトルを設定
    if (serviceName && serviceName.includes('SHIFT AI')) {
      h3.textContent = 'SHIFT AIの受講者の声';
    } else if (serviceName && serviceName.includes('DMM')) {
      h3.textContent = 'DMM 生成AICAMPの受講者の声';
    } else if (serviceName && serviceName.includes('侍')) {
      h3.textContent = '侍エンジニアの受講者の声';
    } else {
      h3.textContent = commonText.section_reviews || '受講者の口コミ';
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

  // 7.5. ランキングタイトルSVGの更新
  const rankingSvgImg = document.querySelector('img[src*="summary_h2.svg"]');
  if (rankingSvgImg && commonText.summary_ranking_title) {
    fetch(rankingSvgImg.src)
      .then(response => response.text())
      .then(svgText => {
        const updatedSvg = svgText.replace(
          /(<tspan[^>]*>)TOP\d+(<\/tspan>)/,
          `$1${commonText.summary_ranking_title}$2`
        );
        const blob = new Blob([updatedSvg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        rankingSvgImg.src = url;
      })
      .catch(err => console.error('SVG読み込みエラー:', err));
  }

  // 7.6. MVのSVG更新
  const mvSvgImg = document.querySelector('.mv__contents img[src*="mv_ranking_semminar.svg"]');
  if (mvSvgImg) {
    fetch(mvSvgImg.src)
      .then(response => response.text())
      .then(svgText => {
        let updatedSvg = svgText;

        // フォントサイズ調整用の設定（各要素の最大幅と基準フォントサイズ）
        const fontSizeConfig = {
          'mv-year-label': { maxWidth: 300, baseFontSize: 55, baseLength: 6 },
          'mv-main-title': { maxWidth: 600, baseFontSize: 119, baseLength: 8 },
          'mv-tag1': {  baseFontSize: 70, baseLength: 4 },
          'mv-tag2': {  baseFontSize: 70, baseLength: 4 },
          'mv-tag3': {  baseFontSize: 70, baseLength: 4 }
        };

        // 各テキスト要素を置換（HTMLエンティティ対応 + フォントサイズ自動調整）
        const replacements = [
          { id: 'mv-year-label', text: commonText.mv_year_label },
          { id: 'mv-main-title', text: commonText.mv_main_title },
          { id: 'mv-tag1', text: commonText.mv_tag1 },
          { id: 'mv-tag2', text: commonText.mv_tag2 },
          { id: 'mv-tag3', text: commonText.mv_tag3 }
        ];

        replacements.forEach(({ id, text }) => {
          if (text) {
            // HTMLエンティティに変換
            const encodedText = text.split('').map(char => {
              const code = char.charCodeAt(0);
              return code > 127 ? `&#x${code.toString(16)};` : char;
            }).join('');

            // フォントサイズを計算（英数字は0.8文字としてカウント）
            let fontSize = fontSizeConfig[id]?.baseFontSize || 48;
            if (fontSizeConfig[id]) {
              // 英数字を0.8、それ以外を1としてカウント
              const textLength = text.split('').reduce((count, char) => {
                return count + (/[a-zA-Z0-9]/.test(char) ? 0.8 : 1);
              }, 0);
              const { baseFontSize, baseLength } = fontSizeConfig[id];
              // mv-tag1, mv-tag2, mv-tag3は常に同じフォントサイズにする
              if (id === 'mv-tag1' || id === 'mv-tag2' || id === 'mv-tag3') {
                fontSize = baseFontSize;
              } else if (textLength > baseLength) {
                fontSize = Math.floor(baseFontSize * (baseLength / textLength));
              }
            }

            // text要素内のfont-sizeとtspan内容を置換
            const textRegex = new RegExp(`(<text[^>]*id="${id}"[^>]*font-size=")[^"]*("[^>]*>[\\s\\S]*?<tspan[^>]*>)[^<]*(</tspan>)`, 'g');
            updatedSvg = updatedSvg.replace(textRegex, `$1${fontSize}$2${encodedText}$3`);
          }
        });

        const blob = new Blob([updatedSvg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        mvSvgImg.src = url;
      })
      .catch(err => console.error('MV SVG読み込みエラー:', err));
  }

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

  // 11. MVセクションのサブタイトル
  const siteSubtitle = document.querySelector('.c-headingAboveMv');
  if (siteSubtitle && commonText.site_subtitle) {
    siteSubtitle.textContent = commonText.site_subtitle;
  }

  // 12. ランキング見出しSVGのテキスト差し替え
  const headingSpSubtitle = document.querySelector('#heading-sp-subtitle tspan');
  if (headingSpSubtitle && commonText.heading_sp_subtitle) {
    headingSpSubtitle.textContent = commonText.heading_sp_subtitle;
  }

  if (commonText.heading_sp_main) {
    // <big>...</big> と <big2>...</big2> を解析
    const bigMatch = commonText.heading_sp_main.match(/<big>(.*?)<\/big>/);
    const big2Match = commonText.heading_sp_main.match(/<big2>(.*?)<\/big2>/);

    // タグを除いた通常テキスト部分を抽出
    const mainText = commonText.heading_sp_main
      .replace(/<big>.*?<\/big>/, '')
      .replace(/<big2>.*?<\/big2>/, '');

    const headingSpMain = document.querySelector('#heading-sp-main tspan');
    const headingSpMainText = document.querySelector('#heading-sp-main');
    if (headingSpMain) {
      headingSpMain.textContent = mainText;

      // メインテキストの幅を取得して、3と選の位置を調整
      setTimeout(() => {
        const mainTextWidth = headingSpMain.getComputedTextLength();
        const baseX = 20; // メインテキストの開始位置
        const numberX = baseX + mainTextWidth +10; // メインテキストの後ろ + 10px余白

        const headingSpNumber = document.querySelector('#heading-sp-number tspan');
        const headingSpNumberText = document.querySelector('#heading-sp-number');
        if (headingSpNumber && bigMatch) {
          headingSpNumber.textContent = bigMatch[1];
          headingSpNumber.setAttribute('x', numberX);
        }

        const headingSpSuffix = document.querySelector('#heading-sp-suffix tspan');
        if (headingSpSuffix && big2Match) {
          headingSpSuffix.textContent = big2Match[1];
          // 「3」のテキスト幅を取得してその後ろに配置
          if (headingSpNumber) {
            const numberWidth = headingSpNumber.getComputedTextLength();
            const suffixX = numberX + numberWidth;
            headingSpSuffix.setAttribute('x', suffixX);
          }
        }
      }, 0);
    }
  }

  // 13. title_clinic.svgのテキスト差し替え
  if (commonText.title_clinic_text) {
    // <big>...</big> を解析
    const bigMatch = commonText.title_clinic_text.match(/<big>(.*?)<\/big>/);

    // タグを除いたテキスト部分を抽出
    const parts = commonText.title_clinic_text.split(/<big>.*?<\/big>/);
    const mainText = parts[0] || ''; // 最初の部分（生成AIスクール）
    const suffixText = parts[1] || ''; // 最後の部分（を詳しくチェック）

    // SVGを非同期で読み込んで更新
    fetch('img/ranking/title_clinic.svg')
      .then(response => response.text())
      .then(svgText => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

        // テキスト要素を更新
        const titleClinicMain = svgDoc.querySelector('#title-clinic-main tspan');
        if (titleClinicMain) {
          titleClinicMain.textContent = mainText;
        }

        const titleClinicNumber = svgDoc.querySelector('#title-clinic-number tspan');
        if (titleClinicNumber && bigMatch) {
          titleClinicNumber.textContent = bigMatch[1];
        }

        const titleClinicSuffix = svgDoc.querySelector('#title-clinic-suffix tspan');
        if (titleClinicSuffix) {
          titleClinicSuffix.textContent = suffixText;
        }

        // 元の<img>要素を更新されたSVGに置き換え
        const imgElement = document.querySelector('img[src="img/ranking/title_clinic.svg"]');
        if (imgElement) {
          const serializer = new XMLSerializer();
          const svgString = serializer.serializeToString(svgDoc.documentElement);
          const blob = new Blob([svgString], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);

          // 一時的にSVGを作成して幅を計測
          const tempDiv = document.createElement('div');
          tempDiv.style.position = 'absolute';
          tempDiv.style.visibility = 'hidden';
          tempDiv.innerHTML = svgString;
          document.body.appendChild(tempDiv);

          const tempSvg = tempDiv.querySelector('svg');
          if (tempSvg) {
            const mainTextElement = tempSvg.querySelector('#title-clinic-main tspan');
            const numberTextElement = tempSvg.querySelector('#title-clinic-number tspan');
            const suffixTextElement = tempSvg.querySelector('#title-clinic-suffix tspan');

            if (mainTextElement && numberTextElement && suffixTextElement) {
              // メインテキストの幅を取得
              const mainTextWidth = mainTextElement.getComputedTextLength();
              const baseX = 18; // メインテキストの開始位置

              // TOP3の位置を計算（メインテキストのすぐ後ろ）
              const numberX = baseX + mainTextWidth + 22;

              // TOP3の親要素（text要素）のtransform属性を更新
              const numberParent = tempSvg.querySelector('#title-clinic-number');
              if (numberParent) {
                // 現在のtransform: matrix(1 0 -0.325568 0.945519 300.86 22)
                // 最後の2つの値を変更: translate(x, y)
                const newTransform = `matrix(1 0 -0.325568 0.945519 ${numberX} 22)`;
                numberParent.setAttribute('transform', newTransform);
              }

              // 「を詳しくチェック」の位置を計算（TOP3の後ろ）
              const numberWidth = 150; // TOP3の幅（傾斜を考慮した概算）
              const suffixX = numberX + numberWidth;
              suffixTextElement.setAttribute('x', suffixX);

              // 更新されたSVGを再シリアライズ
              const updatedSvgString = new XMLSerializer().serializeToString(tempSvg);
              const updatedBlob = new Blob([updatedSvgString], { type: 'image/svg+xml' });
              const updatedUrl = URL.createObjectURL(updatedBlob);
              imgElement.src = updatedUrl;
            } else {
              imgElement.src = url;
            }
          } else {
            imgElement.src = url;
          }

          document.body.removeChild(tempDiv);
        }
      });
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
        // 既存のテキストノードがなければ生成して更新
        let textNode = Array.from(tab.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
        if (!textNode) {
          textNode = document.createTextNode('');
          tab.insertBefore(textNode, tab.firstChild || null);
        }
        textNode.textContent = commonText[tabNameKey];
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

        // renderAsList フラグがある場合、リストとして表示
        if (cellData.renderAsList && cellData.listItems) {
          const listHtml = `<ul class="skill-list">${cellData.listItems.map(item => `<li>${item}</li>`).join('')}</ul>`;
          html += `<div class="effect" data-v-356e3e82><div class="rankingSummary__cardTableText" data-v-356e3e82>${listHtml}</div></div>`;
          return html;
        }

        // 全てのコンテンツを <div class="effect"> で囲む
        let contentHtml = '';

        // value1 + value2 パターン（価格など）
        if (cellData.value1) {
          const value1Color = cellData.value1Color || '#484848';
          contentHtml += `<span style="color:${value1Color}">${cellData.value1}</span>`;
          if (cellData.value2) {
            contentHtml += `<br><span style="color:#484848">${cellData.value2}</span>`;
          }
        }
        // effect パターン（満足度など）
        else if (cellData.effect) {
          const effectColor = cellData.effectColor || '#484848';
          contentHtml += `<span style="color:${effectColor}">${cellData.effect}</span>`;
        }
        // feature パターン（特徴）
        else if (cellData.feature) {
          contentHtml += cellData.feature;
        }

        // コンテンツがあれば effect div で囲む
        if (contentHtml) {
          html += `<div class="effect" data-v-356e3e82><p class="rankingSummary__cardTableText" data-v-356e3e82>${contentHtml}</p></div>`;
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
              <img src="${rowData.logo}" class="logo" style="cursor: pointer" data-v-356e3e82>
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
            openExternalLink(serviceCta[serviceId].officialUrl);
          });
          ctaButton.style.cursor = 'pointer';
        }
      });
    }
  }

  initializeRankingCardInteractions(document);

  // ==================== 検索フォームのアコーディオン ====================
  const searchFormTitle = document.querySelector('.searchForm__title');
  const searchFormContents = document.querySelector('.searchForm__contents');
  
  if (searchFormTitle && searchFormContents) {
    searchFormTitle.addEventListener('click', function() {
      this.classList.toggle('isOpen');
      searchFormContents.classList.toggle('isOpen');
    });
  }
  
  // ==================== 絞り込み検索機能 ====================
  
  // 絞り込み条件の初期化
  const filterState = {
    skills: new Set(),
    priceRange: null,
    learningStyle: new Set(),
    support: new Set()
  };

  // スキルタグの抽出
  function extractSkillsFromPricing() {
    const skills = new Set();
    Object.values(servicePricing).forEach(service => {
      Object.values(service).forEach(pricing => {
        if (pricing.priceListItems) {
          pricing.priceListItems.forEach(item => {
            skills.add(item);
          });
        }
      });
    });
    return Array.from(skills);
  }

  // 料金の数値を抽出
  function extractPrice(priceStr) {
    if (!priceStr) return 0;
    const match = priceStr.match(/[\d,]+/);
    if (!match) return 0;
    return parseInt(match[0].replace(/,/g, ''), 10);
  }

  // サービスが絞り込み条件に一致するかチェック
  function matchesFilter(serviceId) {
    // スキルフィルター
    if (filterState.skills.size > 0) {
      const serviceSkills = new Set();
      Object.values(servicePricing[serviceId] || {}).forEach(pricing => {
        if (pricing.priceListItems) {
          pricing.priceListItems.forEach(skill => serviceSkills.add(skill));
        }
      });
      
      const hasMatchingSkill = Array.from(filterState.skills).some(skill => 
        serviceSkills.has(skill)
      );
      if (!hasMatchingSkill) return false;
    }

    // 料金範囲フィルター
    if (filterState.priceRange) {
      const prices = Object.values(servicePricing[serviceId] || {})
        .map(p => extractPrice(p.totalPrice))
        .filter(p => p > 0);
      
      if (prices.length === 0) return false;
      
      const minPrice = Math.min(...prices);
      const [min, max] = filterState.priceRange;
      if (minPrice < min || minPrice > max) return false;
    }

    // 学習形式フィルター
    if (filterState.learningStyle.size > 0) {
      const styleText = serviceBasicInfo[serviceId]?.[3]?.[1] || '';
      const hasMatchingStyle = Array.from(filterState.learningStyle).some(style => 
        styleText.includes(style)
      );
      if (!hasMatchingStyle) return false;
    }

    // サポートフィルター
    if (filterState.support.size > 0) {
      const supportTexts = [
        serviceBasicInfo[serviceId]?.[4]?.[1] || '',
        serviceBasicInfo[serviceId]?.[4]?.[2] || '',
        serviceBasicInfo[serviceId]?.[4]?.[3] || ''
      ].join(' ');
      
      const hasMatchingSupport = Array.from(filterState.support).some(support => 
        supportTexts.includes(support) || supportTexts.includes('◎')
      );
      if (!hasMatchingSupport) return false;
    }

    return true;
  }

  // filterStateをURLパラメータにシリアライズ
  function serializeFilterState() {
    const params = new URLSearchParams();

    if (filterState.skills.size > 0) {
      params.set('skills', Array.from(filterState.skills).join(','));
    }

    if (filterState.priceRange) {
      params.set('priceRange', filterState.priceRange.join('-'));
    }

    if (filterState.learningStyle.size > 0) {
      params.set('learningStyle', Array.from(filterState.learningStyle).join(','));
    }

    if (filterState.support.size > 0) {
      params.set('support', Array.from(filterState.support).join(','));
    }

    return params.toString();
  }

  // URLパラメータからfilterStateを復元
  function deserializeFilterState() {
    const params = new URLSearchParams(window.location.search);

    const skills = params.get('skills');
    if (skills) {
      skills.split(',').forEach(skill => filterState.skills.add(skill));
    }

    const priceRange = params.get('priceRange');
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filterState.priceRange = [min, max];
    }

    const learningStyle = params.get('learningStyle');
    if (learningStyle) {
      learningStyle.split(',').forEach(style => filterState.learningStyle.add(style));
    }

    const support = params.get('support');
    if (support) {
      support.split(',').forEach(s => filterState.support.add(s));
    }
  }

  // 絞り込みを適用
  function applyFilter() {
    const hasActiveFilters =
      filterState.skills.size > 0 ||
      filterState.priceRange !== null ||
      filterState.learningStyle.size > 0 ||
      filterState.support.size > 0;

    serviceIds.forEach((serviceId, index) => {
      const matches = !hasActiveFilters || matchesFilter(serviceId);
      
      // ランキングカードの表示/非表示
      const rankingCard = rankingCards[index];
      if (rankingCard) {
        rankingCard.style.display = matches ? '' : 'none';
      }

      // サマリーセクションの表示/非表示
      const summarySection = document.querySelectorAll('.rankingSummary')[index];
      if (summarySection) {
        summarySection.style.display = matches ? '' : 'none';
      }
    });

    // 比較テーブルの行を更新
    if (rankingTable) {
      const rows = rankingTable.querySelectorAll('tbody tr');
      rows.forEach((row, index) => {
        const serviceId = serviceIds[index];
        const matches = !hasActiveFilters || matchesFilter(serviceId);
        row.style.display = matches ? '' : 'none';
      });
    }

    // 結果メッセージ
    const visibleCount = serviceIds.filter((id, i) => 
      rankingCards[i] && rankingCards[i].style.display !== 'none'
    ).length;

    if (hasActiveFilters && visibleCount === 0) {
      alert('条件に一致するサービスが見つかりませんでした。');
    }
  }



  // ==================== ハンバーガーメニュー ====================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const sideDrawer = document.getElementById('sideDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawerBody = document.getElementById('drawerBody');

  // ハンバーガーメニュー内に絞り込みUIを生成
  function createDrawerFilterUI() {
    if (!drawerBody) return;

    drawerBody.innerHTML = '';

    // スキルフィルター（アコーディオン）
    const skills = extractSkillsFromPricing();
    if (skills.length > 0) {
      const accordionItem = createAccordionItem('習得スキル', skills.map(skill => ({
        type: 'checkbox',
        name: 'skill',
        value: skill,
        label: skill
      })));
      drawerBody.appendChild(accordionItem);
    }

    // 料金範囲フィルター（アコーディオン）
    const priceOptions = [
      { value: '0-200000', label: '20万円未満' },
      { value: '200000-300000', label: '20〜30万円' },
      { value: '300000-500000', label: '30〜50万円' },
      { value: '500000-10000000', label: '50万円以上' }
    ];
    const priceAccordion = createAccordionItem('料金範囲', priceOptions.map(opt => ({
      type: 'radio',
      name: 'price',
      value: opt.value,
      label: opt.label
    })));
    drawerBody.appendChild(priceAccordion);

    // 学習形式フィルター（アコーディオン）
    const styleOptions = [
      { value: 'オンライン', label: 'オンライン' },
      { value: 'マンツーマン', label: 'マンツーマン' },
      { value: 'ライブ', label: 'ライブセミナー' }
    ];
    const styleAccordion = createAccordionItem('学習形式', styleOptions.map(opt => ({
      type: 'checkbox',
      name: 'style',
      value: opt.value,
      label: opt.label
    })));
    drawerBody.appendChild(styleAccordion);

    // サポートフィルター（アコーディオン）
    const supportOptions = [
      { value: '質問', label: '質問サポート' },
      { value: '案件', label: '案件紹介' },
      { value: '返金', label: '返金保証' }
    ];
    const supportAccordion = createAccordionItem('サポート', supportOptions.map(opt => ({
      type: 'checkbox',
      name: 'support',
      value: opt.value,
      label: opt.label
    })));
    drawerBody.appendChild(supportAccordion);

    // ボタンエリア
    const buttonArea = document.createElement('div');
    buttonArea.className = 'drawer-filter-buttons';
    buttonArea.innerHTML = `
      <button class="drawer-filter-apply">検索</button>
      <button class="drawer-filter-reset">リセット</button>
    `;
    drawerBody.appendChild(buttonArea);

    // イベントリスナーの設定
    attachDrawerFilterListeners();
  }

  // アコーディオンアイテムを作成
  function createAccordionItem(title, options) {
    const item = document.createElement('div');
    item.className = 'drawer-accordion-item';
    
    const header = document.createElement('div');
    header.className = 'drawer-accordion-header';
    header.innerHTML = `<span>${title}</span><span class="drawer-accordion-icon">▼</span>`;
    
    const content = document.createElement('div');
    content.className = 'drawer-accordion-content';
    
    options.forEach(opt => {
      const label = document.createElement('label');
      label.className = 'drawer-filter-option';
      label.innerHTML = `
        <input type="${opt.type}" name="${opt.name}" value="${opt.value}">
        <span>${opt.label}</span>
      `;
      content.appendChild(label);
    });
    
    item.appendChild(header);
    item.appendChild(content);
    
    // アコーディオンの開閉
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      if (isOpen) {
        item.classList.remove('open');
      } else {
        item.classList.add('open');
      }
    });
    
    return item;
  }

  // ドロワー内のフィルターイベントを設定
  function attachDrawerFilterListeners() {
    // スキル
    drawerBody.querySelectorAll('input[name="skill"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          filterState.skills.add(e.target.value);
        } else {
          filterState.skills.delete(e.target.value);
        }
      });
    });

    // 料金
    drawerBody.querySelectorAll('input[name="price"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          const [min, max] = e.target.value.split('-').map(Number);
          filterState.priceRange = [min, max];
        }
      });
    });

    // 学習形式
    drawerBody.querySelectorAll('input[name="style"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          filterState.learningStyle.add(e.target.value);
        } else {
          filterState.learningStyle.delete(e.target.value);
        }
      });
    });

    // サポート
    drawerBody.querySelectorAll('input[name="support"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          filterState.support.add(e.target.value);
        } else {
          filterState.support.delete(e.target.value);
        }
      });
    });

    // 検索ボタン
    const applyBtn = drawerBody.querySelector('.drawer-filter-apply');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        // search.htmlに遷移してフィルタリング結果を表示
        const params = serializeFilterState();
        if (params) {
          window.location.href = `search.html?${params}`;
        } else {
          // フィルタが何も選択されていない場合はそのままapplyFilter
          applyFilter();
          closeSideDrawer();
        }
      });
    }

    // リセットボタン
    const resetBtn = drawerBody.querySelector('.drawer-filter-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        filterState.skills.clear();
        filterState.priceRange = null;
        filterState.learningStyle.clear();
        filterState.support.clear();
        
        drawerBody.querySelectorAll('input').forEach(input => {
          input.checked = false;
        });
        
        applyFilter();
      });
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

  // 初期化：ドロワー内に絞り込みUIを生成
  createDrawerFilterUI();

  // ==================== rankingSummary ヘッダーを削除 ====================
  const rankingSummaryHeading = document.querySelector('.rankingSummary__heading');
  if (rankingSummaryHeading) {
    rankingSummaryHeading.remove();
  }

  // ==================== プログラム詳細モーダル ====================
  // 「詳しく見る」ボタンをクリックしたときのモーダル表示
  document.addEventListener('click', function(e) {
    const detailButton = e.target.closest('button.c-basicInfo__detailBtn');
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
        ${cardClone.outerHTML}
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', overlayHtml + modalHtml);

  const overlay = document.querySelector('.program-detail-overlay');
  const modal = document.querySelector('.program-detail-modal');

  if (modal) {
    initializeRankingCardInteractions(modal);
  }

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

// ==================== 検索結果ページの処理 ====================
if (window.isSearchResultsPage) {
  // URLパラメータからfilterStateを復元
  deserializeFilterState();

  // index.htmlからrankingCardを取得する
  fetch('index.html')
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const allRankingCards = doc.querySelectorAll('.rankingCard.l-salonCard');

      // フィルタリング
      const filteredCards = [];
      serviceIds.forEach((serviceId, index) => {
        if (matchesFilter(serviceId) && allRankingCards[index]) {
          filteredCards.push(allRankingCards[index].cloneNode(true));
        }
      });

      // 結果を表示
      const searchResultsContent = document.getElementById('searchResultsContent');
      const resultsCount = document.getElementById('resultsCount');
      const noResults = document.getElementById('noResults');
      const appliedFilters = document.getElementById('appliedFilters');
      const filtersList = document.getElementById('filtersList');

      if (filteredCards.length > 0) {
        // ランキングカードを表示
        filteredCards.forEach(card => {
          searchResultsContent.appendChild(card);
        });

        // 件数表示
        resultsCount.textContent = `${filteredCards.length}件のスクールが見つかりました`;

        // 適用中のフィルタを表示
        const filterTags = [];

        if (filterState.skills.size > 0) {
          Array.from(filterState.skills).forEach(skill => {
            filterTags.push(`スキル: ${skill}`);
          });
        }

        if (filterState.priceRange) {
          const [min, max] = filterState.priceRange;
          filterTags.push(`料金: ${min.toLocaleString()}円〜${max.toLocaleString()}円`);
        }

        if (filterState.learningStyle.size > 0) {
          Array.from(filterState.learningStyle).forEach(style => {
            filterTags.push(`受講形式: ${style}`);
          });
        }

        if (filterState.support.size > 0) {
          Array.from(filterState.support).forEach(support => {
            filterTags.push(`サポート: ${support}`);
          });
        }

        if (filterTags.length > 0) {
          appliedFilters.style.display = 'block';
          filterTags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'filter-tag';
            tagElement.textContent = tag;
            filtersList.appendChild(tagElement);
          });
        }

        // app.jsの初期化処理を再実行（CTAボタンなどのイベントリスナーを設定）
        // Note: 必要に応じて追加のイベントリスナー設定を行う
      } else {
        // 該当なし
        noResults.style.display = 'block';
        resultsCount.textContent = '0件';
      }
    })
    .catch(error => {
      console.error('Error loading ranking cards:', error);
      const noResults = document.getElementById('noResults');
      noResults.style.display = 'block';
      noResults.querySelector('.no-results-title').textContent = 'エラーが発生しました';
      noResults.querySelector('.no-results-text').textContent = 'ページの読み込みに失敗しました。もう一度お試しください。';
    });
}
