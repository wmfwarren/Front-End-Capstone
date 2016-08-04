"use strict";

app.controller("menuCTRL", function ($scope, $route, authFactory, dataFactory) {

	$scope.userMetaDataEntries = [];


	$scope.getUserMetaDataForSearch = function() {
		console.log("I did a thing");
		dataFactory.getUserMetaData(authFactory.getUser())
		.then((response) => {
			let object = response;

			Object.keys(object).forEach((key) => {
      	$scope.userMetaDataEntries.push(object[key]);
    	});
			console.log("response of meta", $scope.userMetaDataEntries);
		}); 
	}; 

	$scope.getUserMetaDataForSearch();

	
	$scope.deleteDataCall = function(idToDelete){
		let id = idToDelete;
		let collectionNameArray = ["ToHit", "ToWound", "ArmorPen", "FirstSave", "SecondSave"];
		dataFactory.deleteData(id, "MetaData")
		.then((response) => {
			console.log("delorted");
		})
		.then((response) => {
			for(let i = 0; i < collectionNameArray.length; i++){
				let currentCollection = collectionNameArray[i];

				dataFactory.getDeleteByKey(currentCollection, id)
				.then((response) => {
					$scope.getUserMetaDataForSearch();
				});
			}
		});
		
	};
});