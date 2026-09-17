const fs = require('fs');
const path = require('path');

module.exports = (db) => {
  // Check if Equipment table exists
  const exists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Equipment';").get();
  if (!exists) {
    console.log('🔧 Initializing SQLite database with seed data...');
    const sql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf-8');
    db.exec(sql);
  } else {
    console.log('✅ Database already initialized.');
  }
};
