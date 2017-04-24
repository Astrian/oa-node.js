var mysql = require('mysql');
var debug = require('debug')('oa:moudle/db')
var connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'oa',
  charset: 'utf8mb4_unicode_ci'
});
exports.exec = function (sql, back) {
  connection.getConnection(function (err, connection) {
    connection.query(sql, function (err, results, fields) {
      back(err, results);
      connection.release();
    });
  });
}