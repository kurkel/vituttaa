var connection = null;
var orm = require("orm");

function setup(db) {
  var Post  = db.define("post", {
        name      : String,
        post      : String,
        date      : Date
    });
  var Comment  = db.define("comment", {
        comment      : String,
        date         : Date
    });
  Comment.hasOne("post", Post, {
      reverse: "comments"
  })

  Comment.sync();
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
