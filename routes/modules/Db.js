var mysql = require('mysql');
var connection = mysql.createPool({
    host: 'localhost',
    user: 'vg',
    password: 'RaJA9iGntddJtG,Z)mWhwwLUz8DFuJpMoh7rJgNT{qpBNa7ims{rzLW6nM3b9ruU',
    database: 'vg',
    charset: 'utf8mb4_unicode_ci'
});

exports.exec = function(sql, back) {
    connection.getConnection(function(err, connection) {
        connection.query(sql, function(err, results, fields) {
            back(err, results);
            connection.release();
        });
    });
}