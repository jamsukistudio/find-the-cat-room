const rooms=[
  {key:'bedroom',name:'寝室',furniture:`
    <div class="furniture window"><div class="curtain l"></div><div class="curtain r"></div><div class="windowSeat"></div></div>
    <div class="furniture bed"><div class="back"></div><div class="pillow"></div><div class="blanket"></div></div>
    <div class="furniture bookshelf"><div class="bookrow r1"><span></span><span></span><span></span><span></span></div><div class="bookrow r2"><span></span><span></span><span></span><span></span></div></div>
    <div class="furniture catTree"><div class="pole a"></div><div class="pole b"></div><div class="platform top"></div><div class="platform mid"></div></div>
    <div class="furniture catHouse"></div>`,
    spots:[
      {x:8,y:61,w:28,h:14,catX:20,catY:60},{x:39,y:28,w:34,h:13,catX:47,catY:30},{x:76,y:18,w:18,h:15,catX:80,catY:16},
      {x:79,y:50,w:18,h:14,catX:82,catY:49},{x:62,y:45,w:13,h:13,catX:64,catY:42},{x:6,y:76,w:12,h:10,catX:7,catY:70},
      {x:75,y:70,w:16,h:12,catX:77,catY:65},{x:45,y:68,w:18,h:10,catX:48,catY:63},{x:25,y:44,w:14,h:12,catX:25,catY:38},{x:86,y:34,w:11,h:13,catX:84,catY:31}
    ]},
  {key:'living',name:'リビング',furniture:`
    <div class="furniture window"><div class="curtain l"></div><div class="curtain r"></div><div class="windowSeat"></div></div>
    <div class="furniture sofa"></div><div class="furniture tv"></div><div class="furniture cabinet"></div><div class="furniture boxItem"></div>
    <div class="furniture plant"><div class="leaf a"></div><div class="leaf b"></div><div class="leaf c"></div><div class="pot"></div></div>
    <div class="furniture catTree"><div class="pole a"></div><div class="pole b"></div><div class="platform top"></div><div class="platform mid"></div></div>`,
    spots:[
      {x:9,y:50,w:35,h:14,catX:18,catY:47},{x:7,y:70,w:18,h:12,catX:9,catY:66},{x:48,y:50,w:26,h:11,catX:52,catY:45},
      {x:52,y:24,w:20,h:20,catX:55,catY:23},{x:82,y:67,w:15,h:14,catX:84,catY:62},{x:72,y:49,w:18,h:20,catX:75,catY:45},
      {x:64,y:18,w:14,h:13,catX:65,catY:14},{x:31,y:38,w:13,h:13,catX:31,catY:34},{x:85,y:35,w:11,h:12,catX:84,catY:31},{x:42,y:68,w:18,h:10,catX:45,catY:64}
    ]},
  {key:'kitchen',name:'キッチン',furniture:`
    <div class="furniture kitchen"></div><div class="furniture fridge"></div><div class="furniture table"></div><div class="furniture chair"></div><div class="furniture basket"></div>
    <div class="furniture plant"><div class="leaf a"></div><div class="leaf b"></div><div class="leaf c"></div><div class="pot"></div></div>`,
    spots:[
      {x:6,y:42,w:38,h:17,catX:17,catY:38},{x:8,y:67,w:20,h:13,catX:10,catY:63},{x:28,y:69,w:14,h:11,catX:29,catY:63},
      {x:44,y:57,w:29,h:16,catX:51,catY:52},{x:58,y:42,w:12,h:16,catX:57,catY:39},{x:78,y:24,w:17,h:40,catX:80,catY:41},
      {x:78,y:69,w:17,h:12,catX:80,catY:64},{x:55,y:72,w:18,h:11,catX:58,catY:66},{x:34,y:29,w:13,h:13,catX:34,catY:25},{x:67,y:22,w:12,h:15,catX:66,catY:20}
    ]}
];

const poses=['sit','stretch','peek','tailonly','loaf','boxpose','sit','peek','stretch','loaf'];
let roomIndex=0,found=0,total=4,startTime=0,timerId=null,gameStarted=false;
const scene=document.getElementById('scene'),roomLayer=document.getElementById('roomLayer'),spotLayer=document.getElementById('spotLayer'),catLayer=document.getElementById('catLayer');
const stageName=document.getElementById('stageName'),foundEl=document.getElementById('found'),timerEl=document.getElementById('timer'),message=document.getElementById('message'),badges=document.getElementById('badges');
const startPanel=document.getElementById('startPanel'),clearPanel=document.getElementById('clearPanel'),clearText=document.getElementById('clearText'),clearTitle=document.getElementById('clearTitle');
document.getElementById('total').textContent=total;

function shuffle(a){return [...a].sort(()=>Math.random()-0.5)}
function choice(a){return a[Math.floor(Math.random()*a.length)]}
function makeCat(kind,pose){
  const cat=document.createElement('div');
  cat.className=`cat ${kind} ${pose}`;
  cat.innerHTML=`<div class="tail"></div><div class="body"></div><div class="head"><div class="ear l"></div><div class="ear r"></div><div class="eye l"></div><div class="eye r"></div><div class="nose"></div><div class="spotmark"></div><div class="patch p1"></div><div class="patch p2"></div></div>`;
  return cat;
}
function drawBadges(){badges.innerHTML='';for(let i=0;i<total;i++){badges.appendChild(document.createElement('span'))}}
function setTimer(on){clearInterval(timerId); if(on){startTime=performance.now();timerId=setInterval(()=>{timerEl.textContent=((performance.now()-startTime)/1000).toFixed(2)},50)}}
function loadRoom(){
  const r=rooms[roomIndex];
  scene.className=`scene ${r.key}`;
  roomLayer.innerHTML=r.furniture;
  spotLayer.innerHTML=''; catLayer.innerHTML='';
  stageName.textContent=r.name; found=0; foundEl.textContent=0; message.textContent='隠れそうな場所をタップしてね。';
  drawBadges(); clearPanel.classList.add('hidden'); setTimer(true);
  const selected=shuffle(r.spots).slice(0,total);
  selected.forEach((s,i)=>{
    const spot=document.createElement('button');
    spot.className='spot';
    spot.style.left=s.x+'%';spot.style.top=s.y+'%';spot.style.width=s.w+'%';spot.style.height=s.h+'%';
    const kind=Math.random()<0.5?'rui':'mai';
    const pose=choice(poses);
    const cat=makeCat(kind,pose);
    cat.style.left=s.catX+'%';cat.style.top=s.catY+'%';
    catLayer.appendChild(cat);
    spot.addEventListener('click',()=>{
      if(spot.disabled)return;
      spot.disabled=true;
      cat.classList.add('show');
      found++; foundEl.textContent=found;
      badges.children[found-1].classList.add('on');
      message.textContent=`${kind==='rui'?'るいたん':'まいたん'}発見！ にゃ！ あと${total-found}匹。`;
      if(found===total){
        setTimer(false);
        const t=timerEl.textContent;
        clearTitle.textContent=roomIndex===rooms.length-1?'ALL CLEAR!':'CLEAR!';
        clearText.textContent=roomIndex===rooms.length-1?`全部の部屋クリア！タイム ${t} 秒`:`${r.name}クリア！タイム ${t} 秒`;
        setTimeout(()=>clearPanel.classList.remove('hidden'),600);
      }
    });
    spotLayer.appendChild(spot);
  });
}
document.getElementById('startBtn').addEventListener('click',()=>{startPanel.classList.add('hidden');gameStarted=true;roomIndex=0;loadRoom()});
document.getElementById('nextBtn').addEventListener('click',()=>{if(roomIndex===rooms.length-1){roomIndex=0}else{roomIndex++}loadRoom()});
document.getElementById('reset').addEventListener('click',()=>{if(!gameStarted){return}loadRoom()});
