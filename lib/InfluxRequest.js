'use strict';

var request = require('request');
var _ = require('underscore');
var url = require('url');

var InfluxRequest = module.exports = function InfluxRequest(options) {
  this.options = options;
};

InfluxRequest.prototype.write = function (payload, callback) {

  if (!this.options.host) {
    return callback(new Error('Hosts available'));
  }
  var requestParams = {
    uri: url.format({
      protocol: 'http:',
      hostname: this.options.host,
      port: this.options.port
    }) + '/write',
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(payload)
  };

  if (this.options.username) {
    requestParams.qs = {
      u: this.options.username,
      p: this.options.password
    };
  }

  _.extend(requestParams, this.options.requestOptions || {});

  request(requestParams, callback);
};

