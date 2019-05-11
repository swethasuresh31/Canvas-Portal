var mysql = require('mysql');

var pool = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'adminuser',
  database: 'canvas',
  multipleStatements: true,
  dateStrings: true
});

// pool.getConnection((err, connection) => {
//   if (err) {
//     if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//       console.error('Database connection was closed.')
//     }
//     if (err.code === 'ER_CON_COUNT_ERROR') {
//       console.error('Database has too many connections.')
//     }
//     if (err.code === 'ECONNREFUSED') {
//       console.error('Database connection was refused.')
//     }
//   }
//   if (connection) {
//     console.log("Connected!");
//     connection.release()
//   }
//   return
// })

module.exports = pool;