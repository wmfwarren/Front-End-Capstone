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
  	return $q((resolve, reject) => {
      $http.get(`${firebaseURL}/${collection}.json/?orderBy="calcID"&equalTo="${calcID}"`)
        .success((dataObject) => {
          let key = Object.keys(dataObject)[0];
          deleteData(key, collection)
          .then ((repsonse) => {
          	//nothing here
          })
          resolve(dataObject);
        })
        .error((error) => {
          reject(error);
        });
    });
  };

  const getAnyCollectionData = function(collection, calcID){
  	return $q((resolve, reject) => {
      $http.get(`${firebaseURL}/${collection}.json/?orderBy="calcID"&equalTo="${calcID}"`)
      .success((data) => {
      	resolve(data);
      })
      .error((error) => {
      	reject(error);
      });
  	});
  };

  const putMetaData = function(metaData) {
  	console.log("metaData in PUT", metaData)
  	return $q((resolve, reject) => {
  		$http.put(`${firebaseURL}/MetaData/${metaData.calcID}.json`, metaData)
  		.success((data) => {
  			resolve(data);
  		})
  		.error((error) => {
  			reject(error);
  		})
  	})
  };

return {currentCalcId, putMetaData, postNewCalculation, putCalculation, getUserMetaData, deleteData, getDeleteByKey, getAnyCollectionData};
})