'use strict';

var utils = require('../utils/writer.js');
var AnsweredCalls = require('../service/AnsweredCallsService');

module.exports.getAnsweredCalls = function getAnsweredCalls (req, res, next) {
  var service = req.swagger.params['Service'].value;
  var day = req.swagger.params['Day'].value;
  var apiKey = req.swagger.params['apiKey'].value;
  var country = req.swagger.params['Country'].value;
  var from = req.swagger.params['From'].value;
  var to = req.swagger.params['To'].value;
  var threshold = req.swagger.params['Threshold'].value;
  AnsweredCalls.getAnsweredCalls(service,day,apiKey,country,from,to,threshold)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
