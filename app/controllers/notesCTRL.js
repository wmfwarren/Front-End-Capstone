"use strict";

app.controller("noteCTRL", function($scope, $routeParams, $location, dataFactory) {
	$scope.currentMetaData = {};
	$scope.tags = {};

	const loadMetaData = ((calcID) => {
		calcID = $routeParams.noteID;
		dataFactory.getAnyCollectionData("MetaData", calcID)
		.then((response) => {
			$scope.currentMetaData = response[Object.keys(response)[0]];
			$scope.tags = $scope.currentMetaData.tags.join(", ") 
		});
	})(); //close iife

	$scope.putData = ((meta) => {
		$scope.tags = $scope.tags.replace(/\s/g, "");
		$scope.tags = $scope.tags.split(/,/);
		meta.tags = $scope.tags;
		dataFactory.putMetaData(meta)
		.then((response) => {
			$location.path("/menu");
		});
	});

});
