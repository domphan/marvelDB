var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_phando',
  password        : '7900',
  database        : 'cs290_phando'
});

module.exports.pool = pool;
