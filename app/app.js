"use strict";

const app = angular.module("diceHammerApp", ["ngRoute"])
.constant("firebaseURL", "https://dice-math-engine.firebaseio.com/");

app.config(function($routeProvider) {

	$routeProvider
	.when("/login", {
		templateUrl: "partials/loginView.html",
		controller: "loginCTRL"
	}).
	when("/menu", {
		templateUrl: "partials/menuView.html",
		controller: "menuCTRL"
	})
	.when("/calcs", {
		templateUrl: "partials/calcView.html",
		controller: "calcCTRL"
	})
	.when("/review/:reviewCalcID", {
		templateUrl: "partials/reviewPartial.html",
		controller: "reviewCTRL"
	})
	.when("/note/:noteID", {
		templateUrl: "partials/notesView.html",
		controller: "noteCTRL"
	})
	.otherwise("/menu");
});