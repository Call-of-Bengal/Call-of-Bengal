(()=>{
'use strict';
const grid=document.getElementById('exchange-records');if(!grid)return;
const field=document.getElementById('exchange-search');
const count=document.getElementById('exchange-count');
const buttons=[...document.querySelectorAll('[data-region]')];
const empty=document.getElementById('exchange-empty');
const noResults=document.getElementById('exchange-no-results');
const error=document.getElementById('exchange-error');
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const isPage=value=>typeof value==='string'&&/^exchange-stories\/[a-zA-Z0-9_-]+\.html$/.test(value);
const isCover=value=>typeof value==='string'&&/^assets\/exchange\/[a-zA-Z0-9_-]+\.(?:webp|png|jpg|jpeg)$/.test(value);
const regions={korea:['한국','কোরিয়া'],bengal:['벵골','বাংলা']};
const allowed=new Set(['all',...Object.keys(regions)]);
let stories=[],authors=new Map(),region='all',failed=false;
function restore(){const p=new URLSearchParams(location.search);field.value=p.get('q')||'';region=allowed.has(p.get('region'))?p.get('region'):'all';}
function updateURL(){const url=new URL(location.href);const q=field.value.trim();if(q)url.searchParams.set('q',q);else url.searchParams.delete('q');if(region!=='all')url.searchParams.set('region',region);else url.searchParams.delete('region');history.replaceState(null,'',url.pathname+url.search+url.hash);}
function card(s){
 const a=authors.get(s.author_id);const label=regions[s.region]||regions.korea;
 const image=isCover(s.cover_image)?`<a class="record-cover" href="${escapeHTML(s.url)}" aria-label="${escapeHTML(s.title_ko)} 자세히 보기"><img src="${escapeHTML(s.cover_image)}" loading="lazy" alt="${escapeHTML(s.title_ko)} 표지 이미지"/></a>`:'<div class="exchange-cover-placeholder" aria-hidden="true"><span>✧</span><small>CALL OF BENGAL</small></div>';
 const subtitle=s.title_original?`<span class="record-original" lang="${s.original_language==='bn'?'bn':s.original_language==='ko'?'ko':'und'}">${escapeHTML(s.title_original)}</span>`:'';
 const name=a?escapeHTML(a.name_ko):'작가 정보 확인 중';
 const author=a?`<a class="exchange-author" href="contributors.html?author=${encodeURIComponent(a.id)}">${name}</a>`:`<span class="exchange-author">${name}</span>`;
 const external=typeof s.source_url==='string'&&/^https?:\/\/[^\s]+$/i.test(s.source_url)?`<a class="exchange-source" href="${escapeHTML(s.source_url)}" target="_blank" rel="noopener noreferrer">원문 출처 ↗<span class="bn" lang="bn">মূল প্রকাশনা</span></a>`:'';
 return `<article class="record exchange-record">${image}<div class="record-copy"><a href="${escapeHTML(s.url)}"><h3>${escapeHTML(s.title_ko)}${subtitle}</h3></a><p class="record-meta">${label[0]}<span class="bn" lang="bn">${label[1]}</span></p><p class="exchange-byline">글 <span class="bn" lang="bn">লেখক</span> ${author}</p>${s.summary_ko?`<p class="record-desc">${escapeHTML(s.summary_ko)}</p>`:''}${external}</div></article>`;
}
function render(){
 error.hidden=!failed;empty.hidden=failed||stories.length!==0;noResults.hidden=true;
 if(failed){grid.hidden=true;grid.replaceChildren();count.textContent='불러오기 실패 · লোড করা যায়নি';}
 else{const q=field.value.trim().toLocaleLowerCase();const selected=stories.filter(s=>(region==='all'||s.region===region)&&[s.title_ko,s.title_original,s.summary_ko,Array.isArray(s.tags)?s.tags.join(' '):'',authors.get(s.author_id)?.name_ko,authors.get(s.author_id)?.name_original].join(' ').toLocaleLowerCase().includes(q));
 grid.innerHTML=selected.map(card).join('');grid.hidden=selected.length===0;noResults.hidden=stories.length===0||selected.length!==0;count.textContent=`${selected.length}건 · ${selected.length.toLocaleString('bn-BD')}টি গল্প`;
 }
 buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.region===region)));
}
async function load(){try{
 const [storiesRes,authorsRes]=await Promise.all([fetch('data/exchange-stories.json',{cache:'no-cache'}),fetch('data/contributors.json',{cache:'no-cache'})]);
 if(!storiesRes.ok||!authorsRes.ok)throw new Error('Data fetch failed');
 const [storyData,authorData]=await Promise.all([storiesRes.json(),authorsRes.json()]);
 if(!Array.isArray(storyData)||!Array.isArray(authorData))throw new Error('Data must be arrays');
 authors=new Map(authorData.filter(a=>a&&a.published===true&&typeof a.id==='string'&&typeof a.name_ko==='string'&&regions[a.region]).map(a=>[a.id,a]));
 stories=storyData.filter(s=>s&&s.published===true&&isPage(s.url)&&typeof s.title_ko==='string'&&typeof s.author_id==='string'&&regions[s.region]&&authors.has(s.author_id));
 failed=false;
 }catch(e){failed=true;stories=[];authors=new Map();console.error('Call of Bengal exchange:',e);}render();}
restore();buttons.forEach(b=>b.addEventListener('click',()=>{region=b.dataset.region;updateURL();render()}));
field.addEventListener('input',()=>{updateURL();render()});window.addEventListener('popstate',()=>{restore();render()});
document.getElementById('exchange-retry').addEventListener('click',load);load();
})();
