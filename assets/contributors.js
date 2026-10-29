(()=>{
'use strict';
const overlay=document.getElementById('contributor-overlay');if(!overlay)return;
const dialog=overlay.querySelector('[role="dialog"]');const close=document.getElementById('contributor-close');
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const isPage=value=>typeof value==='string'&&/^exchange-stories\/[a-zA-Z0-9_-]+\.html$/.test(value);
const safeURL=value=>typeof value==='string'&&/^https?:\/\/[^\s]+$/i.test(value);
const regions={korea:['한국','কোরিয়া'],bengal:['벵골','বাংলা']};
const columns={korea:document.getElementById('korea-contributors'),bengal:document.getElementById('bengal-contributors')};
let authors=new Map(),stories=[],trigger=null,current=null;
function authorItems(region){const list=[...authors.values()].filter(a=>a.region===region).sort((a,b)=>a.name_ko.localeCompare(b.name_ko,'ko'));const ul=columns[region];
 ul.innerHTML=list.map(a=>`<li><button type="button" class="contributor-open" data-author="${escapeHTML(a.id)}"><span>${escapeHTML(a.name_ko)}</span>${a.name_original?`<span class="contributor-list-original" lang="${a.original_language==='bn'?'bn':a.original_language==='ko'?'ko':'und'}">${escapeHTML(a.name_original)}</span>`:''}<span class="contributor-chevron" aria-hidden="true">↗</span></button></li>`).join('');
 document.getElementById(region+'-empty').hidden=list.length!==0;
 document.getElementById(region+'-total').textContent=`${list.length}명 · ${list.length.toLocaleString('bn-BD')} জন`;
}
function setAuthor(a){
 document.getElementById('contributor-name').textContent=a.name_ko;
 const original=document.getElementById('contributor-original');original.hidden=!a.name_original;original.textContent=a.name_original||'';original.lang=a.original_language==='bn'?'bn':a.original_language==='ko'?'ko':'und';
 const region=document.getElementById('contributor-region');region.innerHTML=regions[a.region][0]+' / <span lang="bn">'+regions[a.region][1]+'</span>';
 const bio=document.getElementById('contributor-bio');if(a.bio_ko){bio.textContent=a.bio_ko}else{bio.innerHTML='작가가 제공한 소개가 없습니다.<span class="bn" lang="bn">লেখকের পরিচিতি এখনও দেওয়া হয়নি।</span>'}
 const works=stories.filter(s=>s.author_id===a.id).sort((a,b)=>String(b.published_at||'').localeCompare(String(a.published_at||'')));
 document.getElementById('contributor-works').innerHTML=works.length?works.map(s=>`<li><a href="${escapeHTML(s.url)}">${escapeHTML(s.title_ko)}<span aria-hidden="true"> ↗</span></a></li>`).join(''):'<li class="contributor-no-works">현재 공개된 작품이 없습니다.<span class="bn" lang="bn">এখনও কোনো লেখা প্রকাশিত হয়নি।</span></li>';
 const links=Array.isArray(a.links)?a.links.filter(l=>l&&safeURL(l.url)&&typeof l.label==='string').slice(0,12):[];
 document.getElementById('contributor-links').innerHTML=links.length?links.map(l=>`<a class="source-action" href="${escapeHTML(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(l.label)} ↗</a>`).join(''):'<p class="contributor-no-links">공개된 외부 채널이 없습니다.<span class="bn" lang="bn">কোনো প্রকাশ্য অনলাইন লিংক নেই।</span></p>';
}
function urlWithAuthor(id){const url=new URL(location.href);if(id)url.searchParams.set('author',id);else url.searchParams.delete('author');return url.pathname+url.search+url.hash;}
function open(id,source,editURL=true){const a=authors.get(id);if(!a)return;
 if(overlay.hidden){trigger=source||document.activeElement;}
 current=id;setAuthor(a);overlay.hidden=false;document.body.classList.add('dialog-open');close.focus();
 if(editURL)history.replaceState(null,'',urlWithAuthor(id));
}
function hide(editURL=true){if(overlay.hidden)return;overlay.hidden=true;document.body.classList.remove('dialog-open');current=null;if(editURL)history.replaceState(null,'',urlWithAuthor(null));if(trigger&&typeof trigger.focus==='function'&&document.contains(trigger))trigger.focus();trigger=null;}
function sync(){const id=new URLSearchParams(location.search).get('author');if(id&&authors.has(id))open(id,null,false);else hide(false);}
function trap(event){if(overlay.hidden)return;if(event.key==='Escape'){event.preventDefault();hide();return;}if(event.key!=='Tab')return;
 const els=[...dialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el=>el.getClientRects().length);
 if(!els.length)return;const first=els[0],last=els[els.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
}
async function load(){try{
 const [authorsRes,storiesRes]=await Promise.all([fetch('data/contributors.json',{cache:'no-cache'}),fetch('data/exchange-stories.json',{cache:'no-cache'})]);
 if(!authorsRes.ok||!storiesRes.ok)throw new Error('Data fetch failed');
 const [a,s]=await Promise.all([authorsRes.json(),storiesRes.json()]);if(!Array.isArray(a)||!Array.isArray(s))throw new Error('Data must be arrays');
 authors=new Map(a.filter(x=>x&&x.published===true&&typeof x.id==='string'&&typeof x.name_ko==='string'&&regions[x.region]).map(x=>[x.id,x]));
 stories=s.filter(x=>x&&x.published===true&&typeof x.title_ko==='string'&&isPage(x.url)&&authors.has(x.author_id));
 document.getElementById('contributors-error').hidden=true;document.getElementById('contributors-grid').hidden=false;
 authorItems('korea');authorItems('bengal');sync();
 }catch(e){console.error('Call of Bengal contributors:',e);document.getElementById('contributors-error').hidden=false;document.getElementById('contributors-grid').hidden=true;hide(false);}}
Object.values(columns).forEach(ul=>ul.addEventListener('click',e=>{const btn=e.target.closest('button[data-author]');if(btn)open(btn.dataset.author,btn);}));
close.addEventListener('click',()=>hide());overlay.addEventListener('click',e=>{if(e.target===overlay)hide()});document.addEventListener('keydown',trap);window.addEventListener('popstate',sync);
document.getElementById('contributors-retry').addEventListener('click',load);load();
})();
