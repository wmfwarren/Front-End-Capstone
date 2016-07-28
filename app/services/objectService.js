"use strict";

app.service("objectService", function(){

	this.MetaData = function(){
		this.calcID = null; //calcID = the key of the metaData object on the metaData obj
												//calcID = the associated metaData object on other objects
		this.uid = null; //user's ID
		this.title = "";
		this.comment= "";
		this.tags = [];
	};

	this.AttackType = function(){
		this.shootingAttack = true; //true for shooting false for assault
		this.calcID = null;
	};

	this.ToHit = function(dice, ID){
		this.ballisticSkill = 0; //1-10 is legal
		this.attackerWepSkill = 0; //1-10 is legal
		this.defenderWepSkill = 0; //1-10 is legal
		this.numOfDice = dice;
		this.successes = 0;
		this.rerollOnes = false;
		this.rerollAll = false;
		this.rerollSingle = false;
		this.autoHit = false;
		this.calcID = ID;
	};

	this.ToWound = function(hits, ID){
		this.successfulHits = hits;
		this.toughness = 0;
		this.weaponStrength = 0; //1-10 is legal
		this.rerollOnes = false;
		this.rerollAll = false;
		this.rerollSingle = false;
		this.autoWoundOnX = false;
		this.xForAutowound = 7;
		this.successes = 0;
		this.calcID = ID;
	};

	this.ArmorPen = function(hits, ID){
		this.successfulHits = hits;
		this.dicePerHit = 0;
		this.successes = 0;
		this.armorVal = 10; //10-15 is legal
		this.weaponStrength = 0; //1-10 is legal
		this.rerollAll = false;
		this.calcID = ID;
	};

	this.FirstSave = function(wounds, ID, getSave){
		this.successfulWounds = wounds;
		this.saveBool = getSave; //true of false
		this.successes = 0;
		this.target = 0; //2-6 are legal
		this.calcID = ID;
	};

	this.SecondSave = function(unsaved, ID, getSave){
		this.successfulWounds = unsaved;
		this.saveBool = getSave; //true of false
		this.successes = 0;
		this.target = 0; //2-6 are legal
		this.calcID = ID;
	};
})