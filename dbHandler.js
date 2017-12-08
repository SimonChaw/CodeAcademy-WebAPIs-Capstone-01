const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

let artists = {};

const getArtists = () => {
  db.all("SELECT * FROM Artist WHERE is_currently_employed = 1", (err, data) => {
    if(err){
      throw err;
    }
     artists = {artists : data};
  });
};

const getElementById = (array, id) => {
  for (var i = 0; i < array.length; i++) {
    console.log(array[i]);
    if(array[i].id === id){
      return array[i];
    }
  }
};

const dbHandler = {
  refresh : function(){
    getArtists();
  },
  get: function(type) {
    if(type === 'artists'){
      return artists;
    }
  }
};

module.exports = dbHandler;
