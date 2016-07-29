"use strict";

app.controller("calcCTRL", function ($scope, $route, dataFactory) {
	$scope.shootingBool = true;
	$scope.infantryBool = true;
	//To hit
	$scope.rerollAll = false;
	$scope.rerollOnes = false;
	$scope.rerollSingle = false
	$scope.autoHit = false;
	//to wound infantry
	$scope.rerollAllWound = false;
	$scope.rerollOnesWound = false;
	$scope.autoWoundOnX = false;
	//to pen vehicles
	$scope.rerollAllPen = false;
	//save 1
	$scope.rerollAllSave1 = false;
	$scope.rerollOnesSave1 = false;
	$scope.secondSaveBool = false;
	//save 2
	$scope.rerollAllSave2 = false;
	$scope.reroll1sSave2 = false;
	//these are testing vars
	$scope.successesShooting = 1;
	$scope.successesVsInfantry = 1;
	$scope.firstSaveSuccesses = 1;
});