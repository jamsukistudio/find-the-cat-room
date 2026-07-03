const spots = document.querySelectorAll('.spot');
const roundEl = document.getElementById('round');
const scoreEl = document.getElementById('score');
const triesEl = document.getElementById('tries');
const messageEl = document.getElementById('message');
const nextBtn = document.getElementById('nextBtn');
const resetBtn = document.getElementById('resetBtn');
const catReveal = document.getElementById('catReveal');

const roundsTotal = 5;
const spotNames = {
  bed: 'ベッドの下',
  shelf: '棚',
  chair: '椅子',
  curtain: 'カーテンの後ろ',
  plant: '観葉植物の後ろ',
  desk: '机の下'
};
const revealPosition = {
  bed: { left: '25%', top: '63%' },
  shelf: { left: '14%', top: '30%' },
  chair: { left: '72%', top: '56%' },
  curtain: { left: '83%', top: '17%' },
  plant: { left: '92%', top: '52%' },
  desk: { left: '56%', top: '58%' }
};

let currentRound = 1;
let score = 0;
let tries = 0;
let hiddenSpot = '';
let roundFinished = false;

function pickSpot() {
  const keys = Object.keys(spotNames);
  return keys[Math.floor(Math.random() * keys.length)];
}

function startRound() {
  hiddenSpot = pickSpot();
  roundFinished = false;
  spots.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('found', 'miss');
  });
  catReveal.style.display = 'none';
  nextBtn.disabled = true;
  messageEl.textContent = `ラウンド ${currentRound}：どこにいるかな？`;
  updateStats();
}

function updateStats() {
  roundEl.textContent = `${currentRound} / ${roundsTotal}`;
  scoreEl.textContent = score;
  triesEl.textContent = tries;
}

function revealCat(where) {
  const pos = revealPosition[where];
  catReveal.style.left = pos.left;
  catReveal.style.top = pos.top;
  catReveal.style.display = 'block';
}

spots.forEach(btn => {
  btn.addEventListener('click', () => {
    if (roundFinished) return;

    const selected = btn.dataset.spot;
    tries += 1;
    updateStats();

    if (selected === hiddenSpot) {
      roundFinished = true;
      score += 1;
      btn.classList.add('found');
      revealCat(selected);
      spots.forEach(s => s.disabled = true);
      messageEl.textContent = `正解！ ${spotNames[selected]} にいたよ 🐱`;
      nextBtn.disabled = false;
      updateStats();

      if (currentRound === roundsTotal) {
        nextBtn.textContent = '結果を見る';
      }
    } else {
      btn.classList.add('miss');
      btn.disabled = true;
      messageEl.textContent = `そこにはいないみたい…。「${spotNames[selected]}」ははずれ。`;
    }
  });
});

nextBtn.addEventListener('click', () => {
  if (!roundFinished) return;

  if (currentRound >= roundsTotal) {
    messageEl.textContent = `おつかれさま！ 5ラウンドで ${score} 匹見つけたよ。もう一回遊ぶ？`;
    nextBtn.disabled = true;
    nextBtn.textContent = '次のラウンド';
    spots.forEach(s => s.disabled = true);
    catReveal.style.display = 'none';
    return;
  }

  currentRound += 1;
  nextBtn.textContent = '次のラウンド';
  startRound();
});

resetBtn.addEventListener('click', () => {
  currentRound = 1;
  score = 0;
  tries = 0;
  nextBtn.textContent = '次のラウンド';
  startRound();
});

startRound();
