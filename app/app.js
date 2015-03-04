'use strict'
var app = angular.module('app', ['ngRoute']);

app

.config(function ($routeProvider) {
 
    $routeProvider.when("/question", {
        controller: "MainCtrl",
        templateUrl: "app/views/question.html"
    });
    $routeProvider.otherwise({
    	redirectTo: "/"
    });
 	
})
.factory('startQuestion', ['jsonService', function(jsonService, $http, $scope) {
	var promise = null;
	if (promise) {
		return promise
	}
	else {
		promise = $http.get('JSON/poll-data.json');
		promise.forEach(function(item, i) {
			if (item.start) {
				return item;
			}
			else return false;
		})
	}
}])
.controller('MainCtrl', function($scope, $http, $route, $location, question) {
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.question = {};
	$location.path('/');
	$scope.fetch = function() {
		$location.path('/question').replace();
		// TODO parseJSON
		// $http({
		// 	method: 'GET',
		// 	url: '/JSON/poll-data.json'
		// })
		question().success(function(data, status) {
			$scope.title = data.title;
			$scope.id = data.id;
			var questionArray = data.questions;
			questionArray.forEach(function(item, i) {
				if (item.start) {
					$scope.question = item;
					console.log($scope.question);
					return false;
				}
			});
			// $scope.variants = item.variants
		}).error(function(data, status) {
			$scope.data = data || "Request failed";
		})
	};
	$scope.setNextIndex = function() {
		$scope.currentIndex = $scope.next;
		// $location.path('/question').replace();
		// $scope.$apply();
		
		return false;
	};
	$scope.isCurrentIndex = function() {
		return $scope.currentIndex;
	};
})
.directive("hideDirective", ['jsonService', function($compile) {
	var stringTemplate = '<input class="form-control" />',
		checkboxTemplate = '<div class="checkbox" ng-repeat="v in question.variants"><label class="radio-inline"><input type="radio" value="{{v.val}}"/><span> {{v.title}} </span></label></div>',
		radioTemplate = '<div class="radio" ng-repeat="v in question.variants"><label class="radio-inline"><input type="radio" value=""/><span> {{v.title}} </span></label></div>',
		rangeTemplate = '<div class="range" ng-repeat="v in question.variants">{{v}}</div>',
		routerTemplate = '<div class="router" ng-repeat="v in question.variants">{{v}}</div>';
	var getTemplate = function(q) {
		var template='';
		switch (q.input) {
			case 'radio':
				template = radioTemplate;
				break;
			case 'checkbox':
				template = checkboxTemplate;
				break;
			case 'string':
				template = stringTemplate;
				break;
		}
		return template;
	};
	var getAnswers = function($scope, element, attrs) {
		var template = getTemplate(question());
		var linked = $compile(template);
		var content = linked($scope);
		element.append(content);
	}
	return {
		restrict: 'E',
		replace: true,
		link: getAnswers()
		// link: function($scope, element, attrs) {
		// 		console.log(element);
		// 	// scope.$watch('question', function(question) {
		// 		element.html(getTemplate($scope.question));
		// 	// });
		// 	// element.html(getTemplate(scope.question.input ? scope.question.input : 'input')).show();
		// 	// $compile(element)(scope);
		// }
	}
}])
