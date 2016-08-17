"use strict";

app.controller("reviewCTRL", function($scope, $route, $routeParams, dataFactory) {
	$scope.toHitObject = {};
	$scope.toWoundObject = {};
	$scope.armorPenObject = {};
	$scope.firstSaveObject = {};
	$scope.secondSaveObject = {};


	const loadDataForReview = ((calcID) => {
		calcID = $routeParams.reviewCalcID;
		dataFactory.getAnyCollectionData("ToHit", calcID)
		.then((response) => {
			$scope.toHitObject = response[Object.keys(response)[0]];
			// console.log("tohit", toHitObject );
			dataFactory.getAnyCollectionData("ToWound", calcID)
			.then((response) => {
				$scope.toWoundObject = response[Object.keys(response)[0]];
				dataFactory.getAnyCollectionData("ArmorPen", calcID)
				.then((response) => {
					$scope.armorPenObject = response[Object.keys(response)[0]];
					dataFactory.getAnyCollectionData("FirstSave", calcID)
					.then((response) => {
						$scope.firstSaveObject = response[Object.keys(response)[0]];
						dataFactory.getAnyCollectionData("SecondSave", calcID)
						.then((response) => {
							$scope.secondSaveObject = response[Object.keys(response)[0]];
						});//second save
					});//first save
				});//armor pen
			});//closing the to wound then
		}); //closing the to hit then
	})();//closing iife
});