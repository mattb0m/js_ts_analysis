import {TsSummary} from './ts.js';

export class PerfCriterion {
    series;  /* series id */
    measure; /* measure to eval on the series */
    op;      /* <, >, <=, >=, ==, != */
    val;     /* specified value */
    
    constructor(series, measure, op, val) {
        this.series = series;
        this.measure = measure;
        this.op = op;
        this.val = val;
    }
    
    get series() {
        return series;
    }
    
    get measure() {
        return measure;
    }
    
    /* evaluate criterion against a TsSummary */
    evaluate(tss) {
        if(!(tss instanceof TsSummary))
            throw new TypeError('Can only eval criterion against "TsSummary"');
        
        let m = tss.get_measure(this.measure);
        if(isNaN(m))
            return false;
        
        switch(this.op) {
        case '<':
            return m<this.val;
        case '>':
            return m>this.val;
        case '<=':
            return m<=this.val;
        case '>=':
            return m>=this.val;
        case '==':
            return m==this.val;
        case '!=':
            return m!=this.val;
        default:
            return false;
        }
    }
    
    toString() {
        return `${this.measure} ${this.op} ${this.val}`;
    }
}

export class PerfSpec {
    criteria = new Map();
    
    constructor(){}
    
    add(c) {
        if(c instanceof PerfCriterion) {
            if(!this.criteria.has(c.series))
                this.criteria.set(c.series, []);
            this.criteria.get(c.series).push(c);
            
        } else
            throw new TypeError('Can only add criteria of type "PerfCriterion"');
    }
    
    get_criterion(name) {
        if(this.criteria.has(name))
            return this.criteria.get(name);
        else
            return [];
    }
    
    evaluate(tss, then) {
        let retval = true;
        
        if(!(tss instanceof TsSummary))
            throw new TypeError('Can only eval criterion against "TsSummary"');
        
        let res = [], success;
        
        for(const criterion of this.get_criterion(tss.name)) {
            success = criterion.evaluate(tss);
            retval &&= success;
            res.push([criterion.toString(), success]);
        }
        
        if(then) then(retval,res);
        
        return retval;
    }
}
