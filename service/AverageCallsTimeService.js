'use strict';


/**
 * Average Time Answered Calls
 * This service returns average time answered calls and answered calls average waiting time
 *
 * service String Name of the service
 * day String Format YYYY-MM-DD
 * apiKey String API Key to use the service
 * country String Example: Brazil (optional)
 * returns List
 **/
exports.getCallsbyAverage = function(service,day,apiKey,country) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "Service" : "ACARI",
  "Day" : "2018-02-10",
  "Country" : "Jamaica",
  "AverageTalkTimeDuration" : 100,
  "AverageWaitingTimeOfCallsAnswered" : 200,
  "apiKey" : "**********"
}, {
  "Service" : "ACARI",
  "Day" : "2018-02-10",
  "Country" : "Jamaica",
  "AverageTalkTimeDuration" : 100,
  "AverageWaitingTimeOfCallsAnswered" : 200,
  "apiKey" : "**********"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

