var client = angular.module('client',[]);

client.controller('ListHandlerController', ['$scope', '$http', function($scope, $http) {
	$scope.itemlist = [];
	var amount = 10;

	$http.get("http://vituttaa.paitsiossa.com/posts/0").success(function(response) {$scope.itemlist = response;console.log($scope.itemlist);});


	var connection = new WebSocket('ws://paitsiossa.com:8765');

	connection.onmessage = function (e) {
		console.log("lol it works");
	}
}]);