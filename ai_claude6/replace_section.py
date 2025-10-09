import re

# ファイルを読み込む
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# rankingSummaryセクションを検索して置換
pattern = r'<!----> <!----> <!----> <div class="rankingSummary".*?</div></div></div></div> <!----> <div data-v-031c5b88><img src="img/ranking/title_clinic\.svg"'

replacement = '''<!-- Top Summary Section -->
<div class="top-summary">
  <h2 class="top-summary-title">
    <div class="title-left">
      <div class="title-copy1">
        <div class="copy1-label">料金</div>
        <div class="copy1-cross">×</div>
        <div class="copy1-label">効果</div>
        <div class="copy1-cross">×</div>
        <div class="copy1-label">難易度</div>
        <div class="copy1-text">で選ぶ</div>
      </div>
      <div class="title-copy2"><span class="marker">おすすめ</span>AI副業スクール</div>
    </div>
    <div class="title-right">
      <img alt="TOP3" src="img/rankingSummary/test/summary_h2.svg" style="width:140px;">
    </div>
  </h2>
  <div class="top-summary-content">
    <div class="summaries">
      <!-- 1位: AIライティングマスター -->
      <div class="summary">
        <div class="summary-header">
          <div class="summary-header-rank">
            <img src="img/ranking/brush1.svg" style="width:72px;">
          </div>
          <div class="summary-header-right">
            <a class="summary-header-name" href="#rankingCard1">
              <h3>AIライティングマスター</h3>
            </a>
            <div class="summary-header-score">
              <div class="score-num">4.5</div>
              <div class="score-text">(総合評価)</div>
            </div>
          </div>
        </div>
        <div class="summary-banner">
          <img src="https://images.ctfassets.net/jf2fqus151ib/5XdSmJCeBFst2bqQyB6p6f/6d188a57603eb6a1d02a3ea6077a135d/メンズエミナル_1_1.png" alt="AIライティングマスター">
        </div>
        <div class="summary-table">
          <table>
            <tr>
              <th>ライティング料金</th>
              <th>総合スキル習得</th>
              <th>効果</th>
              <th>難易度</th>
            </tr>
            <tr>
              <td>
                <div class="t-score"><img src="img/icon/ic_shape1.svg"></div>
                <div class="t-comment">
                  <div class="t-times">基礎</div>
                  <div class="t-price">29,800円</div>
                </div>
              </td>
              <td>
                <div class="t-score"><img src="img/icon/ic_shape1.svg"></div>
                <div class="t-comment">
                  <div class="t-times">5案件</div>
                  <div class="t-price">98,000円</div>
                </div>
              </td>
              <td>
                <div class="t-score"><img src="img/icon/ic_shape1.svg"></div>
                <div class="t-comment">かなり<br>高い</div>
              </td>
              <td>
                <div class="t-score"><img src="img/icon/ic_shape1.svg"></div>
                <div class="t-comment">質問無制限</div>
              </td>
            </tr>
          </table>
        </div>
        <div class="summary-cta">
          <div class="summary-cta-copy">
            <div class="copy-text">圧倒的な実績のAI副業（高収入副業）</div>
          </div>
          <div class="summary-cta-btns">
            <a class="summary-cta-btn btn-narrow" href="#rankingCard1">詳細を見る</a>
            <a class="summary-cta-btn btn-wide" href="#rankingCard1">公式サイトを見る</a>
          </div>
        </div>
      </div>

      <!-- 2位: ChatGPT活用スクール -->
      <div class="summary">
        <div class="summary-header">
          <div class="summary-header-rank">
            <img src="img/ranking/brush2.svg" style="width:72px;">
          </div>
          <div class="summary-header-right">
            <a class="summary-header-name" href="#rankingCard2">
              <h3>ChatGPT活用スクール</h3>
            </a>
            <div class="summary-header-score">
              <div class="score-num">4.2</div>
              <div class="score-text">(総合評価)</div>
            </div>
          </div>
        </div>
        <div class="summary-banner">
          <img src="https://images.ctfassets.net/jf2fqus151ib/H9I6ZL1c7tXAbOY0ZzFl6/943ed79706b2bea8764ddfb0eb6d8bb0/ChatGPT活用スクール_1_1.png" alt="ChatGPT活用スクール">
        </div>
        <div class="summary-table">
          <table>
            <tr>
              <th>ライティング料金</th>
              <th>総合スキル習得</th>
              <th>効果</th>
              <th>難易度</th>
            </tr>
            <tr>
              <td>
                <div class="t-score"><img src="img/icon/ic_shape2.svg"></div>
                <div class="t-comment">
                  <div class="t-times">実践</div>
                  <div class="t-price">39,800円</div>
                </div>
              </td>
              <td>
                <div class="t-score"><img src="img/icon/ic_shape2.svg"></div>
                <div class="t-comment">
                  <div class="t-times">5案件</div>
                  <div class="t-price">148,000円</div>
                </div>
              </td>
              <td>
                <div class="t-score"><img src="img/icon/ic_shape1.svg"></div>
                <div class="t-comment">かなり<br>高い</div>
              </td>
              <td>
                <div class="t-score"><img src="img/icon/ic_shape3.svg"></div>
                <div class="t-comment">質問サポート付き</div>
              </td>
            </tr>
          </table>
        </div>
        <div class="summary-cta">
          <div class="summary-cta-copy">
            <div class="copy-text">いつでも解約できる特別返金保証</div>
          </div>
          <div class="summary-cta-btns">
            <a class="summary-cta-btn btn-narrow" href="#rankingCard2">詳細を見る</a>
            <a class="summary-cta-btn btn-wide" href="#rankingCard2">公式サイトを見る</a>
          </div>
        </div>
      </div>

      <!-- 3位: AI画像生成プロコース -->
      <div class="summary">
        <div class="summary-header">
          <div class="summary-header-rank">
            <img src="img/ranking/brush3.svg" style="width:72px;">
          </div>
          <div class="summary-header-right">
            <a class="summary-header-name" href="#rankingCard3">
              <h3>AI画像生成プロコース</h3>
            </a>
            <div class="summary-header-score">
              <div class="score-num">4.1</div>
              <div class="score-text">(総合評価)</div>
            </div>
          </div>
        </div>
        <div class="summary-banner">
          <img src="https://images.ctfassets.net/jf2fqus151ib/XTQf5YO1bhN1t6ejLJaos/db6734e569c1e4ef0e35a48499060d32/logo_HOMME_200x200.png" alt="AI画像生成プロコース">
        </div>
        <div class="summary-table">
          <table>
            <tr>
              <th>ライティング料金</th>
              <th>総合スキル習得</th>
              <th>効果</th>
              <th>難易度</th>
            </tr>
            <tr>
              <td>
                <div class="t-score"><img src="img/icon/ic_shape2.svg"></div>
                <div class="t-comment">
                  <div class="t-times">基礎</div>
                  <div class="t-price">24,800円</div>
                </div>
              </td>
              <td>
                <div class="t-score"><img src="img/icon/ic_shape3.svg"></div>
                <div class="t-comment">
                  <div class="t-times">5案件</div>
                  <div class="t-price">198,000円</div>
                </div>
              </td>
              <td>
                <div class="t-score"><img src="img/icon/ic_shape2.svg"></div>
                <div class="t-comment">高い</div>
              </td>
              <td>
                <div class="t-score"><img src="img/icon/ic_shape1.svg"></div>
                <div class="t-comment">質問無制限</div>
              </td>
            </tr>
          </table>
        </div>
        <div class="summary-cta">
          <div class="summary-cta-copy">
            <div class="copy-text">1人1人に合わせた質の高いレッスン</div>
          </div>
          <div class="summary-cta-btns">
            <a class="summary-cta-btn btn-narrow" href="#rankingCard3">詳細を見る</a>
            <a class="summary-cta-btn btn-wide" href="#rankingCard3">公式サイトを見る</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- End Top Summary Section -->

<div data-v-031c5b88><img src="img/ranking/title_clinic.svg"'''

# 正規表現で置換 (DOTALLフラグで改行を含む)
new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# ファイルに書き込む
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("置換完了")
