const stages=[
  {img:'room1.png',total:4,spots:[
    {name:'棚の上のしっぽ',x:28.5,y:18,w:8,h:10},
    {name:'ベッドのねこ',x:78,y:37,w:13,h:12},
    {name:'箱のねこ',x:58,y:45,w:11,h:10},
    {name:'棚下のねこ',x:6,y:59,w:10,h:9}
  ]},
  {img:'room2.png',total:4,spots:[
    {name:'出窓のねこ',x:5,y:32,w:12,h:18},
    {name:'ベッドのねこ',x:78,y:35,w:12,h:10},
    {name:'箱のねこ',x:18,y:69,w:16,h:14},
    {name:'クッション前のねこ',x:68,y:61,w:13,h:18}
  ]},
  {img:'room3.png',total:5,spots:[
    {name:'ベッド下のねこ',x:25,y:65,w:10,h:9},
    {name:'出窓の三毛ねこ',x:45,y:31,w:10,h:12},
    {name:'キャットタワーの白ねこ',x:65,y:22,w:12,h:15},
    {name:'本棚の箱ねこ',x:82,y:52,w:12,h:12},
    {name:'箱のしっぽ',x:88,y:72,w:10,h:11}
  ]}
];

const roomImg=document.getElementById('roomImg');
const spotsEl=document.getElementById('spots');
const foundEl=document.getElementById('found');
const totalEl=document.getElementById('total');
const stageText=document.getElementById('stageText');
const message=document.getElementById('message');
const clear=document.getElementById('clear');
const clearTitle=document.getElementById('clearTitle');
const nextBtn=document.getElementById('nextBtn');
const resetBtn=document.getElementById('resetBtn');
const effect=document.getElementById('effect');
let stage=0,found=0;

function spark(btn){
  const r=btn.getBoundingClientRect();
  const sr=document.querySelector('.scene').getBoundingClientRect();
  const s=document.createElement('div');
  s.className='spark';
  s.textContent='✨';
  s.style.left=(r.left-sr.left+r.width/2)+'px';
  s.style.top=(r.top-sr.top+r.height/2)+'px';
  effect.appendChild(s);
  setTimeout(()=>s.remove(),850);
}

function loadStage(){
  const data=stages[stage];
  found=0;
  roomImg.src=data.img;
  foundEl.textContent=0;
  totalEl.textContent=data.total;
  stageText.textContent=`${stage+1} / ${stages.length}`;
  message.textContent='家具に隠れている猫をタップしてね。';
  clear.classList.add('hidden');
  spotsEl.innerHTML='';
  data.spots.forEach((p)=>{
    const b=document.createElement('button');
    b.className='spot';
    b.style.left=p.x+'%';
    b.style.top=p.y+'%';
    b.style.width=p.w+'%';
    b.style.height=p.h+'%';
    b.setAttribute('aria-label',p.name);
    b.addEventListener('click',()=>{
      if(b.classList.contains('found'))return;
      b.classList.add('found');
      found++;
      foundEl.textContent=found;
      spark(b);
      const left=data.total-found;
      message.textContent=`${p.name}を見つけた！ あと${left}匹。`;
      if(left===0){
        if(stage===stages.length-1){
          clearTitle.innerHTML='ALL CLEAR!';
          nextBtn.textContent='最初から';
        }else{
          clearTitle.innerHTML='CLEAR!';
          nextBtn.textContent='次の部屋へ';
        }
        setTimeout(()=>clear.classList.remove('hidden'),350);
      }
    });
    spotsEl.appendChild(b);
  });
}

nextBtn.addEventListener('click',()=>{
  if(stage===stages.length-1){stage=0}else{stage++}
  loadStage();
});
resetBtn.addEventListener('click',()=>loadStage());
loadStage();
