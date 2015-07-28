Students = new Mongo.Collection("students");

if(Meteor.isClient) {
	angular.module("StudentsList", ["angular-meteor"])
		.controller("StudentListCtrl", ["$scope", "$meteor",
			function ($scope, $meteor) {
				$scope.students = $meteor.collection(Students);
				$scope.isEdit = false;
				$scope.isFocus = false;
				$scope.indexOfStudent = null;
				$scope.orderByField = 'name';
				$scope.reverseSort = false;

				$scope.save = function () {
					if (!$scope.isEdit) {
						$scope.students.push({
							checked: false,
							name: $scope.student.name,
							surname: $scope.student.surname,
							date_of_birth: $scope.student.date_of_birth,
							group: $scope.student.group,
						});
					}
					else {
						$scope.students[$scope.indexOfStudent].checked = false;
						$scope.students[$scope.indexOfStudent].name = $scope.student.name;
						$scope.students[$scope.indexOfStudent].surname = $scope.student.surname;
						$scope.students[$scope.indexOfStudent].date_of_birth = $scope.student.date_of_birth;
						$scope.students[$scope.indexOfStudent].group = $scope.student.group;

						$scope.isEdit = false;
						$scope.indexOfStudent = null;
					}

					$scope.student.name = "";
					$scope.student.surname = "";
					$scope.student.date_of_birth = "";
					$scope.student.group = "";

					$scope.uForm.$setPristine();
				};

				$scope.reset = function () {
					$scope.student.name = "";
					$scope.student.surname = "";
					$scope.student.date_of_birth = "";
					$scope.student.group = "";

					$scope.uForm.$setPristine();
					$scope.isEdit = false;
					$scope.indexOfStudent = null;
				};

				$scope.remove = function () {
					for (var i = 0; i < $scope.students.length; ++i) {
						if ($scope.students[i].checked) {
							$scope.students.splice($scope.students.indexOf($scope.students[i]), 1);
							--i;//slice(indexOf(x, 1) removes i-th element and automatically changes array,
						}//next element takes index i, so we have to do --i to get proper sequence for checking all elements.
					}
				};

				$scope.removeAll = function () {
					$scope.students.remove();
				};

				$scope.calculateAge = function (birthday) {
					var ageDifMs = Date.now() - birthday.getTime();
					var ageDate = new Date(ageDifMs);
					return Math.abs(ageDate.getUTCFullYear() - 1970);
				};

				$scope.edit = function (student) {
					$scope.isEdit = true;
					$scope.isFocus = true;
					$scope.indexOfStudent = $scope.students.indexOf(student);

					$scope.student.name = student.name;
					$scope.student.surname = student.surname;
					$scope.student.date_of_birth = student.date_of_birth;
					$scope.student.group = student.group;
				};

				$scope.loseFocus = function () {
					$scope.isFocus = false;
				};

				$scope.checked = function($event, description) {
					$event.stopPropagation();
				};

				$scope.rowClicked = function (student) {
					$scope.index = $scope.students.indexOf(student);
					if(!$scope.students[$scope.index].checked){
						$scope.students[$scope.index].checked = true;
					}
					else {
						$scope.students[$scope.index].checked = false;
					}
				};
			}
		])
		.directive("ngFocus", function ($timeout) {
			return {
				link: function (scope, element, attrs) {
					scope.$watch(attrs.ngFocus, function (val) {
						if (angular.isDefined(val) && val) {
							$timeout(function () {
								element[0].focus();
							});
						}
					}, true);

					element.bind("blur", function () {
						if (angular.isDefined(attrs.ngFocusLost)) {
							scope.$apply(attrs.ngFocusLost);
						}
					});
				}
			};
		})
}