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

client.controller('ListHandlerController', ['$scope', '$http', 'socket', function($scope, $http, socket) {
	$scope.itemlist = [];
	var amount = 10;
	var maxid = 0;
	var minid = 0;

	$http.get("http://vituttaa.paitsiossa.com:3700/posts/0").success(function(response) {
		$scope.itemlist = response;
		for (var x in $scope.itemlist) {
			if ($scope.itemlist[x].id > maxid) {maxid = $scope.itemlist[x].id}
		}
		minid = maxid;
		for (var x in $scope.itemlist) {
			if ($scope.itemlist[x].id < minid) {minid = $scope.itemlist[x].id}
		}
	});
	

	socket.on('post', function(id){
		

		$http.get("http://vituttaa.paitsiossa.com:3700/posts/" + maxid).success(function(response) {
			for (x in response) {
				$scope.itemlist.splice(0,0,response[x])
				if (response[x].id > maxid){maxid = response[x].id;}
			}
		});
	})

	$scope.getdate = function(date) {
		var dat = new Date(date / 1);
		return dat.toLocaleString();
	}

	$scope.scroll = function() {
		var id = minid - 10
		if (id <= 0) {
			return;
		}
		$http.get("http://vituttaa.paitsiossa.com:3700/posts/" + minid).success(function(response) {
			for (x in response) {
				$scope.itemlist.push(response[x])
				if (response[x].id < minid){minid = response[x].id;}
			}
		});
	}

	
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

		$http.post("http://vituttaa.paitsiossa.com:3700/post/", {name: name, post: post}).success(function() {$scope.name = "";$scope.post="";});
	};
	
}]);
