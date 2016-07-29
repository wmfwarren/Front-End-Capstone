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

	this.ToHit = function(){
		this.shootingAttack = null; //boolean
		this.ballisticSkill = 0; //1-10 is legal; 0 is a assault attack
		this.attackerWepSkill = 0; //1-10 is legal; 0 is shooting
		this.defenderWepSkill = 0; //1-10 is legal; 0 is shooting
		this.numOfDice = null;
		this.successes = 0;
		this.rerollOnes = false;
		this.rerollAll = false;
		this.rerollSingle = false;
		this.rerollTarget = null;
		this.autoHit = false;
		this.calcID = null;
	};

	this.ToWound = function(hits){
		this.successfulHits = hits;
		this.toughness = 0;
		this.weaponStrength = 0; //1-10 is legal
		this.rerollOnes = false;
		this.rerollAll = false;
		this.rerollSingle = false;
		this.autoWoundOnX = false;
		this.xForAutowound = 7;
		this.successes = 0;
		this.calcID = null;
	};

	this.ArmorPen = function(hits){
		this.successfulHits = hits;
		this.dicePerHit = 0;
		this.successes = 0;
		this.armorVal = 10; //10-15 is legal
		this.weaponStrength = 0; //1-10 is legal
		this.rerollAll = false;
		this.calcID = null;
	};

	this.FirstSave = function(wounds, getSave){
		this.successfulWounds = wounds;
		this.saveBool = getSave; //true of false
		this.successes = 0;
		this.target = 0; //2-6 are legal
		this.calcID = null;
	};

	this.SecondSave = function(unsaved, getSave){
		this.successfulWounds = unsaved;
		this.saveBool = getSave; //true of false
		this.successes = 0;
		this.target = 0; //2-6 are legal
		this.calcID = null;
	};
})