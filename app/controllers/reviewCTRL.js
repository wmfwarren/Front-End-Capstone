"use strict";

app.controller("reviewCTRL", function($scope, $route, $routeParams, dataFactory) {
	const toHitObject = {};
	const toWoundObject = {};
	const armorPenObject = {};
	const firstSaveObject = {};
	const secondSaveObject = {};


	const loadDataForReview = ((calcID) => {
		let calcID = $routeParams.reviewCalcID;
		dataFactory.getAnyCollectionData("ToHit", calcID)
		.then((response) => {
			toHitObject = response;
			dataFactory.getAnyCollectionData("ToWound", calcID)
			.then((response) => {
				toWoundObject = response;
				dataFactory.getAnyCollectionData("ArmorPen", calcID)
				.then((response) => {
					armorPenObject = response;
					dataFactory.getAnyCollectionData("FirstSave", calcID)
					.then((response) => {
						firstSaveObject = response;
						dataFactory.getAnyCollectionData("SecondSave", calcID)
						.then((response) => {
							secondSaveObject = response;
						});//second save
					});//first save
				});//armor pen
			});//closing the to wound then
		}); //closing the to hit then
	})();//closing iife
});