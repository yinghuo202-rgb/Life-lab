const assert=require('node:assert/strict');
const M=require('../assets/model.js');
const ids=['commute','promotion','freelance','chores','fourday','learning','subscriptions','meetings','sleep'];
assert.deepEqual(Object.keys(M.CASES),ids);
for(const id of ids){
 const spec=M.CASES[id],r=M.evaluate(id);
 assert.equal(spec.controls.length,2,id);
 assert.ok(Number.isFinite(r.delta),id);
 assert.ok(r.beforeScores.every(x=>x>=0&&x<=100));
 assert.ok(r.afterScores.every(x=>x>=0&&x<=100));
 for(const edge of ['min','max']){
  const params=Object.fromEntries(spec.controls.map(c=>[c.key,c[edge]]));
  const out=M.evaluate(id,params);
  assert.ok(Number.isFinite(out.delta),id);
 }
}
assert.equal(M.evaluate('commute').delta,8.4);
assert.equal(M.evaluate('promotion').delta,-14.95);
assert.equal(M.evaluate('promotion',M.CASES.promotion.presets.negotiated,{preset:'negotiated'}).delta,.98);
assert.equal(M.evaluate('subscriptions',{saved:0,audit:0}).delta,0);
assert.equal(M.evaluate('sleep',{extra:1,nights:0}).delta,0);
assert.ok(M.evaluate('meetings',{cut:1,async:2}).delta<0);
console.log('PASS: 9 cases, original study checkpoints, null action and negative net time.');
