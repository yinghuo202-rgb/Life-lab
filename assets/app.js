(() => {
  'use strict';
  const M=window.LifeModel; const $=id=>document.getElementById(id);
  const STATS=JSON.parse($('stats-data').textContent);
  const fmt=(n,places=0)=>Number(n).toLocaleString('zh-CN',{minimumFractionDigits:places,maximumFractionDigits:places});
  const fmtValue=(v,unit,step)=>unit==='元'?`¥${fmt(v)}`:unit==='%'?`${fmt(v)}%`:unit==='晚'?`${fmt(v)}晚`:`${fmt(v,step<1?2:0)}小时`;
  const state={id:'commute',params:{},priority:'default',usePct:75,preset:'direct',outcome:'medium'};
  const ids=Object.keys(M.CASES);
  function refreshButtonGroup(selector,attr,value){document.querySelectorAll(selector).forEach(el=>el.setAttribute('aria-pressed',String(el.dataset[attr]===String(value))));}
  function renderControls(){
    const spec=M.CASES[state.id];$('controls').replaceChildren();
    spec.controls.forEach(ctl=>{
      const field=document.createElement('div');field.className='field';
      const header=document.createElement('div');header.className='field-top';
      const label=document.createElement('label');label.htmlFor=`s-${ctl.key}`;label.textContent=ctl.label;
      const output=document.createElement('output');output.htmlFor=`s-${ctl.key}`;output.textContent=fmtValue(state.params[ctl.key],ctl.unit,ctl.step);output.id=`v-${ctl.key}`;
      header.append(label,output);
      const slider=document.createElement('input');slider.type='range';slider.id=`s-${ctl.key}`;slider.min=ctl.min;slider.max=ctl.max;slider.step=ctl.step;slider.value=state.params[ctl.key];slider.setAttribute('aria-label',ctl.label);
      slider.addEventListener('input',()=>{state.params[ctl.key]=Number(slider.value);output.textContent=fmtValue(state.params[ctl.key],ctl.unit,ctl.step);progress(slider);renderResult();});
      const tiny=document.createElement('div');tiny.className='field-bounds';tiny.innerHTML=`<span>${fmtValue(ctl.min,ctl.unit,ctl.step)}</span><span>${fmtValue(ctl.max,ctl.unit,ctl.step)}</span>`;
      const note=document.createElement('p');note.className='field-note';note.textContent=ctl.note;
      field.append(header,slider,tiny,note);$('controls').append(field);progress(slider);
    });
    $('case-title').textContent=spec.title;$('case-about').textContent=spec.about;
    $('origin').textContent=spec.origin==='原报告'?'原报告 · 假设情景':spec.origin==='原指南条目'?'原指南 · 教学情景':'新增 · 假设情景';
    const sourceEl=$('case-source');sourceEl.hidden=!spec.source;if(spec.source){sourceEl.href=spec.source;sourceEl.textContent=spec.sourceLabel+' ↗';}
    $('conversion-options').hidden=spec.kind!=='time';$('promotion-options').hidden=state.id!=='promotion';$('learning-options').hidden=state.id!=='learning';
    $('lab-panel').setAttribute('aria-labelledby',`tab-${state.id}`);
    refreshButtonGroup('[data-pct]','pct',state.usePct);refreshButtonGroup('[data-preset]','preset',state.preset);refreshButtonGroup('[data-outcome]','outcome',state.outcome);
  }
  function progress(inp){const x=(Number(inp.value)-Number(inp.min))/(Number(inp.max)-Number(inp.min))*100;inp.style.setProperty('--range',`${x}%`);}
  function selectCase(id){if(!M.CASES[id])return;
    state.id=id;state.params={...M.CASES[id].defaults};state.usePct=75;state.priority='default';state.preset='direct';state.outcome='medium';
    document.querySelectorAll('[data-id]').forEach(tab=>{const chosen=tab.dataset.id===id;tab.setAttribute('aria-selected',String(chosen));tab.tabIndex=chosen?0:-1;});
    refreshButtonGroup('[data-priority]','priority',state.priority);renderControls();renderResult();
  }
  function createCompare(rows){$('comparisons').innerHTML=`<div class="compare-head"><span></span><span>原有状态</span><span>调整方案</span></div>${rows.map(row=>`<div class="compare"><span>${row[0]}</span><b>${row[1]}</b><strong>${row[2]}</strong></div>`).join('')}`;}
  function tinyBar(label,n,color){return `<div class="lvi-bar"><span>${label}</span><div class="lvi-track"><div style="width:${Math.max(0,Math.min(100,n))}%;background:${color}"></div></div><b>${fmt(n,2)}</b></div>`;}
  function displayImpact(value){return (value>0?'+':'')+fmt(value,2);}
  function renderDetails(result){
    const table=`<div class="dim-grid"><div class="dim-head"><span>维度</span><span>权重</span><span>原有</span><span>方案</span><span>得分贡献</span></div>${result.contributions.map(x=>`<div class="dim-row"><span>${x.label}</span><span>${fmt(x.weight,1)}%</span><span>${fmt(x.before,1)}</span><span>${fmt(x.after,1)}</span><b class="${x.impact>0?'up':x.impact<0?'down':''}">${displayImpact(x.impact)}</b></div>`).join('')}</div>`;
    const variations=result.variants.map(v=>`${({money:'现金优先',default:'案例默认',time:'时间优先'})[v.priority]} ${displayImpact(v.delta)}`).join(' · ');
    $('contributions').innerHTML=table+`<p class="case-variants">同一假设在三组权重下：${variations}</p>`;
    $('assumption-note').textContent=result.note;
  }
  function renderResult(){
    const result=M.evaluate(state.id,state.params,{priority:state.priority,usePct:state.usePct,preset:state.preset,outcome:state.outcome});
    createCompare(result.rows);
    const d=result.delta;const tone=d>1?'positive':d< -1?'negative':'uncertain';
    $('delta').textContent=(d>0?'+':'')+fmt(d,2);$('delta').className='delta '+tone;
    const verdict=d>1?'情景下整体改善':d< -1?'情景下整体降低':'差异小，需验证';
    $('verdict').textContent=verdict;
    $('score-bars').innerHTML=tinyBar('现状',result.baseline,'#a7b4ad')+tinyBar('方案',result.proposed,'#156954');
    $('cost-label').textContent=result.priceLabel;$('cost-value').textContent=result.price;
    $('second-label').textContent=result.secondLabel;$('second-value').textContent=result.second;
    $('interpret').textContent=result.summary;
    renderDetails(result);
    refreshButtonGroup('[data-preset]','preset',state.preset);
  }
  document.querySelectorAll('[data-id]').forEach(btn=>{
    btn.addEventListener('click',()=>selectCase(btn.dataset.id));
    btn.addEventListener('keydown',ev=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(ev.key))return;ev.preventDefault();const idx=ids.indexOf(state.id);const next=ev.key==='Home'?0:ev.key==='End'?ids.length-1:(idx+(ev.key==='ArrowRight'?1:ids.length-1))%ids.length;selectCase(ids[next]);$(`tab-${ids[next]}`).focus();});
  });
  document.querySelectorAll('[data-priority]').forEach(el=>el.addEventListener('click',()=>{state.priority=el.dataset.priority;refreshButtonGroup('[data-priority]','priority',state.priority);renderResult();}));
  document.querySelectorAll('[data-pct]').forEach(el=>el.addEventListener('click',()=>{state.usePct=Number(el.dataset.pct);refreshButtonGroup('[data-pct]','pct',state.usePct);renderResult();}));
  document.querySelectorAll('[data-outcome]').forEach(el=>el.addEventListener('click',()=>{state.outcome=el.dataset.outcome;refreshButtonGroup('[data-outcome]','outcome',state.outcome);renderResult();}));
  document.querySelectorAll('[data-preset]').forEach(el=>el.addEventListener('click',()=>{state.preset=el.dataset.preset;state.params={...M.CASES.promotion.presets[state.preset]};renderControls();renderResult();}));
  $('reset').addEventListener('click',()=>selectCase(state.id));
  $('stat-income').textContent=`¥${fmt(STATS.income_2025.median_disposable_per_capita)}`;
  $('stat-wage').textContent=`¥${fmt(STATS.wages_2025.private_mean_gross)}`;
  $('stat-time').textContent=`${Math.floor(STATS.timeuse_2024.discretionary_minutes_per_day/60)}小时${STATS.timeuse_2024.discretionary_minutes_per_day%60}分`;
  $('source-income').href=STATS.income_2025.source;$('source-wage').href=STATS.wages_2025.source;$('source-time').href=STATS.timeuse_2024.source;
  selectCase('commute');
  window.LifeLab={selectCase,state,model:M};
})();
