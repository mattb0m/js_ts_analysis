import * as TS from '../modules/ts.js';

document.body.onload = () => {
    let ts1 = new TS.ts();

    for(let i=0; i < 1000000; ++i) {
        ts1.time.push(Date.now());
        ts1.data.push(Math.random());
    }

    let summ = new TS.ts_summary(ts1, [25,50,75,90,95,99]);
    document.getElementById('summary').innerHTML = `
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
p25     = ${summ.p[0]}<br>
p50     = ${summ.p[1]}<br>
p75     = ${summ.p[2]}<br>
p90     = ${summ.p[3]}<br>
p95     = ${summ.p[4]}<br>
p99     = ${summ.p[5]}<br>
`;
}
