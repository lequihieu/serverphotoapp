var mysql=require('mysql');
var connection=mysql.createPool({
 
    host:'localhost',
    user:'root',
    password:'Ridaica123',
    database:'testdb'
 
});
module.exports=connection;