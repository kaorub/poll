'use strict'
var app = angular.module('app', ['ngRoute']);

app
.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when("/question", {
        controller: "MainCtrl",
        templateUrl: "views/question.html"
    })
    .otherwise({
    	redirectTo: "/"
    });
 	// $locationProvider.html5Mode(true);
}])

.factory('getQuestion', ['$http', function($http) {
	var fullObj = {questions: [], startObj: null};
	var initial = function(arr) {
		for (var obj in arr) {
			if (arr[obj].hasOwnProperty('start')) {
				return arr[obj];
			}
		}
	};
	$http.get('JSON/poll-data.json')
	.success(function(data) {
		fullObj.id = data.id;
		fullObj.questions = data.questions;
		fullObj.startObj = initial(data.questions);
	})
	.error(function(data, status) {
		console.log(data);
	});
	return fullObj;
}])

.controller('MainCtrl', function($scope, $route, $location, getQuestion) {
	$scope.$route = $route;
	$scope.$location = $location;
	var arr = getQuestion.startObj;
	$scope.fetch = function() {
		$location.path('/question').replace();
		$scope.title = getQuestion.startObj.title;
		$scope.id = getQuestion.id;
		$scope.questions = getQuestion.questions;
		console.log($scope.id);
		
		// $http({
		// 	method: 'GET',
		// 	url: '/JSON/poll-data.json'
		// })
		// getQuestion().success(function(data, status) {
		// $scope.title = data.title;
		// $scope.id = data.id;
		// 	var questionArray = data.questions;
		// 	questionArray.forEach(function(item, i) {
		// 		if (item.start) {
		// 			$scope.question = item;
		// 			console.log($scope.question);
		// 			return false;
		// 		}
		// 	});
		// 	// $scope.variants = item.variants
		// }).error(function(data, status) {
		// 	$scope.data = data || "Request failed";
		// })
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
.directive("hideDirective", function($compile, getQuestion) {
	var stringTemplate = '<input class="form-control" />',
		checkboxTemplate = '<div class="checkbox" ng-repeat="v in question.variants"><label class="radio-inline"><input type="radio" value="{{v.val}}"/><span> {{v.title}} </span></label></div>',
		radioTemplate = '<div class="radio" ng-repeat="v in question.variants"><label class="radio-inline"><input type="radio" value=""/><span> {{v.title}} </span></label></div>',
		rangeTemplate = '<div class="range" ng-repeat="v in question.variants">{{v}}</div>',
		routerTemplate = '<div class="router" ng-repeat="v in question.variants">{{v}}</div>';
	var list = getQuestion.questions;
	console.log(list);
	// var initialQuestion = getQuestion.startObj.title;
	console.log(getQuestion.startObj);
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
	console.log(getTemplate(getQuestion.startObj));

	return {
		restrict: 'E',
		replace: true,
		template: getTemplate(getQuestion.startObj),
		compile: function compile(templateElement, templateAttrs) {
			templateElement.append(getTemplate);
		},
		link: function($scope, element, attrs) {

		}
	}
})
.directive('goTitle', function($compile, getQuestion) {
	return {
		compile: function compile(templateElement, templateAttrs) {
			templateElement.append('{{title}}');
		},
		link: function($scope, element, attrs) {

		}
	}
})
