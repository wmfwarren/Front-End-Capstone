"use strict";

app.controller("calcCTRL", function ($scope, $route, dataFactory, objectService) {
	$scope.shootingBool = true;
	$scope.infantryBool = true;
	//To hit
	$scope.rerollAllShooting = false;
	$scope.rerollOnesShooting = false;
	$scope.rerollSingleShooting = false
	$scope.autoHitShooting = false;

	$scope.rerollAllClose = false;
	$scope.rerollOnesClose = false;
	$scope.rerollSingleClose = false;
	$scope.autoHitClose = false;
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

//this function determines that attack type
//this starts the calculation sequence
	$scope.attackSequenceType = function() {
		if($scope.shootingBool){
			toHitCalculator(shootingAttack($scope.ballisticSkill, $scope.numOfDiceShooting));
		} else {
			toHitCalculator(closeCombatAttack($scope.attackerWepSkill,
			 $scope.defenderWepSkill,
			 $scope.numOfDiceCloseCombat));
		}
	};
/////*** To hit value and successes calculators***\\\\\
//shooting to hit value calculator

	const toHitObject = new objectService.ToHit();
		//props on this new object
		//X this.shootingAttack = null; //boolean
		//X this.ballisticSkill = null; //1-10 is legal; 
		//X this.attackerWepSkill = null; //1-10 is legal; 
		//X this.defenderWepSkill = null; //1-10 is legal; 
		//X this.numOfDice = null;
		//X this.successes = 0;
		//X this.rerollOnes = false;
		//X this.rerollAll = false;
		//X this.rerollSingle = false;
		//X this.rerollTarget = null;
		//X this.autoHit = false;
		// this.calcID = null;

	function shootingAttack(BSkill, dice) {
		let target = null;
		let rerollGrtFive = false; //re rolls if the BS > 5
		let rerollTarget = null;
		toHitObject.shootingAttack = true;
		toHitObject.ballisticSkill = BSkill;
		toHitObject.numOfDice = dice;
		//evaluate the ballistic Skill and auto-hit characteristic
		if($scope.autoHitShooting){
			$scope.successesShooting = dice;
			return {
				shooting: true,
				hitTarget: null,
				autoHit: true,
				rerollTarget: null,
				rerollShooting: false
			};
		} else if (BSkill > 5) {
			target = 5;
			rerollTarget = 6 - (BSkill - 6);
			rerollGrtFive = true;
			toHitObject.rerollTarget = rerollTarget;
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

//close combat to hit value calculator

	function closeCombatAttack(atkWS, defWS, dice) {
		// 2D array for WS. 
		// first index + 1 is attacker skill
		// second index + 1 is defender skill
		toHitObject.shootingAttack = false;
		toHitObject.attackerWepSkill = atkWS;
		toHitObject.defenderWepSkill = defWS;
		toHitObject.numOfDice = dice;
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

		if($scope.autoHitClose){
			return {
				shooting: false,
				hitTarget: null,
				autoHit: true,
				rerollTarget: null,
				rerollShooting: false
			};
		} else {
			return {
				shooting: false,
				hitTarget: weaponSkillArray[atkWS - 1][defWS - 1], 
				autoHit: false,
				rerollTarget: null,
				rerollShooting: false
			};
		}
	}

	function toHitCalculator(attackReturnObject) {

		let hitTarget = attackReturnObject.hitTarget;

		//if auto hit do no math
		if(attackReturnObject.autoHit) {
			toHitObject.autoHit = true;
			if(toHitObject.shootingAttack){
				toHitObject.successes = toHitObject.numOfDice;
				$scope.successesShooting = toHitObject.numOfDice.toFixed(2);
				return;
			} else {
				toHitObject.successes = toHitObject.numOfDice;
				$scope.successesCloseCombat = toHitObject.numOfDice.toFixed(2);
				return;
			}
		}
		//rerolls for BS > 10 on shooting attacks
		if(toHitObject.shootingAttack && attackReturnObject.rerollTarget){
			let rerollTarget = attackReturnObject.rerollTarget;
			toHitObject.rerollTarget = rerollTarget;
			toHitObject.successes = toHitObject.numOfDice * (((attackReturnObject.hitTarget)/6.0) + ((1 * (1)/6.0) * (7 - attackReturnObject.rerollTarget)/6.0));
			printHitSuccesses();
			return;
		}
		//this rerolls all misses
		if($scope.rerollAllClose || $scope.rerollAllShooting) {
			toHitObject.rerollAll = true;
			if(toHitObject.shootingAttack){
				toHitObject.successes = toHitObject.numOfDice * (((7 - attackReturnObject.hitTarget)/6.0) + ((1 * (attackReturnObject.hitTarget - 1)/6.0) * (7 - attackReturnObject.hitTarget)/6.0));
			} else {

			}
			printHitSuccesses();
			return;
		}
		//this rerolls all 1s
		if($scope.rerollOnesClose || $scope.rerollOnesShooting) {
			toHitObject.rerollOnes = true;
			toHitObject.successes = toHitObject.numOfDice * (((7 - attackReturnObject.hitTarget)/6.0) + ((1 * (1.0)/6.0) * (7 - attackReturnObject.hitTarget)/6.0));
			printHitSuccesses();
			return;
		}
		//add reroll a single miss
		if($scope.rerollSingleClose || $scope.rerollSingleShooting) {
			toHitObject.rerollSingle = true;
			toHitObject.successes = (toHitObject.numOfDice * ((7 - attackReturnObject.hitTarget)/6.0)) + ((1 * (attackReturnObject.hitTarget - 1)/6.0) * (7 - attackReturnObject.hitTarget)/6.0);
			printHitSuccesses();
			return;
		}
		//this is the default normal hit functionality
		toHitObject.successes = toHitObject.numOfDice * ((7 - attackReturnObject.hitTarget)/6.0);
		printHitSuccesses();		
		return;
	} //end of to hit function

	// this function prints the successes of hit f(x) to DOM
	function printHitSuccesses(){
		if(toHitObject.shootingAttack){
			$scope.successesShooting = toHitObject.successes.toFixed(2);
		} else {
			$scope.successesCloseCombat = toHitObject.successes.toFixed(2);
		}
	}
/////*** To Wound Function***\\\\\

	// wound object
	// this.successfulHits = hits;
	// this.toughness = 0;
	// this.weaponStrength = 0; //1-10 is legal
	// this.rerollOnes = false;
	// this.rerollAll = false;
	// this.rerollSingle = false;
	// this.autoWoundOnX = false;
	// this.xForAutowound = null;
	// this.successes = 0;
	// this.calcID = null;
	var woundObjectFinal = {};
	var armorPenObjectFinal = {};

	$scope.damageSequenceType = function() {
		if($scope.infantryBool){
			var woundObject = new objectService.ToWound(toHitObject.successes);
			woundObjectFinal = toWoundCalculator(woundObject);
			console.log(woundObjectFinal);
		} else {
			var armorPenObject = new objectService.ArmorPen(toHitObject.successes);
			armorPenObjectFinal = armorPenCalculator(armorPenObject);
			console.log("armorPenObject", armorPenObjectFinal);
		}
	};

	function toWoundCalculator(woundObject) {
		let strength = $scope.weaponStrength;
		let toughness = $scope.defenderToughness;
		woundObject.weaponStrength = strength;
		woundObject.toughness = toughness;

		const woundThresholdArray = [ //10x10 array [str][tough]
		[4,5,6,6,null,null,null,null,null,null],
		[3,4,5,6,6,null,null,null,null,null],
		[2,3,4,5,6,6,null,null,null,null],
		[2,2,3,4,5,6,6,null,null,null],
		[2,2,2,3,4,5,6,6,null,null,],
		[2,2,2,2,3,4,5,6,6,null],
		[2,2,2,2,2,3,4,5,6,6],
		[2,2,2,2,2,2,3,4,5,6],
		[2,2,2,2,2,2,2,3,4,5],
		[2,2,2,2,2,2,2,2,3,4]];

		let woundTarget = woundThresholdArray[strength - 1][toughness - 1];

		console.log("wound target", woundTarget );

		if(woundTarget === null){ //if target is null then the defender cant be wounded
			$scope.successesVsInfantry = 0.0;
			woundObject.successes = 0;
			return woundObject;
		} else { //otherwise calculate wounds
			//reroll poison
			if ($scope.autoWoundOnX && $scope.rerollAllWound) {
				let targetX = $scope.autoWoundVal;
				woundObject.autoWoundOnX = true;
				woundObject.xForAutowound = targetX;
				woundObject.rerollAll = true;
				woundObject.successes = woundObject.successfulHits * (((7 - targetX)/6.0) + ((1 * (targetX - 1)/6.0) * (7 - targetX)/6.0));
				printWoundSuccesses(woundObject);
				return woundObject;
			}
			//reroll poison 1's
			if ($scope.autoWoundOnX && $scope.rerollOnesWound) {
				let targetX = $scope.autoWoundVal;
				woundObject.autoWoundOnX = true;
				woundObject.xForAutowound = targetX;
				woundObject.rerollOnes = true;
				woundObject.successes = woundObject.successfulHits * (((7 - targetX)/6.0) + ((1 * (1.0)/6.0) * (7 - targetX)/6.0));
				printWoundSuccesses(woundObject);
				return woundObject;
			}
			//auto wounding
			if($scope.autoWoundOnX) {
				let targetX = $scope.autoWoundVal;
				woundObject.autoWoundOnX = true;
				woundObject.xForAutowound = targetX;
				woundObject.successes = woundObject.successfulHits * ((7 - targetX)/6.0);
				printWoundSuccesses(woundObject);
				return woundObject;	
			}
			//reroll all
			if($scope.rerollAllWound){
				woundObject.rerollAll = true;
				woundObject.successes = woundObject.successfulHits * (((7 - woundTarget)/6.0) + ((1 * (woundTarget - 1)/6.0) * (7 - woundTarget)/6.0));
				printWoundSuccesses(woundObject);
				return woundObject;	
			}
			//reroll 1's 
			if($scope.rerollOnesWound){
				woundObject.rerollOnes = true;
				woundObject.successes = woundObject.successfulHits * (((7 - woundTarget)/6.0) + ((1 * (1.0)/6.0) * (7 - woundTarget)/6.0));
				printWoundSuccesses(woundObject);
				return woundObject;	
			}
			//normal wounding
				woundObject.successes = woundObject.successfulHits * ((7 - woundTarget)/6.0);
				printWoundSuccesses(woundObject);
				return woundObject;
			} //end to wound else statement
	} //end to wound function
	
	// armor pen obj
	// this.name = "ArmorPen";
	// this.successfulHits = hits;
	// this.dicePerHit = 0;
	// this.successes = 0;
	// this.armorVal = null; //10-15 is legal
	// this.weaponStrength = 0; //1-10 is legal
	// this.rerollAll = false;
	// this.calcID = null;

	function armorPenCalculator(penObject){
		let strength = $scope.weaponStrength;
		let armorValue = $scope.armorValue;
		penObject.dicePerHit = $scope.numOfAPDice;
		penObject.weaponStrength = strength;
		penObject.armorVal = armorValue;
		let numOfHits = penObject.successfulHits;
		let glanceTarget = armorValue - strength;
		let penTarget = glanceTarget + 1;

		let percentOverArray3D6 = [1.0,1.0,1.0,1.0,.9953,.9814,.9537,.9074,.8379,.7407,.6250,.5,.3750,.2592,.1620,.0925,.0462,.0185,.0046];
		let percentOverArray2D6 = [1.0,1.0,1.0,.9722,.9166,.8333,.7222,.5833,.4166,.2777,.1666,.0833,.0277];
		let percentOverArray1D6 = [1.0,.8333,.6667,.5000,.3333,.1667];

		if(penObject.dicePerHit === 3 ){
			penObject.successes = numOfHits * percentOverArray3D6[glanceTarget];
		} else if (penObject.dicePerHit === 2){
			if(glanceTarget > 12){
				penObject.successes = 0;
			} else {
				penObject.successes = numOfHits * percentOverArray2D6[glanceTarget];
			}
		} else {
			if (glanceTarget > 6) {
				penObject.successes = 0;
			} else {
				penObject.successes = numOfHits * percentOverArray1D6[glanceTarget];
			}
		}
		printWoundSuccesses(penObject);
		return penObject;
	} //end armor pen function

	function printWoundSuccesses(object){
		if(object.name === "ToWound"){
			$scope.successesVsInfantry = object.successes.toFixed(2);
		} else { //this else prints APen
			$scope.successesVsVehicle = object.successes.toFixed(2);
		}
	} //end wound/AP print function
/////*** Saves Functionality***\\\\\
		// this.name = "FirstSave";
		// this.successfulWounds = wounds;
		// this.saveBool = getSave; //true of false
		// this.successes = 0;
		// this.target = 0; //2-6 are legal
		// this.calcID = null;

		var firstSaveFinal = {};

	$scope.callFirstSave = function(){
		//call with the right vehicle or infantry input.
		if($scope.infantryBool){
			//call save calc with the infantry successes
			let firstSaveObject = new objectService.FirstSave(woundObjectFinal.successes);
			firstSaveFinal = saveCalculator(firstSaveObject);
		} else {
			//call save calc with the vehicle successes
			let firstSaveObject = new objectService.FirstSave(armorPenObjectFinal.successes);
			firstSaveFinal = saveCalculator(firstSaveObject);
		}
	}; //end first save call

	function saveCalculator(saveObject) {
		let saveTarget = $scope.firstSave;
		saveObject.target = saveTarget;
		let savesToRoll = saveObject.successfulWounds;

		//reroll all
		if ($scope.rerollAllSave1){
		saveObject.successes = savesToRoll * (((7 - saveTarget)/6.0) + ((1 * (saveTarget - 1)/6.0) * (7 - saveTarget)/6.0));
		saveObject.rerollAll = true;
		console.log("save reroll", saveObject);
		return saveObject;
		} 
		//reroll 1's
		if ($scope.rerollOnesSave1){
			saveObject.successes = savesToRoll * (((7 - saveTarget)/6.0) + ((1 * 1.0/6.0) * (7 - saveTarget)/6.0));
			saveObject.rerollAll = true;
			console.log("save reroll 1s", saveObject);
			return saveObject;
		}
		//standard
		//set bool if not set
		saveObject.successes = savesToRoll * ((7 - saveTarget)/6.0);
		console.log("save normal", saveObject);
		return saveObject;
	}
}); //closing controller