(() => {
  const rooms = [
    { key:'bedroom', name:'ねこのへや（寝室）', img:'assets/bedroom.svg', spots:[[16,76],[25,46],[37,61],[50,40],[59,56],[72,43],[88,53],[91,76],[12,31],[45,72],[80,24],[66,80],[31,28],[55,25],[77,73]] },
    { key:'living', name:'リビング', img:'assets/living.svg', spots:[[14,70],[22,49],[34,63],[46,50],[57,34],[69,55],[84,65],[91,37],[11,31],[42,76],[78,26],[62,78],[29,29],[52,66],[73,73]] },
    { key:'kitchen', name:'キッチン', img:'assets/kitchen.svg', spots:[[13,70],[21,52],[34,46],[45,61],[58,42],[70,48],[84,61],[91,36],[12,31],[41,77],[76,29],[63,76],[30,30],[54,64],[73,72]] }
  ];
  const poses = ['sit','side','stretch','sleep','box','face','tail','tower','window','turn'];
  let roomIndex=0, found=0, started=false, startTime=0, timerId=null, activeCats=[];
  const total = 4;
  const $ = id => document.getElementById(id);
  const gameArea=$('gameArea'), roomImg=$('roomImg'), catLayer=$('catLayer'), effectLayer=$('effectLayer');
  const stageText=$('stageText'), foundText=$('foundText'), timeText=$('timeText'), messageText=$('messageText'), bestText=$('bestText');
  const modal=$('clearModal'), clearText=$('clearText'), nextBtn=$('nextBtn');
  function pad(n){return String(n).padStart(2,'0')}
  function fmt(ms){let cs=Math.floor((ms%1000)/10), s=Math.floor(ms/1000)%60, m=Math.floor(ms/60000); return `${pad(m)}:${pad(s)}.${pad(cs)}`}
  function bestKey(){return 'rui-mai-best-v2'}
  function updateBest(){const v=localStorage.getItem(bestKey()); bestText.textContent=v?fmt(Number(v)):'--:--.--'}
  function tick(){ if(started) timeText.textContent=fmt(Date.now()-startTime); }
  function startTimer(){ if(!started){started=true; startTime=Date.now(); timerId=setInterval(tick,60)} }
  function stopTimer(){started=false; clearInterval(timerId); timerId=null; tick()}
  function sample(arr,n){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]} return a.slice(0,n)}
  function svgCat(kind, pose){
    if(kind==='rui') return `<svg viewBox="0 0 120 120" aria-label="るいたん"><g stroke="#4d3b3e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M35 55 Q24 38 35 24 L49 38 Q60 32 73 38 L87 24 Q98 39 85 56 Q88 78 70 88 Q50 99 32 84 Q20 72 35 55Z" fill="#fffaf4"/><circle cx="47" cy="58" r="5" fill="#28343b"/><circle cx="73" cy="58" r="5" fill="#28343b"/><path d="M58 68 Q61 65 64 68 Q62 72 60 72 Q58 72 58 68Z" fill="#ff9aaa"/><path d="M60 73 Q59 80 52 81" fill="none"/><path d="M60 73 Q62 80 69 81" fill="none"/><circle cx="55" cy="78" r="3" fill="#3a2a2d"/><path d="M83 82 C112 88 111 52 92 60" fill="none" stroke="#fffaf4" stroke-width="12"/><path d="M83 82 C112 88 111 52 92 60" fill="none"/><ellipse cx="60" cy="90" rx="30" ry="17" fill="#fffaf4"/></g></svg>`;
    return `<svg viewBox="0 0 120 120" aria-label="まいたん"><g stroke="#4d3b3e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M35 55 Q24 38 35 24 L49 38 Q60 32 73 38 L87 24 Q98 39 85 56 Q88 78 70 88 Q50 99 32 84 Q20 72 35 55Z" fill="#fff6ec"/><path d="M34 25 L48 39 Q41 47 32 50 Q26 38 34 25Z" fill="#e07731"/><path d="M72 38 L88 25 Q95 39 84 56 Q76 48 72 38Z" fill="#202023"/><path d="M50 38 Q59 32 68 36 Q62 47 53 47Z" fill="#e07731"/><circle cx="47" cy="58" r="6" fill="#2b3038"/><circle cx="73" cy="58" r="6" fill="#2b3038"/><circle cx="45" cy="56" r="2" fill="#fff"/><circle cx="71" cy="56" r="2" fill="#fff"/><path d="M58 68 Q61 65 64 68 Q62 72 60 72 Q58 72 58 68Z" fill="#ff9aaa"/><path d="M60 73 Q58 80 52 81" fill="none"/><path d="M60 73 Q62 80 69 81" fill="none"/><ellipse cx="60" cy="91" rx="30" ry="17" fill="#fff6ec"/><path d="M84 84 q20 2 23-12" fill="none" stroke="#e07731" stroke-width="10"/><path d="M98 76 l9-4" stroke="#202023" stroke-width="8"/></g></svg>`;
  }
  function catSize(pose){ return ['face','tail'].includes(pose)?'56px':['box','sleep'].includes(pose)?'78px':'88px'}
  function placeCats(){
    catLayer.innerHTML=''; effectLayer.innerHTML=''; found=0; foundText.textContent=`0 / ${total}`;
    const room=rooms[roomIndex]; roomImg.src=room.img; stageText.textContent=`${roomIndex+1} / ${rooms.length}`; messageText.textContent=`${room.name}に4匹かくれているよ。`;
    activeCats = sample(room.spots,total).map((spot,i)=>({x:spot[0],y:spot[1],kind:i%2?'mai':'rui',pose:poses[Math.floor(Math.random()*poses.length)],found:false}));
    activeCats.forEach((cat,i)=>{
      const b=document.createElement('button'); b.className='catBtn hiddenCat'; b.style.left=cat.x+'%'; b.style.top=cat.y+'%'; b.style.setProperty('--size',catSize(cat.pose)); b.innerHTML=svgCat(cat.kind,cat.pose); b.setAttribute('aria-label',(cat.kind==='rui'?'るいたん':'まいたん')+'を見つける');
      b.addEventListener('click',e=>{e.stopPropagation(); reveal(i,b)}); catLayer.appendChild(b);
    });
  }
  function reveal(i,el){ startTimer(); const cat=activeCats[i]; if(cat.found) return; cat.found=true; found++; el.classList.remove('hiddenCat'); el.classList.add('found'); foundText.textContent=`${found} / ${total}`; const name=cat.kind==='rui'?'るいたん':'まいたん'; messageText.textContent=`${name}発見！にゃ！ あと${total-found}匹。`; effects(cat.x,cat.y); if(found===total) setTimeout(clearRoom,700); }
  function effects(x,y){
    const s=document.createElement('div'); s.className='speech'; s.textContent='にゃ!'; s.style.left=x+'%'; s.style.top=y+'%'; effectLayer.appendChild(s);
    ['🐾','✨','🌟','✨'].forEach((t,k)=>{const e=document.createElement('div'); e.className=k?'spark':'pawfx'; e.textContent=t; e.style.left=(x+(Math.random()*12-6))+'%'; e.style.top=(y+(Math.random()*12-6))+'%'; effectLayer.appendChild(e); setTimeout(()=>e.remove(),1200)}); setTimeout(()=>s.remove(),1100);
  }
  function clearRoom(){
    if(roomIndex < rooms.length-1){ clearText.textContent=`${rooms[roomIndex].name}クリア！次のお部屋へいこう。`; nextBtn.textContent='次の部屋へ'; }
    else { stopTimer(); const score=Date.now()-startTime; const best=localStorage.getItem(bestKey()); if(!best || score < Number(best)) localStorage.setItem(bestKey(),String(score)); updateBest(); clearText.textContent=`全部クリア！タイムは ${fmt(score)} だよ。`; nextBtn.textContent='もう一回あそぶ'; }
    modal.classList.remove('hidden');
  }
  function goRoom(i){ roomIndex=i; modal.classList.add('hidden'); placeCats(); }
  function restart(){ stopTimer(); timeText.textContent='00:00.00'; roomIndex=0; modal.classList.add('hidden'); placeCats(); }
  function buildRoomButtons(){ const box=$('roomButtons'); box.innerHTML=''; rooms.forEach((r,i)=>{const b=document.createElement('button'); b.className='roomBtn'; b.textContent=`${i+1}. ${r.name}`; b.onclick=()=>{ stopTimer(); timeText.textContent='00:00.00'; goRoom(i); refreshRoomBtns(); }; box.appendChild(b)}); refreshRoomBtns(); }
  function refreshRoomBtns(){ [...document.querySelectorAll('.roomBtn')].forEach((b,i)=>b.classList.toggle('active',i===roomIndex)); }
  nextBtn.onclick=()=>{ if(roomIndex < rooms.length-1){roomIndex++; modal.classList.add('hidden'); placeCats(); refreshRoomBtns();} else restart(); };
  $('restartBtn').onclick=restart; $('clearBestBtn').onclick=()=>{localStorage.removeItem(bestKey()); updateBest();};
  gameArea.addEventListener('click',()=>{ startTimer(); messageText.textContent='そこにはいないみたい。ほかを探してみよう。'; });
  buildRoomButtons(); updateBest(); placeCats();
})();
