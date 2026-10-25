
(async()=>{
const target=document.getElementById('records');const featured=document.getElementById('featured-records');
if(!target&&!featured)return;
let stories=[];
try{const r=await fetch('data/stories.json',{cache:'no-cache'});if(!r.ok)throw Error('data');const data=await r.json();if(Array.isArray(data))stories=data.filter(s=>s&&s.published===true&&typeof s.title_ko==='string'&&typeof s.title_bn==='string'&&typeof s.url==='string'&&/^stories\/[a-zA-Z0-9_/-]+\.html$/.test(s.url));}catch(e){console.warn('Story list unavailable',e)}
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const genres={fantasy:['판타지·모험','রূপকথা ও অভিযান'],horror:['공포·미스터리','ভৌতিক ও রহস্য'],romance:['로맨스·가족','প্রেম ও পরিবার'],moral:['교훈·풍자','নীতিকথা ও ব্যঙ্গ']};
function card(s){const g=genres[s.genre]||['민담','লোককথা'];return `<article class="record"><a href="${esc(s.url)}"><h3>${esc(s.title_ko)}<span class="bn" lang="bn">${esc(s.title_bn)}</span></h3></a><p class="record-meta">${esc(g[0])}<span class="bn" lang="bn">${esc(g[1])}</span></p>${s.summary_ko?`<p class="record-desc">${esc(s.summary_ko)}${s.summary_bn?`<span class="bn" lang="bn">${esc(s.summary_bn)}</span>`:''}</p>`:''}</article>`}
if(featured){if(stories.length){featured.innerHTML=stories.slice(0,4).map(card).join('');featured.hidden=false;document.getElementById('featured-empty').hidden=true;}return}
const input=document.getElementById('archive-search');const buttons=[...document.querySelectorAll('[data-genre]')];const count=document.getElementById('result-count');const empty=document.getElementById('empty-state');const noResults=document.getElementById('no-results');const allowed=new Set(['all',...Object.keys(genres)]);const params=new URLSearchParams(location.search);let genre=allowed.has(params.get('genre'))?params.get('genre'):'all';input.value=params.get('q')||'';
function render(){const q=input.value.trim().toLocaleLowerCase();const selected=stories.filter(s=>(genre==='all'||s.genre===genre)&&[s.title_ko,s.title_bn,s.summary_ko,s.summary_bn,s.collector_ko,s.collector_bn,...(Array.isArray(s.tags)?s.tags:[])].join(' ').toLocaleLowerCase().includes(q));target.innerHTML=selected.map(card).join('');target.hidden=selected.length===0;empty.hidden=!(stories.length===0);noResults.hidden=!(stories.length>0&&selected.length===0);count.textContent=`${selected.length}건 · ${selected.length.toLocaleString('bn-BD')}টি গল্প`;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.genre===genre)))}
buttons.forEach(b=>b.addEventListener('click',()=>{genre=b.dataset.genre;render()}));input.addEventListener('input',render);render();
})();
