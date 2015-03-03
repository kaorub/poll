'use strict'
var app = angular.module('app', []);

app
.controller('MainCtrl', function($scope, $http) {
	$scope.fetch = function() {

		$http({
			method: 'GET',
			url: '/JSON/poll-data.json'
		}).success(function(data, status) {
			$scope.title = data.title;
			$scope.id = data.id;
			$scope.questions = data.questions;
		}).error(function(data, status) {
			$scope.data = data || "Request failed";
		})
	};
	$scope.setNextIndex = function($scope) {
		$scope.currentIndex = $scope.next;
		return false;
	};
	$scope.isCurrentIndex = function() {
		return $scope.currentIndex;
	};
})
.directive("currentQuestion", function() {
	return {
		restrict: 'C',
		link: function(scope, element, attrs) {
			scope.$watch('textQuestion', function(value) {
				
			});
			element.bind('mousedown', function() {
	        	element.children().children().css('backgroundPosition', lPos);
	      	});
	      	element.bind('mouseup', function() {
	        	element.children().children().css('backgroundPosition', lInit);
	      	});
		}
	}
})
// .directive("rlickate", function() {
// 	return {
// 		restrict: 'E',
// 		link: function(scope, element, attrs) {
// 			var rPos = '',
// 				rInit = '';
// 			scope.$watch('slide', function(value) {
// 				rPos = value.raPosition;
// 				rInit = value.riPosition;
// 			});
// 			element.bind('mousedown', function() {
// 	        	element.children().children().css('backgroundPosition', rPos);
// 	      	});
// 	      	element.bind('mouseup', function() {
// 	        	element.children().children().css('backgroundPosition', rInit);
// 	      	});
// 		}
// 	}
// })
// .directive("linkate", function() {
// 	return {
// 		restrict: 'E',
// 		link: function(scope, element, attrs) {
// 			var wholeText = '';

// 			scope.$watch('slide', function(value) {
// 				wholeText += value.text + ' <a class="link">' + value.textLink + '</a>' + value.textAgain;
// 				console.log(wholeText);
// 				element.children().innerHTML += wholeText;
// 			});

// 		}
// 	}
// })