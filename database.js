var connection = null;
var orm = require("orm");

function setup(db) {
  var Post  = db.define("post", {
        name      : String,
        post      : String,
        date      : Date
    });
}

module.exports = function (cb) {
  if (connection) return connection;

  orm.connect("sqlite:///home/kurkel/test2.db?debug=true", function (err, db) {
    if (err) return cb(err);

    connections = db;
    setup(db);

    cb(null, db);
  });  
};
