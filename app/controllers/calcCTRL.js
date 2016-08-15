"use strict";

app.controller("calcCTRL", function ($scope, $route, dataFactory, authFactory, objectService) {
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
		} else {
			var armorPenObject = new objectService.ArmorPen(toHitObject.successes);
			armorPenObjectFinal = armorPenCalculator(armorPenObject);
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

		let percentOverArray3D6 = [1.0,1.0,1.0,1.0,0.9953,0.9814,0.9537,0.9074,0.8379,0.7407,0.6250,0.5,0.3750,0.2592,0.1620,0.0925,0.0462,0.0185,0.0046];
		let percentOverArray2D6 = [1.0,1.0,1.0,0.9722,0.9166,0.8333,0.7222,0.5833,0.4166,0.2777,0.1666,0.0833,0.0277];
		let percentOverArray1D6 = [1.0,1.0,0.8333,0.6667,0.5000,0.3333,0.1667];

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
		console.log(penObject, "penObject")
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
	var secondSaveFinal = {};

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
		let saveTargetOne = $scope.firstSave;
		let saveTargetTwo = $scope.secondSave;
		if(saveObject.name === "FirstSave"){
			saveObject.target = saveTargetOne;
		} else {
			saveObject.target = saveTargetTwo;
		}

		let savesToRoll = saveObject.successfulWounds;

		//reroll all
		if ($scope.rerollAllSave1 && saveObject.name === "FirstSave"){
			saveObject.successes = saveObject.successfulWounds - (savesToRoll * (((7 - saveTargetOne)/6.0) + ((1 * (saveTargetOne - 1)/6.0) * (7 - saveTargetOne)/6.0)));
			saveObject.rerollAll = true;
			printSave(saveObject);
			return saveObject;
		} 
		if($scope.rerollAllSave2 && saveObject.name === "SecondSave"){
			saveObject.successes = (firstSaveFinal.successes) - (firstSaveFinal.successes * (((7 - saveTargetTwo)/6.0) + ((1 * (saveTargetTwo - 1)/6.0) * (7 - saveTargetTwo)/6.0)));
			saveObject.rerollAll = true;
			printSave(saveObject);
			return saveObject;
		}
		//reroll 1's
		if ($scope.rerollOnesSave1 && saveObject.name === "FirstSave"){
			saveObject.successes = saveObject.successfulWounds - (savesToRoll * (((7 - saveTargetOne)/6.0) + ((1 * 1.0/6.0) * (7 - saveTargetOne)/6.0)));
			saveObject.rerollAll = true;
			printSave(saveObject);
			return saveObject;
		}
		if($scope.reroll1sSave2 && saveObject.name === "SecondSave"){
			saveObject.successes = (firstSaveFinal.successes) - (firstSaveFinal.successes * (((7 - saveTargetTwo)/6.0) + ((1 * 1.0/6.0) * (7 - saveTargetTwo)/6.0))) ;
			saveObject.rerollAll = true;
			printSave(saveObject);
			return saveObject;
		}
		//standard
		//set bool if not set
		if (saveObject.name === "FirstSave"){
			saveObject.successes = saveObject.successfulWounds - (savesToRoll * ((7 - saveTargetOne)/6.0));
			printSave(saveObject);
			return saveObject;
		}
		if(saveObject.name === "SecondSave"){
			saveObject.successes = (firstSaveFinal.successes) - (firstSaveFinal.successes * ((7 - saveTargetTwo)/6.0));
			printSave(saveObject);
			return saveObject;
		}

	}

	function printSave(object) {
		if(object.name === "SecondSave"){
			$scope.secondSaveSuccesses = object.successes.toFixed(2);
		} else {
			$scope.firstSaveSuccesses = object.successes.toFixed(2);
		}
	}// end print save function
	///*Second save*\\\
	$scope.callSecondSave = function(){
	//call save calc with the infantry successes
		let secondSaveObject = new objectService.SecondSave(firstSaveFinal.successes, true);
		secondSaveFinal = saveCalculator(secondSaveObject);
	}//end second save call
/////***Save data functions***\\\\\
	$scope.postNewCalc = function() {
		let metaData = new objectService.MetaData();

		metaData.title = $scope.calcTitle;
		metaData.comment = $scope.note;
		metaData.tags = formatTags($scope.tags);
		metaData.uid = authFactory.getUser();

		dataFactory.postNewCalculation(metaData)
		.then((response) => {
			let calcID = dataFactory.currentCalcId;
			metaData.calcID = response.name;
			toHitObject.calcID = response.name;
			woundObjectFinal.calcID = response.name;
			armorPenObjectFinal.calcID = response.name;
			firstSaveFinal.calcID = response.name;
			secondSaveFinal.calcID = response.name;
			console.log("metaData", metaData);
		})
		.then((response) => {
			dataFactory.putCalculation(metaData);
		})
		.then((response) => {
			if($scope.successesShooting || $scope.successesCloseCombat) {
				dataFactory.postNewCalculation(toHitObject);
			}
		})			
		.then((response) => {
			if($scope.infantryBool){
				dataFactory.postNewCalculation(woundObjectFinal);
			} else {
				dataFactory.postNewCalculation(armorPenObjectFinal);
			}
		})			
		.then((response) => {
			if($scope.firstSaveSuccesses){
				dataFactory.postNewCalculation(firstSaveFinal);
			}
		})			
		.then((response) => {
			if($scope.secondSaveSuccesses){
				dataFactory.postNewCalculation(secondSaveFinal);
			}
		});		
	};

	function formatTags(tagString) {
		tagString = tagString.replace(/\s/g, "");
		let tagArray = tagString.split(/,/);
		return tagArray;
	}

	$scope.reload = function(){
		$route.reload();
	};
}); //closing controller