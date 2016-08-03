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

  const getUserMetaData = function(uid) {
  	console.log("Getting user ", uid);
  	return $q((resolve, reject) => {
      $http.get(`${firebaseURL}/MetaData.json/?orderBy="uid"&equalTo="${uid}"`)
        .success((dataObject) => {
          
          resolve(dataObject);
        })
        .error((error) => {
          reject(error);
        });
    });
  };

  const deleteData = function(ID, name){
		return $q((resolve, reject) => {
      $http.delete(
        `${firebaseURL}/${name}/${ID}.json`
      	)
        .success((data) => {
          // console.log("Data from delete", data );
          resolve(data);
        })
        .error((error) => {
          reject(error);
        });
    });
  };

  const getDeleteByKey = function(collection, calcID){
  	console.log("Getting calcID ", calcID);
  	return $q((resolve, reject) => {
      $http.get(`${firebaseURL}/${collection}.json/?orderBy="calcID"&equalTo="${calcID}"`)
        .success((dataObject) => {
          let key = Object.keys(dataObject)[0];
          deleteData(key, collection)
          .then ((repsonse) => {
          	// console.log("del response", repsonse);
          })
          resolve(dataObject);
        })
        .error((error) => {
          reject(error);
        });
    });
  }

return {currentCalcId, postNewCalculation, putCalculation, getUserMetaData, deleteData, getDeleteByKey};
})