import * as TS from '../modules/ts.js';

document.body.onload = () => {
    let ts1 = new TS.ts('Random Data Set');

    for(let i=0; i < 1000000; ++i) {
        ts1.time.push(Date.now());
        ts1.data.push(Math.random());
    }

    let summ = new TS.ts_summary(ts1, [25,50,75,90,95,99]);
    document.getElementById('summary').innerHTML = `
${ts1.name}
---------------------------------------------------
Count   = ${summ.count}<br>
Elapsed = ${summ.elapsed}<br>
Sum     = ${summ.sum}<br>
Min     = ${summ.min}<br>
Max     = ${summ.max}<br>
Mean    = ${summ.mean}<br>
Var     = ${summ.variance}<br>
Stdev   = ${summ.stdev}<br>
IQR     = ${summ.iqr.value}<br>
IQR box = [${summ.iqr.min}, ${summ.iqr.max}]<br>
p25     = ${summ.p[25]}<br>
p50     = ${summ.p[50]}<br>
p75     = ${summ.p[75]}<br>
p90     = ${summ.p[90]}<br>
p95     = ${summ.p[95]}<br>
p99     = ${summ.p[99]}<br>
`;
}
