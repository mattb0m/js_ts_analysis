'using strict';

export class TimeSeries {
    name;
    time;
    data;
    
    constructor(name, time, data) {
        this.name = name;
        time ? this.time = time : this.time = [];
        data ? this.data = data : this.data = [];
    }
}

/* percentiles computed by NIST method. copies ts data to sort. */
export class TsSummary {
    name;
    sum = 0;
    min;
    max;
    mean = 0;
    count;
    elapsed;
    variance;
    stdev;
    p = [];
    iqr = {value:0, min:0, max:0}
    static simple_stats = ['sum','min','max','mean','count','variance','stdev'];
    
    constructor(ts, percentiles) {
        let data=ts.data.slice();
        const len=data.length;
        
        this.name = ts.name;
        
        /* sort to calculate percentiles */
        if(percentiles) {
            data.sort((x,y)=>(x-y));
            
            percentiles.forEach((percentile) => {
                let p = percentile/100*(len+1);
                let p_k = p|0;
                let p_d = p%1;
                
                if(p_k === 0)
                    p = data[0];
                else if(p_k >= len)
                    p = data[len-1];
                else
                    p = data[p_k] + p_d*(data[p_k+1] - data[p_k]);
                
                this.p[percentile] = p;
            });

            /* automatic IQR stats */
            const q1 = this.p[25], q3 = this.p[75];
            
            if(q1 && q3) {
                this.iqr.value = q3-q1; 
                this.iqr.min = q1-1.5*this.iqr.value; 
                this.iqr.max = q3+1.5*this.iqr.value; 
            }
        }
        
        this.min = data[0];
        this.max = data[0];
        
        /* calculate variance by Welford's method */
        let m2 = 0;
        
        for(let i=0, delta; i<len; ++i) {
            let dat = data[i];
            this.sum += dat;
            if(dat < this.min) this.min = dat;
            if(dat > this.max) this.max = dat;
            
            delta = dat-this.mean;
            this.mean = (dat + this.mean*i)/(i+1);
            m2 += delta*(dat-this.mean);
        }
        
        this.count = len;
        this.elapsed = ts.time[len-1] - ts.time[0];
        this.variance = m2/len;
        this.stdev = Math.sqrt(this.variance);
    }
    
    /* return computed stat, whose name is passed as a string */
    get_measure(str) {
        if(TsSummary.simple_stats.includes(str))
            return this[str];
        else if(/p\[\d+\]/.test(str))
            return this.p[/p\[(\d+)\]/.exec(str)[1]];
        else if(str == 'iqr')
            return this.iqr.value;
    }
}
