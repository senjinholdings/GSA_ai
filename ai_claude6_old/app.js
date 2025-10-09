// AI副業比較ナビ - インタラクティブ機能

document.addEventListener('DOMContentLoaded', function() {
  
  // ==================== ランキングタブの切り替え ====================
  const rankingTabs = document.querySelectorAll('.rankingcomparetable .tab[data-v-356e3e82]');
  const rankingTable = document.querySelector('.rankingcomparetable .table');
  
  if (rankingTabs.length > 0 && rankingTable) {
    // タブごとのデータを定義
    const tabData = {
      0: { // 総合
        headers: ['サービス', '価格', '満足度', '特徴', '詳細'],
        rows: [
          ['AIライティングマスター', '29,800円<br>基礎コース', 'とても<br>高い', '初心者から<br>プロまで対応'],
          ['ChatGPT活用スクール', '39,800円<br>実践コース', 'とても<br>高い', '実践的な<br>課題が充実'],
          ['AI画像生成プロコース', '24,800円<br>基礎コース', '高い', '画像生成に<br>特化']
        ]
      },
      1: { // サービス
        headers: ['サービス', 'サポート', '受講方法', '返金保証', '詳細'],
        rows: [
          ['AIライティングマスター', '24時間<br>対応', 'オンライン<br>+通学', '30日間<br>全額返金'],
          ['ChatGPT活用スクール', '個別<br>メンター', 'オンライン<br>完結', '14日間<br>全額返金'],
          ['AI画像生成プロコース', 'コミュニティ<br>サポート', 'オンライン<br>完結', '30日間<br>全額返金']
        ]
      },
      2: { // 実績
        headers: ['サービス', '受講者数', '就職率', '満足度', '詳細'],
        rows: [
          ['AIライティングマスター', '10,000人<br>以上', '85%', '98%'],
          ['ChatGPT活用スクール', '8,000人<br>以上', '82%', '96%'],
          ['AI画像生成プロコース', '5,000人<br>以上', '78%', '94%']
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
      
      // 行を更新
      tbody.innerHTML = data.rows.map((row, idx) => {
        const ribbonClass = idx === 0 ? 'ribbon--first' : idx === 1 ? 'ribbon--second' : 'ribbon--third';
        const ribbonSvg = idx === 0 ? 'gold-ribbon.svg' : idx === 1 ? 'silver-ribbon.svg' : 'bronze-ribbon.svg';
        
        return `
          <tr data-v-356e3e82>
            <td style="position:relative" data-v-356e3e82>
              ${idx === 0 ? '<div class="recommend" data-v-356e3e82><img src="/svg/sign/slash-left.svg" data-v-356e3e82><div data-v-356e3e82>おすすめ</div><img src="/svg/sign/slash-right.svg" data-v-356e3e82></div>' : ''}
              <div data-v-356e3e82><img src="https://via.placeholder.com/150x80?text=Logo${idx+1}" class="logo" style="cursor: pointer; max-width: 150px;" data-v-356e3e82></div>
              <a class="cta-text" data-v-356e3e82>${row[0]}<img src="/svg/sign/blank.svg" data-v-356e3e82></a>
              <div class="ribbon ${ribbonClass}" data-v-356e3e82><img src="/svg/sign/${ribbonSvg}" data-v-356e3e82></div>
            </td>
            ${row.slice(1).map(cell => `<td data-v-356e3e82>${cell}</td>`).join('')}
            <td data-v-356e3e82>
              <button type="button" class="cta-link cta-button--primary" data-v-660fb7ba data-v-356e3e82>公式<br>サイト</button>
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

  console.log('AI副業比較ナビ: インタラクティブ機能を初期化しました');
  console.log('ハンバーガーメニュー: 初期化完了');
});
