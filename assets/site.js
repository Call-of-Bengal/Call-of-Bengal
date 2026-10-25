(()=>{
const target=document.getElementById('records');
const featured=document.getElementById('featured-records');
if(!target&&!featured)return;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const genres={fantasy:['판타지·모험','রূপকথা ও অভিযান'],horror:['공포·미스터리','ভৌতিক ও রহস্য'],romance:['로맨스·가족','প্রেম ও পরিবার'],moral:['교훈·풍자','নীতিকথা ও ব্যঙ্গ']};
const allowed=new Set(['all',...Object.keys(genres)]);
const input=document.getElementById('archive-search');
const buttons=[...document.querySelectorAll('[data-genre]')];
const count=document.getElementById('result-count');
const empty=document.getElementById('empty-state');
const noResults=document.getElementById('no-results');
const error=document.getElementById(target?'archive-error':'featured-error');
let stories=[],failed=false;
function stateFromURL(){
 if(!input)return;
 const params=new URLSearchParams(location.search);
 input.value=params.get('q')||'';
 const g=params.get('genre');genre=allowed.has(g)?g:'all';
}
let genre='all';stateFromURL();
function syncURL(){
 if(!input)return;
 const url=new URL(location.href);const q=input.value.trim();
 if(q)url.searchParams.set('q',q);else url.searchParams.delete('q');
 if(genre!=='all')url.searchParams.set('genre',genre);else url.searchParams.delete('genre');
 history.replaceState(null,'',url.pathname+url.search+url.hash);
}
function card(s){const g=genres[s.genre]||['민담','লোককথা'];return `<article class="record"><a href="${esc(s.url)}"><h3>${esc(s.title_ko)}<span class="bn" lang="bn">${esc(s.title_bn)}</span></h3></a><p class="record-meta">${esc(g[0])}<span class="bn" lang="bn">${esc(g[1])}</span></p>${s.summary_ko?`<p class="record-desc">${esc(s.summary_ko)}${s.summary_bn?`<span class="bn" lang="bn">${esc(s.summary_bn)}</span>`:''}</p>`:''}</article>`}
function render(){
 if(featured){
  const normal=document.getElementById('featured-empty');
  featured.hidden=failed||stories.length===0;normal.hidden=failed||stories.length>0;error.hidden=!failed;
  featured.innerHTML=failed?'':stories.slice(0,4).map(card).join('');return;
 }
 error.hidden=!failed;
 empty.hidden=failed||stories.length!==0;
 noResults.hidden=true;
 if(failed){target.hidden=true;target.innerHTML='';count.textContent='불러오기 실패 · লোড করা যায়নি';}
 else{
  const q=input.value.trim().toLocaleLowerCase();
  const selected=stories.filter(s=>(genre==='all'||s.genre===genre)&&[s.title_ko,s.title_bn,s.summary_ko,s.summary_bn,s.collector_ko,s.collector_bn,...(Array.isArray(s.tags)?s.tags:[])].join(' ').toLocaleLowerCase().includes(q));
  target.innerHTML=selected.map(card).join('');target.hidden=!selected.length;
  noResults.hidden=stories.length===0||selected.length!==0;
  count.textContent=`${selected.length}건 · ${selected.length.toLocaleString('bn-BD')}টি গল্প`;
 }
 buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.genre===genre)));
}
async function load(){
 try{
  const r=await fetch('data/stories.json',{cache:'no-cache'});
  if(!r.ok)throw new Error('HTTP '+r.status);
  const data=await r.json();if(!Array.isArray(data))throw new Error('Invalid story list');
  stories=data.filter(s=>s&&s.published===true&&typeof s.title_ko==='string'&&typeof s.title_bn==='string'&&typeof s.url==='string'&&/^stories\/[a-zA-Z0-9_/-]+\.html$/.test(s.url));
  failed=false;
 }catch(e){failed=true;stories=[];console.error('Call of Bengal: story data unavailable',e)}
 render();
}
buttons.forEach(b=>b.addEventListener('click',()=>{genre=b.dataset.genre;syncURL();render()}));
if(input)input.addEventListener('input',()=>{syncURL();render()});
window.addEventListener('popstate',()=>{stateFromURL();render()});
document.querySelectorAll('[data-retry]').forEach(b=>b.addEventListener('click',load));
load();
})();