/* LVI educational scenario model, V4.
 * Original score vectors are reproduced from the author's source markdown.
 * Every response coefficient applied to edited sliders is an editorial
 * sensitivity assumption, NOT a validated effect estimate.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.LifeModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const DIMENSIONS = ['时间','金钱','心理','健康','职业','关系','风险','可持续'];
  const WEIGHTS = {
    standard:[15,15,15,20,10,10,10,5],
    commute:[15,15,15,15,20,8,7,5],
    promotion:[12,12,12,20,8,18,13,5],
    freelance:[15,15,12,15,12,8,18,5]
  };
  const original = {
    commute:{baseline:[48,72,52,48,66,58,70,56],after:[76,62,64,66,68,64,66,68]},
    promotion:{baseline:[65,68,68,72,70,82,78,70],direct:[35,82,50,52,86,48,72,45],negotiated:[62,78,70,70,84,78,78,68]},
    freelance:{baseline:[38,72,56,52,74,50,34,42],full:[70,70,68,68,80,58,72,70]}
  };
  const clamp=(v,lo=0,hi=100)=>Math.min(hi,Math.max(lo,v));
  const round2 = n => Math.round((n+Number.EPSILON)*100)/100;
  function dot(values,weights){return values.reduce((sum,value,i)=>sum+value*weights[i],0)/100;}
  function weightFor(id, priority='default'){
    const key=WEIGHTS[id] ? id : 'standard';
    const originalWeight=WEIGHTS[key].slice();
    if(priority==='default')return originalWeight;
    const factors = priority==='money' ? [0.85,1.8,0.95,1,0.95,0.9,1.35,1] :
      priority==='time' ? [1.7,0.65,1.2,1.15,1,1.05,0.8,1] : Array(8).fill(1);
    const raw=originalWeight.map((x,i)=>x*factors[i]);const total=raw.reduce((a,b)=>a+b,0);
    return raw.map(x=>x*100/total);
  }
  function score(base,deltas){return base.map((x,i)=>round2(clamp(x+deltas[i])));}
  const yuan=n=>`¥${Number(n).toLocaleString('zh-CN',{maximumFractionDigits:0})}`;
  function oneDecimal(n){return Number(n).toLocaleString('zh-CN',{minimumFractionDigits:1,maximumFractionDigits:1});}
  function hourCost(yearCash, hoursWeekly, usePct=100){const hours=52*hoursWeekly*usePct/100;return hours>0?yearCash/hours:null;}
  function explainRatio(value,label){return value===null?'—':`¥${oneDecimal(value)}/小时`;}
  const CONTROL = (key,label,value,min,max,step,unit,note) => ({key,label,value,min,max,step,unit,note});
  const CASES = {
    commute:{
      title:'搬近公司，值得多付房租吗？',short:'搬家换时间',origin:'原报告',kind:'time',
      about:'27岁，月税后收入11,500元；每周通勤8.3小时。',
      weights:'commute',base:original.commute.baseline,
      controls:[CONTROL('cost','每月额外房租',1200,0,3500,100,'元','相对现有住房支出的增量'),CONTROL('hours','每周减少通勤',5,0,8,0.5,'小时','原本每周通勤8.3小时')],
      defaults:{cost:1200,hours:5},
      headline:'新增住房支出换回的通勤时间',
      compute(p,option){const c=p.cost/1200,t=p.hours/5,u=(p.hours*option.usePct)/(5*75);
        return score(this.base,[28*t,-10*c,12*u,18*u,2*u,6*u,-4*c,12*u]);},
      facts(p,option){const annual=p.hours*52,rest=annual*option.usePct/100;
        return {rows:[['每周通勤','8.3小时',`${oneDecimal(8.3-p.hours)}小时`],['月住房增支','¥0',yuan(p.cost)]],
          major:[['每年释放通勤',`${annual.toLocaleString('zh-CN')}小时`],['新增房租',`${yuan(p.cost*12)}/年`]],
          priceLabel:'买回通勤时间',price:explainRatio(hourCost(p.cost*12,p.hours)),
          secondLabel:'买回自主时间',second:explainRatio(hourCost(p.cost*12,p.hours,option.usePct)),
          chart:{label:'每周通勤',a:8.3,b:8.3-p.hours,unit:'小时'},
          summary:'时间增加是否改善心理、健康和关系，取决于真实用途；这里使用原报告分数进行假设性敏感度演示。',
          note:'源文在默认条件下：58.54 → 66.94。网页将节省时间按使用比例作用于原始目标评分，属于模型假设。',
          selfCost:rest};}
    },
    promotion:{
      title:'升职加薪，额外工时划算吗？',short:'加薪与加班',origin:'原报告',kind:'work',
      about:'42岁，家庭月税后收入35,000元；每周工作47小时。',
      weights:'promotion',base:original.promotion.baseline,
      controls:[CONTROL('raise','每月新增税后收入',8000,0,12000,500,'元','相对家庭月税后收入的增量'),CONTROL('hours','每周额外工作',15,0,25,0.5,'小时','未额外折算待命和出差')],
      defaults:{raise:8000,hours:15},
      presets:{direct:{raise:8000,hours:15},negotiated:{raise:5000,hours:6}},
      headline:'新增劳动的边际税后报酬',
      compute(p,option){const h=p.hours,r=p.raise;
        if(option.preset==='negotiated'){
          const hasPlan=r>0||h>0;const q=hasPlan?1:0;
          return score(this.base,[8*q-11*h/6,10*r/5000,7*q-5*h/6,4*q-h,14*r/5000,5*q-9*h/6,2*q-2*h/6,2*q-4*h/6]);
        }
        return score(this.base,[-30*h/15,14*r/8000,-18*h/15,-20*h/15,16*r/8000,-34*h/15,-6*h/15,-25*h/15]);
      },
      facts(p,option){return {rows:[['每周工作','47小时',`${oneDecimal(47+p.hours)}小时`],['月税后家庭收入','¥35,000',yuan(35000+p.raise)]],
        major:[['新增税后收入',`${yuan(p.raise*12)}/年`],['新增工作',`${oneDecimal(p.hours*52)}小时/年`]],
        priceLabel:'每额外工作一小时所得',price:explainRatio(hourCost(p.raise*12,p.hours)),
        secondLabel:'当前方案',second:option.preset==='negotiated'?'协商晋升':'直接晋升',
        chart:{label:'每周工作',a:47,b:47+p.hours,unit:'小时'},
        summary:option.preset==='negotiated'?'协商方案另假设有出差限制和弹性安排；仅减少工时并不能自动保证这些条件兑现。':'加薪是现金收益，但健康、家庭和可持续性存在假设的负向影响。',
        note:'原报告完整案例：当前72.52；直接晋升57.57；协商晋升73.50。调整滑杆后的分数为教学用情景插值，不是因果预测。'};}
    },
    freelance:{
      title:'降低客户集中度，能减少脆弱性吗？',short:'自由职业',origin:'原报告',kind:'risk',
      about:'月净收入25,000元；最大客户占60%，每周工作55小时。',
      weights:'freelance',base:original.freelance.baseline,
      controls:[CONTROL('client','最大客户收入占比',35,10,85,5,'%','集中度下降不等于流失概率下降同样幅度'),CONTROL('hours','每周工作时间',45,30,75,1,'小时','原本每周55小时')],
      defaults:{client:35,hours:45},
      headline:'最大客户的月收入依赖规模',
      compute(p){const t=(55-p.hours)/10,c=(60-p.client)/25,avg=(t+c)/2;
        return score(this.base,[32*t,0,6*avg,8*t,3*c,4*t,19*c,14*avg]);},
      facts(p){const baseShare=25000*0.6,afterShare=25000*p.client/100,delta=afterShare-baseShare;
        return {rows:[['单一最大客户占比','60%',`${p.client}%`],['每周工作','55小时',`${p.hours}小时`]],
          major:[['集中敞口变化',`${delta>=0?'+':'−'}${yuan(Math.abs(delta))}/月`],['每周工作变化',`${p.hours-55>=0?'+':'−'}${Math.abs(p.hours-55)}小时`]],
          priceLabel:'目前最大客户收入份额',price: yuan(afterShare)+'/月',
          secondLabel:'原有最大客户收入份额',second:yuan(baseShare)+'/月',
          chart:{label:'单一客户收入占比',a:60,b:p.client,unit:'%'},
          summary:'只改变集中度与工时，不等于自动解决回款、现金缓冲、保障和定价问题。',
          note:'原报告完整优化方案LVI为52.12→70.06，包含缓冲资金等更多措施；本页只模拟两个可调变量，故不会错误套用全部17.94分收益。'};}
    },
    chores:{
      title:'家务外包，买回时间值得吗？',short:'家务外包',origin:'新增假设',kind:'time',
      about:'假设原来每周做8小时家务，部分转由付费服务完成。',
      weights:'standard',base:[52,70,58,62,65,61,70,60],
      controls:[CONTROL('cost','每月新增服务费',800,0,2400,100,'元','不含额外协调时间和服务质量差异'),CONTROL('hours','每周减少家务时间',4,0,8,0.5,'小时','原本每周8小时')],
      defaults:{cost:800,hours:4},
      headline:'新增费用买回家务时间',
      compute(p,option){const c=p.cost/800,t=p.hours/4,u=t*option.usePct/75;return score(this.base,[14*t,-6*c,4*u,4*u,0,8*u,-c,4*u]);},
      facts(p,option){return {rows:[['每周家务','8小时',`${oneDecimal(8-p.hours)}小时`],['每月服务费','¥0',yuan(p.cost)]],
        major:[['每年释放家务',`${oneDecimal(p.hours*52)}小时`],['年度服务费用',yuan(p.cost*12)]],
        priceLabel:'买回家务时间',price:explainRatio(hourCost(p.cost*12,p.hours)),secondLabel:'买回自主时间',second:explainRatio(hourCost(p.cost*12,p.hours,option.usePct)),
        chart:{label:'每周家务',a:8,b:8-p.hours,unit:'小时'},
        summary:'效果还取决于服务质量、协调成本与节省时间能否被自己支配。',
        note:'八维基线和每单位时间/费用对应的评分敏感度均为本站为教学所设的假设，不是研究实证结果。'};}
    },
    fourday:{
      title:'少上班一天，值多少收入？',short:'缩短工作周',origin:'新增假设',kind:'time',
      about:'假设原来每周工作40小时，降薪换取更少工时。',
      weights:'standard',base:[50,76,56,62,65,63,69,65],
      controls:[CONTROL('cost','每月放弃税后收入',1800,0,6000,100,'元','不包含社保、福利和职业机会变化'),CONTROL('hours','每周减少工时',8,0,20,1,'小时','从每周40小时减少')],
      defaults:{cost:1800,hours:8},
      headline:'每减少一小时工作所放弃的收入',
      compute(p,option){const t=p.hours/8,c=p.cost/1800,u=t*option.usePct/75;return score(this.base,[20*t,-12*c,8*u,8*u,-5*t,6*u,-3*c,4*u]);},
      facts(p,option){return {rows:[['每周工作','40小时',`${40-p.hours}小时`],['每月税后收入减少','¥0',yuan(p.cost)]],
        major:[['年度新增时间',`${p.hours*52}小时`],['年度减少收入',yuan(p.cost*12)]],
        priceLabel:'每小时减少工作对应的收入代价',price:explainRatio(hourCost(p.cost*12,p.hours)),secondLabel:'每自主小时的收入代价',second:explainRatio(hourCost(p.cost*12,p.hours,option.usePct)),
        chart:{label:'每周工作',a:40,b:40-p.hours,unit:'小时'},
        summary:'实际是否可持续仍受岗位、福利、就业稳定性与用工制度约束。',
        note:'本案例为新增假设；工时变化与心理/健康评分的关联是演示系数，不是实测效果。'};}
    },
    learning:{
      title:'花钱进修，回报能够覆盖成本吗？',short:'进修投入',origin:'新增假设',kind:'learning',
      about:'一门12周的课程。成本明确，职业收益要分情景讨论。',
      weights:'standard',base:[64,67,60,65,58,65,70,68],
      controls:[CONTROL('cost','一次性学费',2400,0,8000,200,'元','不含交通和误工'),CONTROL('hours','每周学习投入',5,0,15,1,'小时','持续12周')],
      defaults:{cost:2400,hours:5},
      headline:'每学习一小时对应的学费',
      compute(p,option){const t=p.hours/5,c=p.cost/2400;
        const gain=p.hours>0 ? ({low:0,medium:6,high:12}[option.outcome]||0)*Math.min(t,1.5) : 0;
        return score(this.base,[-9*t,-7*c,2*t,-2*t,gain,-3*t,-1*c,-5*t]);},
      facts(p,option){const duration=p.hours*12;
        return {rows:[['每周学习','0小时',`${p.hours}小时`],['一次性学费','¥0',yuan(p.cost)]],
          major:[['12周学习投入',`${duration}小时`],['一次性学费',yuan(p.cost)]],
          priceLabel:'每学习一小时的学费',price:duration?explainRatio(p.cost/duration):'—',secondLabel:'职业收益情景',second:({low:'暂未取得',medium:'假设部分实现',high:'假设达到预期'})[option.outcome],
          chart:{label:'每周课程学习',a:0,b:p.hours,unit:'小时'},
          summary:'把学习时数变成技能回报没有确定公式。请切换收益情景，观察决策结果是否翻转。',
          note:'职业维度额外分数分别设为0/6/12（随学习时数缩放），只是显式教学假设，不代表平均培训收益。'};}
    },
    subscriptions:{
      title:'关掉闲置自动续费，一年省多少？',short:'关闭自动续费',origin:'原指南条目',kind:'saving',
      source:'https://github.com/eternity4719/HowToLiveBetter/blob/main/book/05-不要浪费钱.md',
      sourceLabel:'原指南第5节第1条：关掉自动续费',
      about:'假设闲置的自动续费每月共180元；关闭前先核对实际需要的服务。',
      weights:'standard',base:[62,54,64,65,58,60,62,62],
      controls:[CONTROL('saved','每月取消的订阅费',90,0,180,10,'元','原有闲置订阅费用180元/月'),CONTROL('audit','每月检查所需时间',0.25,0,2,0.25,'小时','核对服务是否仍需要，避免误取消必要项目')],
      defaults:{saved:90,audit:0.25},
      compute(p){const s=p.saved/90,a=p.audit/0.25;return score(this.base,[-1.5*a,12*s,1*s,0,0,0,1*s,2*s-0.7*a]);},
      facts(p){return {rows:[['每月闲置订阅费','¥180',yuan(180-p.saved)],['每月核对时间','0小时',`${oneDecimal(p.audit)}小时`]],
        priceLabel:'年度少付的订阅费',price:yuan(p.saved*12),secondLabel:'年度核对时间',second:`${oneDecimal(p.audit*12)}小时`,
        summary:'取消不需要的订阅能够直接减少现金支出；维度分数是教学假设，核对时间属于机会成本。',
        note:'取自原指南第5节第1条“关掉所有自动续费，改为到期手动续”。基础评分及金钱、风险、可持续的响应系数由本站设定，不是源项目的实证评分。'};}
    },
    meetings:{
      title:'把部分会议改成异步，真正省下多少时间？',short:'减少低效会议',origin:'原指南条目',kind:'focus',
      source:'https://github.com/eternity4719/HowToLiveBetter/blob/main/book/04-不要浪费时间.md',
      sourceLabel:'原指南第4节第6条：减少会议',
      about:'假设每周原有8小时例会。改成异步沟通，也需要额外阅读和协调时间。',
      weights:'standard',base:[47,66,54,63,67,61,68,58],
      controls:[CONTROL('cut','每周减少会议',2,0,8,0.5,'小时','原来每周8小时会议'),CONTROL('async','每周新增异步协调',0.5,0,5,0.5,'小时','写纪要、阅读文档、确认事项的时间')],
      defaults:{cut:2,async:0.5},
      compute(p){const net=(p.cut-p.async)/1.5;return score(this.base,[14*net,0,3*net,0,2*net,0,0,2*net]);},
      facts(p){const weekly=p.cut-p.async;return {rows:[['每周开会','8小时',`${oneDecimal(8-p.cut)}小时`],['每周新增异步协调','0小时',`${oneDecimal(p.async)}小时`]],
        priceLabel:'每周净释放工作时间',price:`${oneDecimal(weekly)}小时`,secondLabel:'全年净释放工作时间',second:`${oneDecimal(weekly*52)}小时`,
        summary:weekly>0?'异步处理的成本已从减少的会议时间中扣除；释放时间不必然等于额外休息。':weekly<0?'异步协调成本超过减少的会议时间；应重新设计流程。':'净节省时间为零，不能只因少开会就计算收益。',
        note:'取自原指南第4节第6条“砍会议数量，能用文字异步解决的不开会”。八维基线和响应系数由本站假设；沟通质量、信息遗漏风险未被量化。'};}
    },
    sleep:{
      title:'给睡眠多留些时间，生活配置如何改变？',short:'优先保证睡眠',origin:'原指南条目',kind:'recovery',
      source:'https://github.com/eternity4719/HowToLiveBetter/blob/main/book/03-不要浪费精力.md',
      sourceLabel:'原指南第3节第3条：保障睡眠',
      about:'假设目前平均每晚睡6.3小时。从晚间其他活动中腾出时间睡觉。',
      weights:'standard',base:[57,65,52,48,63,60,68,59],
      controls:[CONTROL('extra','计划每晚增加睡眠',0.75,0,1.5,0.25,'小时','实际增加时间因个人习惯而异'),CONTROL('nights','每周计划执行',5,0,7,1,'晚','未执行的夜晚保持原来的睡眠时长')],
      defaults:{extra:0.75,nights:5},
      compute(p){const t=p.extra*p.nights/3.75;return score(this.base,[-5*t,0,3*t,11*t,0,0,0,2*t]);},
      facts(p){const weekly=p.extra*p.nights,avg=6.3+weekly/7;return {rows:[['一周平均每晚睡眠','6.3小时',`${oneDecimal(avg)}小时`],['每周额外睡眠','0小时',`${oneDecimal(weekly)}小时`]],
        priceLabel:'年度额外睡眠时间',price:`${oneDecimal(weekly*52)}小时`,secondLabel:'每晚平均睡眠变化',second:`+${oneDecimal(weekly/7)}小时`,
        summary:'这里重新分配的是现有晚间时间，不是创造新时间；健康和心理维度分数只用于比较假设。',
        note:'取自原指南第3节第3条“每晚睡够7到8小时”。不是睡眠治疗计划或个体医学预测；基线6.3小时及维度增减均为教学假设。'};}
    }
  };
  function evaluate(id,params={},opts={}){
    const spec=CASES[id];if(!spec) throw Error('Unknown case');
    const p={...spec.defaults,...params};
    for(const ctl of spec.controls){if(!Number.isFinite(p[ctl.key]))throw Error('Invalid input: '+ctl.key);p[ctl.key]=clamp(p[ctl.key],ctl.min,ctl.max);}
    const options={priority:'default',usePct:75,preset:'direct',outcome:'medium',...opts};
    options.usePct=clamp(options.usePct,0,100);
    const w=weightFor(id,options.priority);
    const base=spec.base.slice();const after=spec.compute(p,options);
    const baseline=round2(dot(base,w)),proposed=round2(dot(after,w));
    const delta=round2(proposed-baseline);
    const contributions=DIMENSIONS.map((label,i)=>({label,weight:round2(w[i]),before:base[i],after:after[i],impact:round2((after[i]-base[i])*w[i]/100)}));
    const variants=['money','default','time'].map(priority=>({priority,delta:round2(dot(after,weightFor(id,priority))-dot(base,weightFor(id,priority)))}));
    const facts=spec.facts(p,options);
    return {id,params:p,opts:options,description:spec.title,origin:spec.origin,baseline,proposed,delta,
      beforeScores:base,afterScores:after,weights:w,contributions,variants,...facts,
      original:original[id]||null};
  }
  return {DIMENSIONS,WEIGHTS,CASES,original,weightFor,evaluate,dot,hourCost,round2,clamp};
});
