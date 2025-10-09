// AI副業比較ナビ - インタラクティブ機能

document.addEventListener('DOMContentLoaded', function() {
  
  // ==================== ランキングタブの切り替え ====================
  const rankingTabs = document.querySelectorAll('.rankingcomparetable .tab[data-v-356e3e82]');
  const rankingTable = document.querySelector('.rankingcomparetable .table');

  // パターンAのクラシックデザインを適用
  const rankingContainer = document.querySelector('.rankingcomparetable');
  if (rankingContainer) {
    rankingContainer.classList.add('comparison-table--classic');
  }

  if (rankingTabs.length > 0 && rankingTable) {
    // タブごとのデータを定義
    const tabData = {
      0: { // 総合
        headers: ['サービス', '価格', '満足度', '特徴', '詳細'],
        rows: [
          {
            service: 'AIライティングマスター',
            logo: 'img/logo/shiftai.jpg',
            cells: [
              { icon: 'ic_shape1.svg', value1: '29,800円', value1Color: 'red', value2: '基礎コース' },
              { icon: 'ic_shape1.svg', effect: 'かなり<br>高い', effectColor: 'red' },
              { feature: '圧倒的な実績の<br>AI副業<br><span>（高収入副業）</span>' }
            ]
          },
          {
            service: 'ChatGPT活用スクール',
            logo: 'img/logo/horiemonai.jpg',
            cells: [
              { icon: 'ic_shape2.svg', value1: '39,800円', value1Color: 'black', value2: '実践コース' },
              { icon: 'ic_shape1.svg', effect: 'かなり<br>高い', effectColor: 'black' },
              { feature: 'いつでも解約できる<span>特別返金保証</span>' }
            ]
          },
          {
            service: 'AI画像生成プロコース',
            logo: 'img/logo/samuraiai.jpg',
            cells: [
              { icon: 'ic_shape2.svg', value1: '24,800円', value1Color: 'black', value2: '基礎コース' },
              { icon: 'ic_shape2.svg', effect: '高い', effectColor: 'black' },
              { feature: '1人1人に合わせた<span>質の高いレッスン</span>' }
            ]
          }
        ]
      },
      1: { // サービス
        headers: ['サービス', 'サポート', '受講方法', '返金保証', '詳細'],
        rows: [
          {
            service: 'AIライティングマスター',
            logo: 'img/logo/shiftai.jpg',
            cells: [
              { icon: 'ic_shape1.svg', value1: '24時間', value1Color: 'red', value2: '対応' },
              { icon: 'ic_shape1.svg', effect: 'オンライン<br>+通学', effectColor: 'black' },
              { icon: 'ic_shape1.svg', effect: '30日間<br>全額返金', effectColor: 'red' }
            ]
          },
          {
            service: 'ChatGPT活用スクール',
            logo: 'img/logo/horiemonai.jpg',
            cells: [
              { icon: 'ic_shape2.svg', value1: '個別', value1Color: 'black', value2: 'メンター' },
              { icon: 'ic_shape2.svg', effect: 'オンライン<br>完結', effectColor: 'black' },
              { icon: 'ic_shape2.svg', effect: '14日間<br>全額返金', effectColor: 'black' }
            ]
          },
          {
            service: 'AI画像生成プロコース',
            logo: 'img/logo/samuraiai.jpg',
            cells: [
              { icon: 'ic_shape2.svg', value1: 'コミュニティ', value1Color: 'black', value2: 'サポート' },
              { icon: 'ic_shape2.svg', effect: 'オンライン<br>完結', effectColor: 'black' },
              { icon: 'ic_shape1.svg', effect: '30日間<br>全額返金', effectColor: 'black' }
            ]
          }
        ]
      },
      2: { // 実績
        headers: ['サービス', '受講者数', '就職率', '満足度', '詳細'],
        rows: [
          {
            service: 'AIライティングマスター',
            logo: 'img/logo/shiftai.jpg',
            cells: [
              { icon: 'ic_shape1.svg', value1: '10,000人', value1Color: 'red', value2: '以上' },
              { icon: 'ic_shape1.svg', value1: '85%', value1Color: 'red' },
              { icon: 'ic_shape1.svg', value1: '98%', value1Color: 'red' }
            ]
          },
          {
            service: 'ChatGPT活用スクール',
            logo: 'img/logo/horiemonai.jpg',
            cells: [
              { icon: 'ic_shape2.svg', value1: '8,000人', value1Color: 'black', value2: '以上' },
              { icon: 'ic_shape2.svg', value1: '82%', value1Color: 'black' },
              { icon: 'ic_shape1.svg', value1: '96%', value1Color: 'black' }
            ]
          },
          {
            service: 'AI画像生成プロコース',
            logo: 'img/logo/samuraiai.jpg',
            cells: [
              { icon: 'ic_shape2.svg', value1: '5,000人', value1Color: 'black', value2: '以上' },
              { icon: 'ic_shape2.svg', value1: '78%', value1Color: 'black' },
              { icon: 'ic_shape2.svg', value1: '94%', value1Color: 'black' }
            ]
          }
        ]
      }
    };
    
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
        return `
          <tr data-v-356e3e82>
            <td style="position:relative" data-v-356e3e82>
              ${idx === 0 ? '<div class="recommend" data-v-356e3e82><img src="svg/sign/slash-left.svg" data-v-356e3e82><div data-v-356e3e82>おすすめ</div><img src="svg/sign/slash-right.svg" data-v-356e3e82></div>' : ''}
              <img src="${rowData.logo}" data-gtm-cv-type="micro-cv" data-gtm-item-slug="menseminal" data-gtm-cta-position="pickup-image" class="logo gtm-trigger" style="cursor: pointer" data-v-356e3e82>
              <a class="cta-text" data-v-356e3e82>${rowData.service}<img src="svg/sign/blank.svg" data-v-356e3e82></a>
            </td>
            ${rowData.cells.map(cell => `<td data-v-356e3e82>${generateCellHTML(cell)}</td>`).join('')}
            <td data-v-356e3e82>
              <div class="cta-button" data-v-356e3e82>
                <div class="pc-only" data-v-356e3e82>公式サイト<br data-v-356e3e82>を見る</div>
                <div class="sp-only" data-v-356e3e82>公式<br data-v-356e3e82>サイト</div>
                <div class="blank" data-v-356e3e82><img src="svg/sign/blank-white.svg" data-v-356e3e82></div>
              </div>
            </td>
          </tr>
        `;
      }).join('');
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

  console.log('AI副業比較ナビ: インタラクティブ機能を初期化しました');
  console.log('ハンバーガーメニュー: 初期化完了');
});
