/*
By kurkel

Kaupasta saa purkkaa, täältä saa purkkaöverit

Quality software sponsored by Jenkki
*/


var client = angular.module('client',['ngAnimate', 'infinite-scroll']);


client.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

client.controller('ListHandlerController', ['$scope', '$rootScope', '$http', 'socket', function ($scope, $rootScope, $http, socket) {
    $scope.itemlist = [];
    var maxid = 0;
    var minid = 0;

    $http.get("http://vituttaa.paitsiossa.com:3000/posts/0").success(function(response) {
        
        for (var x in response) {
            if (response[x].id > maxid) {maxid = response[x].id;}
        }
        $scope.itemlist = response;
        minid = maxid;
        for (var x in $scope.itemlist) {
            if ($scope.itemlist[x].id < minid) {minid = $scope.itemlist[x].id}
        }
    });
    

    socket.on('post', function(id){
        $http.get("http://vituttaa.paitsiossa.com:3000/posts/" + maxid).success(function(response) {
            console.log(response);
            for (x in response) {
                $scope.itemlist.splice(0,0,response[x])
                if (response[x].id > maxid){maxid = response[x].id;}
            }
            console.log($scope.itemlist);
        });
    });

    $scope.getdate = function(date) {
        var dat = new Date(date / 1); //my favourite flavor of bubblegum
        return dat.toLocaleString();
    }

    $scope.scroll = function() {
        var id = minid - 10
        if (id <= 0) {
            return;
        }
        $http.get("http://vituttaa.paitsiossa.com:3000/posts_old/" + id).success(function(response) {
            for (x in response) {
                $scope.itemlist.push(response[x])
                if (response[x].id << minid){minid = response[x].id;}
            }
        });
    }
    
}]);


client.controller('CommentController', ['$scope', '$http','socket', function($scope, $http, socket) {
    $scope.comments = [];

    $scope.active = !$scope.active;

    $scope.updated = false;

    $scope.init = function(id) {
        $scope.postid = id;
        $http.get("http://vituttaa.paitsiossa.com:3000/comments/" + id).success(function(response) {
                    $scope.comments = response;
                });

    }

    $scope.getdate = function(date) {
        var dat = new Date(date / 1); //my favourite flavor of bubblegum
        return dat.toLocaleString();
    }

    $scope.get_comments = function(id) {
        $scope.active = !$scope.active;

        if (!$scope.active) { 
            if ($scope.comments.length === 0 || !$scope.updated) {
                $scope.updated = true;
                $http.get("http://vituttaa.paitsiossa.com:3000/comments/" + id).success(function(response) {
                        $scope.comments = response;
                });
            }
        }
    }

    socket.on('comment', function(comment) {
        if ($scope.postid === comment.post_id) {
            $scope.comments.push(comment);
        }
        //$scope.itemlist.move(0, x);
    });

    $scope.submit_comment = function(id) {     
        if($scope.comment === "") {
            return;
        }
        $http.post("http://vituttaa.paitsiossa.com:3000/comment/" + id, {comment: $scope.comment}).success(function() {$scope.comment = "";});
    };
}]);

client.controller('FormController', ['$scope', '$http', function($scope, $http) {
    $scope.name = "";
    $scope.post = "";


    $scope.submit = function() {
        var name, post;
        name = $scope.name;
        post = $scope.post;

        if(name === "" && post === "") {
            return;
        }
        else if(name === "") {
            name = "Anoyoynynmmous"; 
        }

        else if(post === "") {
            post = "Ei vituttanu sittenkää"
        }

        $http.post("http://vituttaa.paitsiossa.com:3000/post/", {name: name, post: post}).success(function() {$scope.name = "";$scope.post="";});
    };
    
}]);
