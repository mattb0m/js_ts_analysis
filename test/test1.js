import * as TS from '../modules/ts.js';

let ts1 = new TS.ts();

for(let i=0; i < 1000000; ++i) {
    ts1.time.push(Date.now());
    ts1.data.push(Math.random());
}

console.log(new TS.ts_summary(ts1, [25,50,75,90,95,99]));
