(function() {
	'use strict'
/** 
 * @name startsWithPosition
 * @desc Main application filtering NOT finished
 */
function startsWithPosition() {
	return function(items) {
		return items.filter(function(item) {
			return 'orderBy'
		});
	};
};
/** 
 * @name QuestionService
 * @desc Main application Service
 */
function QuestionService($resource) {
	var QuestionService = {};
	QuestionService.questions = [];
	QuestionService.startObj = null;

	var initial = function(arr) {
		for (var obj in arr) {
			if (arr[obj].hasOwnProperty('start')) {
				return arr[obj];
			}
		}
	};

	$resource.get('../JSON/poll-data.json')
	.success(function(data) {
		QuestionService.id = data.id;
		QuestionService.questions = data.questions;
		QuestionService.startObj = initial(data.questions);
	})
	.error(function(data, status) {
		console.log(data);
	});
	console.log(QuestionService);
	return QuestionService;
};

function MainCtrl ($scope, $route, $location, $filter, QuestionService) {
	$scope.$route = $route;
	$scope.results = {};
	$scope.results.answers = [];
	$scope.$location = $location;
	// Initialize questionnare
	$scope.fetch = function(path) {
		$location.path(path);
		// $scope.title = getQuestion.startObj.title;
		//TODO Clear all
		$scope.id = QuestionService.id;
		$scope.results.id = $scope.id;
		// Array of all the questions
		$scope.questions = QuestionService.questions;
		// Start question
		$scope.startObj = QuestionService.startObj;
		// The very start question's type
		$scope.type = $scope.startObj.input;
		// Variants of answer
		$scope.variants = $scope.startObj.variants;
		// Init start and second question's index
		$scope.currentIndex = QuestionService.startObj.id;
		$scope.nextIndex = QuestionService.startObj.next;
	};
	// TODO function for ordering depends on position
	// $scope.order = function(predicate) {
	// 	$scope.variants = orderBy($scope.variants, predicate);
	// };
	$scope.next = function() {
		$scope.results.answers.push({id: $scope.currentIndex, value: $scope.value});
		$scope.currentIndex = $scope.nextIndex;
		// console.log('currentIndex after lick next button' + $scope.currentIndex);
		var arr = $scope.questions;

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

		if ($scope.currentObj.hasOwnProperty('finish')) {
			$location.path('/result');
		}

		$scope.type = $scope.startObj.input;
		$scope.startObj = $scope.currentObj;
		$scope.nextIndex = $scope.startObj.next;
		$scope.variants = $scope.startObj.variants;
		if ($scope.type == 'checkbox') $scope.value = []
			else $scope.value = '';
	};
	$scope.checkAnswer = function(type, answer) {

		$scope.type = $scope.startObj.input;
		if ($scope.type == 'router') {
			$scope.nextIndex = answer.next;
			$scope.value = answer.value;
			return;
		}

		if (type == 'checkbox') {
			$scope.value.push(answer.value);
		} else {
			$scope.value = answer.value;
		}
	}
};

function config($routeProvider) {
//TODO CONFIG.static_url
    $routeProvider
    .when("/question", {
        templateUrl: "question.html"
    })
    .when('/', {
    	templateUrl: "/"
    })
    .when('/result', {
    	templateUrl: "result.html"
    })
    .otherwise({
    	templateUrl: "poll.html"
    })
};

angular
.module('app', ['ngRoute'])
.config(config)

// .filter('startsWithPosition', startsWithPosition)

.service('QuestionService', ['$http', QuestionService])

.controller('MainCtrl', MainCtrl)

.directive('variants', function($compile, QuestionService) {
	var templateItem = function(obj) {
		var objType = obj.input + '-inline';
		return '<h2>' + obj.title + '</h2><div class="' + obj.input + '" ng-repeat="v in variants"><label ' + "orderBy: '-position'" + '"><input type="' + obj.input + '" ng-click="checkAnswer(type, v)" value="{{v.value}}"/>{{v.title}}</label></div>'
	};
	var str = templateItem(QuestionService.startObj)
	return {
		compile: function compile(tElement, tAttrs) {
			tElement.append(str);
			console.log("compile runs");
			tAttrs.$observe('currentIndex', function(data) {
				console.log(data);
			}, true);
		},
		// TODO
		link: function(scope, element, attrs) {
			scope.$watch('currentIndex', function() {
				// str = getTemplate(scope.startObj);
				str = templateItem(scope.startObj)
				console.log('link runs' + str);

				element.append(str);
				$compile(element)(scope);
			})
		}
		// template: templateItem
	}
})
})();