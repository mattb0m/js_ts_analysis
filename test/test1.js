import * as TS from '../modules/ts.js';
import * as Perf from '../modules/perf_eval.js';

document.body.onload = () => {
    let ts1 = new TS.TimeSeries('Random Data Set');

    for(let i=0; i < 100000; ++i) {
        ts1.time.push(Date.now());
        ts1.data.push(Math.random());
    }

    let summ = new TS.TsSummary(ts1, [25,50,75,90,95,99]);
    document.getElementById('summary').innerHTML = `
${ts1.name}
---------------------------------------------------
Count   = ${summ.count}<br>
Elapsed = ${summ.elapsed} ms<br>
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
===================================================
`;

    let spec = new Perf.PerfSpec();
    spec.add(new Perf.PerfCriterion('Random Data Set', 'mean', '<', 1));
    spec.add(new Perf.PerfCriterion('Random Data Set', 'p[25]', '<', 0.3));
    spec.add(new Perf.PerfCriterion('Random Data Set', 'p[90]', '!=', 1.5));
    spec.add(new Perf.PerfCriterion('Random Data Set', 'p[90]', '==', 1.5));
    spec.evaluate(summ, (pass,res) => {
        document.getElementById('test').innerHTML = `
Test Results
---------------------------------------------------
"${res[0][0]}" : ${res[0][1]}
"${res[1][0]}" : ${res[1][1]}
"${res[2][0]}" : ${res[2][1]}
"${res[3][0]}" : ${res[3][1]}
---------------------------------------------------
Global result: ${pass}
`;
    });
}
