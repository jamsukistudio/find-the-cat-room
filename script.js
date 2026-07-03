const stages=[
  {name:'寝室',img:'room1.png',spots:[
    {x:20,y:45,w:14,h:14,cx:23,cy:39},{x:27,y:71,w:10,h:8,cx:25,cy:65},{x:45,y:29,w:12,h:11,cx:45,cy:28},{x:60,y:29,w:10,h:12,cx:59,cy:27},
    {x:70,y:41,w:11,h:10,cx:71,cy:36},{x:82,y:42,w:13,h:12,cx:82,cy:39},{x:86,y:55,w:10,h:11,cx:86,cy:52},{x:79,y:12,w:13,h:12,cx:79,cy:10},
    {x:63,y:16,w:15,h:14,cx:65,cy:13},{x:32,y:54,w:17,h:13,cx:34,cy:51},{x:53,y:56,w:14,h:12,cx:54,cy:53},{x:12,y:62,w:14,h:12,cx:13,cy:57}
  ]},
  {name:'リビング',img:'room2.png',spots:[
    {x:3,y:28,w:14,h:17,cx:5,cy:28},{x:18,y:68,w:17,h:14,cx:19,cy:64},{x:64,y:58,w:15,h:18,cx:66,cy:54},{x:77,y:35,w:13,h:10,cx:78,cy:31},
    {x:30,y:40,w:18,h:12,cx:33,cy:36},{x:45,y:48,w:14,h:12,cx:47,cy:43},{x:58,y:29,w:13,h:13,cx:59,cy:26},{x:86,y:69,w:12,h:12,cx:86,cy:63},
    {x:8,y:58,w:12,h:10,cx:8,cy:53},{x:70,y:17,w:14,h:13,cx:71,cy:13},{x:40,y:69,w:17,h:10,cx:43,cy:64},{x:52,y:63,w:14,h:12,cx:53,cy:58}
  ]},
  {name:'キッチン',img:'room3.png',spots:[
    {x:26,y:65,w:9,h:8,cx:25,cy:64},{x:45,y:31,w:10,h:10,cx:45,cy:30},{x:65,y:22,w:12,h:13,cx:66,cy:18},{x:82,y:52,w:12,h:11,cx:82,cy:49},
    {x:88,y:72,w:10,h:10,cx:88,cy:69},{x:70,y:11,w:9,h:12,cx:70,cy:8},{x:14,y:20,w:12,h:10,cx:15,cy:15},{x:56,y:64,w:14,h:10,cx:57,cy:59},
    {x:40,y:50,w:13,h:11,cx:40,cy:46},{x:76,y:64,w:13,h:12,cx:77,cy:59},{x:7,y:55,w:13,h:12,cx:8,cy:50},{x:60,y:41,w:12,h:11,cx:61,cy:36}
  ]}
];

const poses=['pose1','pose2','pose3','pose4','pose5','pose6','pose7','pose8','pose9','pose10'];
let stage=0,found=0,total=4,start=0,timer=null,started=false;

const room=document.getElementById('room'),spotsEl=document.getElementById('spots'),catsEl=document.getElementById('cats'),fx=document.getElementById('fx');
const stageNow=document.getElementById('stageNow'),foundEl=document.getElementById('found'),timerEl=document.getElementById('timer'),message=document.getElementById('message'),poseList=document.getElementById('poseList');
const startPanel=document.getElementById('startPanel'),clearPanel=document.getElementById('clearPanel'),clearTitle=document.getElementById('clearTitle'),clearText=document.getElementById('clearText');
document.getElementById('total').textContent=total;

function shuffle(arr){return [...arr].sort(()=>Math.random()-0.5)}
function pick(arr){return arr[Math.floor(Math.random()*arr.length)]}
function timeText(ms){const sec=ms/1000;const m=Math.floor(sec/60);const s=(sec%60).toFixed(2).padStart(5,'0');return String(m).padStart(2,'0')+':'+s}
function startTimer(){clearInterval(timer);start=performance.now();timer=setInterval(()=>timerEl.textContent=timeText(performance.now()-start),40)}
function stopTimer(){clearInterval(timer)}
function drawPoseDots(){poseList.innerHTML='';for(let i=0;i<total;i++){poseList.appendChild(document.createElement('span'))}}

function makeCat(kind,pose){
  const cat=document.createElement('div');
  cat.className=`cat ${kind} ${pose}`;
  cat.innerHTML=`<div class="tail"></div><div class="body"></div><div class="head"><div class="ear l"></div><div class="ear r"></div><div class="eye l"></div><div class="eye r"></div><div class="nose"></div><div class="mouth">ω</div><div class="ruiMark"></div><div class="patch a"></div><div class="patch b"></div><div class="patch c"></div></div>`;
  return cat;
}

function sparkle(x,y){
  const s=document.createElement('div');
  s.className='spark';s.textContent='✨';s.style.left=x+'px';s.style.top=y+'px';
  fx.appendChild(s);setTimeout(()=>s.remove(),800);
}

function loadStage(){
  const data=stages[stage];
  found=0;foundEl.textContent=0;stageNow.textContent=stage+1;room.src=data.img;
  spotsEl.innerHTML='';catsEl.innerHTML='';fx.innerHTML='';clearPanel.classList.add('hidden');drawPoseDots();
  message.textContent=`${data.name}：4匹を探してね。`;
  startTimer();
  const chosen=shuffle(data.spots).slice(0,total);
  chosen.forEach((sp,i)=>{
    const btn=document.createElement('button');
    btn.className='spot';
    btn.style.left=sp.x+'%';btn.style.top=sp.y+'%';btn.style.width=sp.w+'%';btn.style.height=sp.h+'%';
    const kind=Math.random()<0.5?'rui':'mai';
    const cat=makeCat(kind,pick(poses));
    cat.style.left=sp.cx+'%';cat.style.top=sp.cy+'%';
    catsEl.appendChild(cat);
    btn.addEventListener('click',()=>{
      if(btn.disabled)return;
      btn.disabled=true;cat.classList.add('show');
      found++;foundEl.textContent=found;poseList.children[found-1].classList.add('on');
      const r=btn.getBoundingClientRect(),sr=document.getElementById('scene').getBoundingClientRect();
      sparkle(r.left-sr.left+r.width/2,r.top-sr.top+r.height/2);
      message.textContent=`${kind==='rui'?'るいたん':'まいたん'}発見！ にゃ！ あと${total-found}匹。`;
      if(found===total){
        stopTimer();
        const t=timerEl.textContent;
        clearTitle.textContent=stage===stages.length-1?'ALL CLEAR!':'CLEAR!';
        clearText.textContent=stage===stages.length-1?`全部クリア！タイム ${t}`:`${data.name}クリア！タイム ${t}`;
        setTimeout(()=>clearPanel.classList.remove('hidden'),550);
      }
    });
    spotsEl.appendChild(btn);
  });
}

document.getElementById('startBtn').addEventListener('click',()=>{started=true;startPanel.classList.add('hidden');stage=0;loadStage();});
document.getElementById('nextBtn').addEventListener('click',()=>{stage=stage===stages.length-1?0:stage+1;loadStage();});
document.getElementById('resetBtn').addEventListener('click',()=>{if(started)loadStage();});
