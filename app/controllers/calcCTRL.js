"use strict";

app.controller("calcCTRL", function ($scope, $route, dataFactory, objectService) {
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

//this function determines that attack type
	function attackSequenceType() {
		if($scope.shootingBool){
			shootingAttack($scope.ballisticSkill, $scope.numOfDiceShooting);
		} else {
			closeCombatAttack();
		}
	}

	function shootingAttack(BSkill, dice) {
		let target = null;
		let rerollGrtFive = false; //rerolls if the BS > 5
		let rerollTarget = null;

		//evaluate the ballistic Skill and auto-hit characteristic
		if(autoHit){
			$scope.successesShooting = dice;
			return {
				shooting: true,
				hitTarget: null,
				autoHit: true,
				rerollTarget: null,
				rerollShooting: false
			};
		} else if (BSkill > 5) {
			target = 7 - BSkill;
			rerollTarget = 6 - (BSkill - 6);
			rerollGrtFive = true;
			return {
				shooting: true,
				hitTarget: target,
				autoHit: false,
				rerollTarget: rerollTarget,
				rerollShooting: true
			};
		} else {
			target = 7 - BSkill;
			return {
				shooting: true,
				hitTarget: target,
				autoHit: false,
				rerollTarget: null,
				rerollShooting: false
			};
		} 
	}

	function closeCombatAttack() {
		const weaponSkillArray = [
		[4,4,5,5,5,5,5,5,5,5],
		[3,4,4,4,5,5,5,5,5,5],
		[3,3,4,4,4,4,5,5,5,5],
		[3,3,3,4,4,4,4,4,5,5],
		[3,3,3,3,4,4,4,4,4,4],
		[3,3,3,3,3,4,4,4,4,4],
		[3,3,3,3,3,3,4,4,4,4],
		[3,3,3,3,3,3,3,4,4,4],
		[3,3,3,3,3,3,3,3,4,4],
		[3,3,3,3,3,3,3,3,3,4]];
	}

});