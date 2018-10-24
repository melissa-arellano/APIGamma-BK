'use strict';


/**
 * Total answered calls filtered by country and date
 * This service returns the total of answered calls
 *
 * service String Name of the service
 * day String Format YYYY-MM-DD
 * apiKey String API Key to use the service
 * country String Example: Brazil (optional)
 * from String Format HH:MM (optional)
 * to String Format HH:MM (optional)
 * threshold Integer Number representing seconds (optional)
 * returns List
 **/
var AnsweredCallsImplementation = require('../implementation/AnsweredCallsImplementation');
exports.getAnsweredCalls = function(service,day,apiKey,country,from,to,threshold) {
  return new Promise(function(resolve, reject) {
    
    AnsweredCallsImplementation.put(service,day,apiKey,country,from,to,threshold).then((result)=>{
      if (Object.keys(result).length > 0) {
        resolve(result)
      } else {
        resolve();
      }
    }).catch((err) => {
      reject(err);
    });
    })
    
    /*var examples = {};
    examples['application/json'] = [ {
      "Service" : "ACARI",
      "Day" : "2018-02-10",
      "Country" : "Jamaica",
      "CallsAnswered" : 100,
      "From" : "08:00",
      "To" : "15:00",
      "Threshold" : 45,
      "apiKey" : "**********"
    }];

    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }*/
}

