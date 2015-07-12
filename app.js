var express = require("express");
var app = express();
var orm = require("orm");
var port = 80;

console.log("Listening on port " + port);


var database = require('./database');

app.use(function (req, res, next) {
  database(function (err, db) {
    if (err) return res.send(500, "cannot connect ot database");

    req.db = db;
    req.models = db.models;

    next();
  });
});

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use('/static', express.static(__dirname  + '/static'));

var options = {
    root: __dirname + '/templates/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

app.get("/", function(req, res, next){
    res.sendFile('/index.html', options);
});

app.get("/posts/:postid", function(req, res) {
        req.db.models.post.find({id: orm.gt(req.params.postid)}, ["date", "Z"], 10, function(err, posts) {
            res.json(posts);
        });
});

app.get("/comments/:postid", function(req, res) {
        req.db.models.comment.find({post_id: req.params.postid}, ["date", "A"], function(err, comments) {
            res.json(comments);
        });
});

app.get("/posts_old/:postid", function(req, res) {
        req.db.models.post.find({id: orm.lt(req.params.postid)}, ["date", "Z"], 10, function(err, posts) {
            res.json(posts);
        });
});

app.post("/post/", function(req,res, next) {
    req.db.models.post.create([{
        name: req.body.name,
        post: req.body.post,
        date: Date.now()
    }], function(err, items) {
        if(err) {console.log(err)};
        var id = req.db.models.post.aggregate().max('id').get(function (err, max) {
        if(err) {console.log(err);return;}
        io.sockets.emit('post', {id:max});
    })
    });


    res.sendStatus(200);
});
    
app.post("/comment/:postid", function(req, res) {
    req.db.models.comment.create([{
        comment: req.body.comment,
        date: Date.now(),
        post: req.params.postid
    }], function(err, items) {
        if(err) {console.log(err);}
        io.sockets.emit('comment', {post_id:items[0].post_id, comment: items[0].comment, date: items[0].date});
    });
    res.sendStatus(200);

});

var io = require('socket.io').listen(app.listen(port));
