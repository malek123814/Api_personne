const sqlite3 = require('sqlite3').verbose();

// Connexion à la base
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connecté à la base SQLite.');
});

// Nouvelle structure avec adresse
db.run(`CREATE TABLE IF NOT EXISTS personnes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  adresse TEXT
)`, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Table personnes prête.");
  }
});

module.exports = db;
db.run(`CREATE TABLE IF NOT EXISTS personnes (
id INTEGER PRIMARY KEY AUTOINCREMENT,
nom TEXT NOT NULL,
adresse TEXT
)`, (err) => {
if (err) {
console.error(err.message);
} else {
// Insertion de données initiales avec adresses
}
});