"use strict";

app.controller("menuCTRL", function ($scope, $route, authFactory, dataFactory) {

	$scope.userMetaDataEntries = [];

	$scope.getUserMetaDataForSearch = function(){
		dataFactory.getUserMetaData(authFactory.getUser())
		.then((response) => {
			let object = response;

			Object.keys(object).forEach((key) => {
      	$scope.userMetaDataEntries.push(object[key]);
    	});
			console.log("response of meta", $scope.userMetaDataEntries);
		});
	};

	$scope.deleteDataCall = function(idToDelete){
		let id = idToDelete;
		dataFactory.deleteData(id, "MetaData")
		.then((response) => {
			console.log("delorted");
		})
		.then((response) => {
			dataFactory.deleteData(id, "ToHit");
		})
		.then((response) => {
			dataFactory.deleteData(id, "ToWound");
		})
		.then((response) => {
			dataFactory.deleteData(id, "ArmorPen");
		})
		.then((response) => {
			dataFactory.deleteData(id, "FirstSave");
		})
		.then((response) => {
			dataFactory.deleteData(id, "SecondSave");
		});
	};
});