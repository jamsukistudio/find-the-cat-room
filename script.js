const spots=[...document.querySelectorAll('.catSpot')];
const foundEl=document.getElementById('found');
const totalEl=document.getElementById('total');
const message=document.getElementById('message');
const resetBtn=document.getElementById('resetBtn');
const badges=[...document.querySelectorAll('#badges span')];
const effectLayer=document.getElementById('effectLayer');
const clear=document.getElementById('clear');
let found=0;
totalEl.textContent=spots.length;

function sparkle(btn){
  const r=btn.getBoundingClientRect();
  const sr=document.querySelector('.scene').getBoundingClientRect();
  const s=document.createElement('div');
  s.className='spark';
  s.textContent='✨';
  s.style.left=(r.left-sr.left+r.width/2)+'px';
  s.style.top=(r.top-sr.top+r.height/2)+'px';
  effectLayer.appendChild(s);
  setTimeout(()=>s.remove(),850);
}

spots.forEach((btn,i)=>{
  btn.addEventListener('click',()=>{
    if(btn.classList.contains('found')) return;
    btn.classList.add('found');
    badges[i].classList.add('done');
    found++;
    foundEl.textContent=found;
    sparkle(btn);
    const left=spots.length-found;
    message.textContent=`${btn.dataset.name}を見つけた！ あと${left}匹。`;
    if(left===0){
      message.textContent='全部みつけた！クリアだよ 🐱';
      setTimeout(()=>clear.classList.remove('hidden'),350);
    }
  });
});

resetBtn.addEventListener('click',()=>{
  found=0;
  foundEl.textContent=0;
  message.textContent='部屋の中に隠れている猫をタップしてね。';
  clear.classList.add('hidden');
  spots.forEach(s=>s.classList.remove('found'));
  badges.forEach(b=>b.classList.remove('done'));
});
