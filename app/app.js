'use strict'
var app = angular.module('app', ['ngRoute']);

app

.config(['$routeProvider', function ($routeProvider) {
//TODO CONFIG.static_url
    $routeProvider
    .when("/question", {
        templateUrl: "question.html"
    })
    .when('/', {
    	templateUrl: "/"
    });
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
	// var findById = function(id, arr) {
	// 	for (var i in arr)  {
	// 		if (arr[i].id == id) {
	// 			return arr[i];
	// 		}
	// 	}
	// }
	$http.get('../JSON/poll-data.json')
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
	$scope.choices = {};
	$scope.fetch = function(path) {
		$location.path(path);
		$scope.title = getQuestion.startObj.title;
		// $scope.currentIndex = getQuestion.startObj.id;
		//TODO Clear all
		$scope.id = getQuestion.id;
		$scope.questions = getQuestion.questions;
		$scope.startObj = getQuestion.startObj;
		$scope.type = $scope.startObj.input;
		$scope.currentIndex = getQuestion.startObj.id;
		$scope.nextIndex = getQuestion.startObj.next;
		console.log($scope.currentIndex + ' ' + $scope.nextIndex);
	};

	$scope.next = function() {

		$scope.currentIndex = $scope.nextIndex;
		console.log($scope.currentIndex + ' ' + $scope.nextIndex);
		var arr = getQuestion.questions;
		$scope.currentObj = function() {
			var curObj = null;
			for (var j in arr) {
				if (arr[j].id == $scope.currentIndex) {
					curObj = arr[j];
					return curObj;
				}
			}
			return curObj;
		}();

		console.log($scope.currentObj);
		$scope.startObj = $scope.currentObj;
		$scope.nextIndex = $scope.startObj.next;
		$scope.type = $scope.startObj.input;
		$scope.title = $scope.startObj.title;
		console.log($scope.startObj);
	};
})
.directive('variants', function($compile, getQuestion) {
	var stringTemplate = '<h2>{{title}}</h2><input type="text" class="form-control" ng-model="choiced"/>',
		checkboxTemplate = '<h2>{{title}}</h2><div class="{{startObj.input}}" ng-repeat="v in startObj.variants"><label class="checkbox-inline"><input type="{{startObj.input}}" value="{{v.value}}"/><span> {{v.title}} </span></label></div>',
		radioTemplate = '<h2>{{title}}</h2><div class="{{startObj.input}}" ng-repeat="v in startObj.variants"><label class="radio-inline"><input type="radio" value=""/><span> {{v.title}} </span></label></div>',
		// TODO Bootstrap-slider.js
		rangeTemplate = '<h2>{{title}}</h2><div class="{{startObj.input}}" ng-model="choiced">{{v.title}}</div>',
		routerTemplate = '<h2>{{title}}</h2><div class="{{startObj.input}}" ng-repeat="v in startObj.variants" ng-model="$parent.choiced">{{v.title}}</div>';


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
			case 'router':
				template = routerTemplate;
				break;
			case 'range':
				template = rangeTemplate;
				break;
		}
		return template;
	};
	var str = getTemplate(getQuestion.startObj);

	return {
		compile: function compile(tElement, tAttrs) {
			tElement.append(str);
			console.log("!");
			tAttrs.$observe('currentIndex', function(data) {
				console.log(data);
			}, true);
		},
		// TODO
		link: function(scope, element, attrs) {
			scope.$watch('currentIndex', function() {
				str = getTemplate(scope.startObj);
				console.log(str);
				element.append(str);
				$compile(element)(scope);
			})
		}
	}
})
// .directive('goTitle', function($compile, getQuestion) {
// 	return {
// 		compile: function compile(templateElement, templateAttrs) {
// 			templateElement.append('{{title}}');
// 		},
// 		link: function($scope, element, attrs) {

// 		}
// 	}
// })
