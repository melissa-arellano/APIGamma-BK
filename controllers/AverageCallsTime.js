'use strict';

var utils = require('../utils/writer.js');
var AverageCallsTime = require('../service/AverageCallsTimeService');

module.exports.getCallsbyAverage = function getCallsbyAverage (req, res, next) {
  var service = req.swagger.params['Service'].value;
  var day = req.swagger.params['Day'].value;
  var apiKey = req.swagger.params['apiKey'].value;
  var country = req.swagger.params['Country'].value;
  AverageCallsTime.getCallsbyAverage(service,day,apiKey,country)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
