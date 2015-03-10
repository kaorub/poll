(function() {
	'use strict'
	
function startsWithPosition() {
	return function(items) {
		return items.filter(function(item) {
			return 'orderBy'
		});
	};
};

function MainCtrl ($scope, $route, $location, $filter, getQuestion) {
	$scope.$route = $route;
	$scope.results = {};
	$scope.results.answers = [];
	$scope.$location = $location;
	// Initialize questionnare
	$scope.fetch = function(path) {
		$location.path(path);
		// $scope.title = getQuestion.startObj.title;
		//TODO Clear all
		$scope.id = getQuestion.id;
		$scope.results.id = $scope.id;
		// Array of all the questions
		$scope.questions = getQuestion.questions;
		// Start question
		$scope.startObj = getQuestion.startObj;
		// The very start question's type
		$scope.type = $scope.startObj.input;
		// Variants of answer
		$scope.variants = $scope.startObj.variants;
		// Init start and second question's index
		$scope.currentIndex = getQuestion.startObj.id;
		$scope.nextIndex = getQuestion.startObj.next;
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

.filter('startsWithPosition', startsWithPosition)

.factory('getQuestion', ['$http', function getQuestion($http) {

	var fullObj = {questions: [], startObj: null};

	var initial = function(arr) {
		for (var obj in arr) {
			if (arr[obj].hasOwnProperty('start')) {
				return arr[obj];
			}
		}
	};

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

.controller('MainCtrl', MainCtrl)
.directive('variants', function($compile, getQuestion) {
	var tmp = 'position';
	var checkboxTemplate = '<h2>{{startObj.title}}</h2><div class="{{startObj.input}}" ng-repeat="v in variants | orderBy "><label class="checkbox-inline"><input type="{{startObj.input}}" ng-click="checkAnswer(type, v)" value="{{v.value}}"/><span> {{v.title}} </span></label></div>',
		stringTemplate = '<h2>{{startObj.title}}</h2><div class="col-sm-10"><input type="{{startObj.input}}" name="input" ng-model="value" required ></div>',
		radioTemplate = '<h2>{{startObj.title}}</h2><div class="{{startObj.input}}" ng-repeat="v in variants" ng-init="order(variants.position);"><label class="radio-inline"><input type="radio" ng-click="checkAnswer(type, v);" value="{{v.value}}"/><span> {{v.title}} </span></label></div>',
		rangeTemplate = '<h2>{{startObj.title}}</h2><div class="{{startObj.input}}"><slider class={{startObj.input}} min="{{startObj.min}} max="startObj.max" value="startObj.value">{{v.title}}</slider></div>',
		routerTemplate = '<h2>{{startObj.title}}</h2><div class="{{startObj.input}}" ng-repeat="v in variants ' + '| orderBy: "v.position"' + '"><label class="router-inline"><input type="radio" ng-click="checkAnswer(type, v);" value="{{v.value}};"/><span> {{v.title}} </span></label></div>';
	var templateItem = function(elem, attrs) {
		return '<h2>{{startObj.title}}</h2>' + '<div class="{{startObj.input}}"' + 'ng-repeat="v in variants | ' + 'orderBy: "v.position"' + '"><label class="checkbox-inline"><input type="{{startObj.input}}" ng-click="checkAnswer(type, v)" value="{{v.value}}"/><span> {{v.title}} </span></label></div>'
	}
	var getTemplate = function(q) {
		var template='';
		console.log(q.input);
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
			console.log("compile runs");
			tAttrs.$observe('currentIndex', function(data) {
				console.log(data);
			}, true);
		},
		// TODO
		link: function(scope, element, attrs) {
			scope.$watch('currentIndex', function() {
				str = getTemplate(scope.startObj);
				console.log('link runs' + str);

				element.append(str);
				$compile(element)(scope);
			})
		}
	}
})
})();