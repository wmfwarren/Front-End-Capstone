"use strict";

app.factory("dataFactory", function($q, $http, firebaseURL) {

	var currentCalcId = null;

	 const postNewCalculation = function(newCalc) {
    let queryString = newCalc.name;

   	return $q((resolve, reject) => {
      $http.post(
        `${firebaseURL}/${queryString}.json`, //need to update
        JSON.stringify(newCalc)
      	)
        .success((objectFromFirebase) => { // object returned is the key of the object in FB
          console.log("obj form fb name", objectFromFirebase.name);
          currentCalcId = objectFromFirebase.name;
          resolve(objectFromFirebase);
        })
        .error((error) => {
          reject(error);
        });
  	  });
 		};

 		const putCalculation = function(objectToEdit) {
    let queryString = objectToEdit.name;
    return $q((resolve, reject) => {
      $http.put(`${firebaseURL}/${queryString}/${objectToEdit.calcID}.json`,
        objectToEdit
      )
        .success((data) => {
          console.log("Data from PUT", data);
          resolve(data);
        })
        .error((error) => {
          reject(error);
        });
    });
  };

return {currentCalcId, postNewCalculation, putCalculation};
})