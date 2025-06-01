const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'srv1924.hstgr.io',
      port: 3306,
      user: 'u274988421_admin',
      password: 'TP#b)d3BN5oY0SxoKByg*tG(',
      database: 'u274988421_pianotiles'
    });

    console.log('Successfully connected to the database');
    await connection.end();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

testConnection(); 