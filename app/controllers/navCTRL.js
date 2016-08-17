"use strict";

app.controller("navCTRL", function($scope, $route, authFactory) {

	$scope.logout = function(){
		 firebase.auth().signOut()
		 .then(function() {
			 // Sign-out successful.
			 console.log(authFactory.getUser(), "Logged out");
			 authFactory.setUser(null);
		 }, function(error) {
			 // An error happened.
			 console.log(error);
		 });
	 };
});