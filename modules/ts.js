'using strict';

export class ts {
    constructor(time, data) {
        time ? this.time = time : this.time = [];
        data ? this.data = data : this.data = [];
    }
}

/* percentiles computed by NIST method. copies ts data to sort. */
export class ts_summary {
    constructor(ts, percentiles) {
        let i, data=ts.data.slice(), len=data.length;
        
        /* sort to calculate percentiles */
        if(percentiles) {
            data.sort((x,y)=>(x-y));
            let p_len, p, p_k, p_d;
            this.p = [];
            
            for(i=0, p_len = percentiles.length; i<p_len; ++i) {
                p = percentiles[i]/100*(len+1);
                p_k = p|0;
                p_d = p%1;
                
                if(p_k === 0)
                    p = data[0];
                else if(p_k >= len)
                    p = data[len-1];
                else
                    p = data[p_k] + p_d*(data[p_k+1] - data[p_k]);
                
                this.p.push([percentiles[i],p]);
            }
        }
        
        this.sum = 0;
        this.min = data[0];
        this.max = data[0];
        this.mean = 0;
        
        for(i=0; i<len; ++i) {
            this.sum += data[i];
            if(data[i] < this.min) this.min = data[i];
            if(data[i] > this.max) this.max = data[i];
            this.mean = (data[i] + this.mean*i)/(i+1);
        }
        
        this.count = len;
        this.elapsed = ts.time[len-1] - ts.time[0];
    }
}
