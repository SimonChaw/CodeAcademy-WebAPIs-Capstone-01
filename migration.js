const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

db.serialize(() => {
  db.run('DROP TABLE IF EXISTS Artist', error => {
  if (error) {
    throw error;
  }
	});
  db.run('DROP TABLE IF EXISTS Series', error => {
  if (error) {
    throw error;
  }
	});
  db.run('DROP TABLE IF EXISTS Issue', error => {
  if (error) {
    throw error;
  }
	});
  db.run('CREATE TABLE IF NOT EXISTS Artist(id INTEGER PRIMARY KEY, name TEXT REQUIRED NOT NULL, date_of_birth TEXT REQUIRED NOT NULL, biography TEXT REQUIRED NOT NULL, is_currently_employed INTEGER DEFAULT 1)');
  db.run('CREATE TABLE IF NOT EXISTS Series(id INTEGER PRIMARY KEY, name TEXT REQUIRED NOT NULL, description TEXT REQUIRED NOT NULL)');
  db.run('CREATE TABLE IF NOT EXISTS Issue(id INTEGER PRIMARY KEY, name TEXT REQUIRED NOT NULL, issue_number TEXT REQUIRED NOT NULL, publication_date TEXT REQUIRED NOT NULL, artist_id INTEGER REQUIRED NOT NULL, series_id INTEGER REQUIRED NOT NULL, FOREIGN KEY (artist_id) REFERENCES Artist(id), FOREIGN KEY (series_id) REFERENCES Series(id) )');
});
