let express = require('express');
let router = express.Router();
let mysql = require('mysql');

/* POST a new test */
router.post('/', function(req, res, next) {
    let sql_cx = mysql.createConnection({
        host     : 'localhost',
        user     : 'perf',
        password : 'perf',
        database : 'perf'
    });
    
    let obj = req.body;
    
    if(!(obj.name && (typeof obj.name === 'string') && obj.name.length > 0)) {
        res.status(400);
        res.json({message:"Property $.name required"});
        return;
    }
    
    sql_cx.connect();
    sql_cx.query(`INSERT INTO test (json) VALUES ('${JSON.stringify(obj)}')`, function (err, reslt, fields) {
        if(err) {
            res.status(400);
            res.json({error:`Failed to post new Test: (${err.code}) ${err.sqlMessage}`});
            return;
        }
        
        res.status(201);
        obj.id = reslt.insertId;
        res.json(obj);
    });

    sql_cx.end();
});

module.exports = router;
