
var sql=require('mysql2');
var mysql=sql.createConnection({
    host:'localhost',
    port:3306,
    user:'root',
    password:'',
    database:'nimbus'
});
modules.export=mysql;