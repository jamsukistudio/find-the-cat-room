const hits = document.querySelectorAll('.cat-hit');
const foundEl = document.getElementById('found');
const totalEl = document.getElementById('total');
const message = document.getElementById('message');
const resetBtn = document.getElementById('resetBtn');
const sparkles = document.getElementById('sparkles');
const catList = [...document.querySelectorAll('#catList span')];

let found = 0;
const total = hits.length;
totalEl.textContent = total;

function sparkleAt(x, y) {
  const s = document.createElement('div');
  s.className = 'sparkle';
  s.textContent = '✨';
  s.style.left = x + 'px';
  s.style.top = y + 'px';
  sparkles.appendChild(s);
  setTimeout(() => s.remove(), 800);
}

function clearOverlay() {
  const div = document.createElement('div');
  div.className = 'clear';
  div.innerHTML = 'CLEAR!<br>全部みつけたよ 🐾';
  document.querySelector('.scene').appendChild(div);
}

hits.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('found')) return;
    btn.classList.add('found');
    found += 1;
    foundEl.textContent = found;
    catList[i]?.classList.add('done');

    const rect = btn.getBoundingClientRect();
    const sceneRect = document.querySelector('.scene').getBoundingClientRect();
    sparkleAt(rect.left - sceneRect.left + rect.width / 2, rect.top - sceneRect.top + rect.height / 2);

    message.textContent = `${btn.dataset.cat}を見つけた！ あと${total - found}匹。`;

    if (found === total) {
      message.textContent = '全部みつけた！クリアだよ 🐱';
      setTimeout(clearOverlay, 300);
    }
  });
});

resetBtn.addEventListener('click', () => {
  found = 0;
  foundEl.textContent = found;
  message.textContent = '隠れている猫をタップしてみつけよう！';
  hits.forEach(btn => btn.classList.remove('found'));
  catList.forEach(x => x.classList.remove('done'));
  document.querySelector('.clear')?.remove();
});
